const sql = require("mssql");
const views = require("../views");

async function transactionsReport(req, res) {
  try {
    /*──────────── 1. parameters ────────────*/
    const {
      sy = null,
      sem = null,
      crs = null,
      mjr = null,
      from: fromStr = null,
      to: toStr = null,
      granularity = "daily",
    } = req.body;

    const fromDate = fromStr
      ? new Date(fromStr)
      : new Date(new Date().getFullYear(), 0, 1); // 1-Jan-YYYY
    const toDate = toStr ? new Date(toStr) : new Date(); // today

    /*──────────── 2. bucket helpers ────────*/
    let seriesCTE, bucketExpr, labelExpr;

    switch (granularity.toLowerCase()) {
      case "weekly":
        bucketExpr = `DATEADD(WEEK , DATEDIFF(WEEK , 0, t.dateoftrans), 0)`;
        labelExpr = `CONCAT('Week ', DATEDIFF(WEEK , @FromDate, s.period_key) + 1)`;
        seriesCTE = `
          series AS (
            SELECT DATEADD(WEEK , DATEDIFF(WEEK , 0, @FromDate), 0) AS period_key
            UNION ALL
            SELECT DATEADD(WEEK , 1, period_key)
              FROM series
             WHERE period_key < @ToDate
          )`;
        break;

      case "monthly":
        bucketExpr = `DATEFROMPARTS(YEAR(t.dateoftrans), MONTH(t.dateoftrans), 1)`;
        labelExpr = `FORMAT(s.period_key, 'MMM yyyy')`;
        seriesCTE = `
          series AS (
            SELECT DATEFROMPARTS(YEAR(@FromDate), MONTH(@FromDate), 1) AS period_key
            UNION ALL
            SELECT DATEADD(MONTH , 1, period_key)
              FROM series
             WHERE period_key < @ToDate
          )`;
        break;

      case "yearly":
        bucketExpr = `DATEFROMPARTS(YEAR(t.dateoftrans), 1, 1)`;
        labelExpr = `FORMAT(s.period_key, 'yyyy')`;
        seriesCTE = `
          series AS (
            SELECT DATEFROMPARTS(YEAR(@FromDate), 1, 1) AS period_key
            UNION ALL
            SELECT DATEADD(YEAR , 1, period_key)
              FROM series
             WHERE period_key < @ToDate
          )`;
        break;

      /*– daily (default) –*/
      default:
        bucketExpr = `CAST(t.dateoftrans AS DATE)`;
        labelExpr = `FORMAT(s.period_key, 'yyyy-MM-dd')`;
        seriesCTE = `
          series AS (
            SELECT CAST(@FromDate AS DATE) AS period_key
            UNION ALL
            SELECT DATEADD(DAY , 1, period_key)
              FROM series
             WHERE period_key < @ToDate
          )`;
    }

    /*──────────── 3. filters ───────────────*/
    const filters = `
        t.deleted      = 0
        AND t.dateoftrans >= @FromDate
        AND t.dateoftrans <= @ToDate
        AND (@Sy  IS NULL OR t.sy  = @Sy )
        AND (@Sem IS NULL OR t.sem = @Sem)
        AND (@Crs IS NULL OR t.crs = @Crs)
        AND (@Mjr IS NULL OR t.mjr = @Mjr)
    `;

    /*──────────── 4. main query ────────────*/
    const query = `
      ;WITH
      ${seriesCTE},

      agg AS (
        SELECT
          ${bucketExpr} AS period_key,
          SUM(CASE WHEN t._log IN ('INSTALLMENT_FEE','DOWN_PAYMENT')
                   THEN t.cash ELSE 0 END)                     AS tuitionCash,
          SUM(CASE WHEN t._log = 'PAY_OTHER'
                   THEN t.cash ELSE 0 END)                     AS otherCash
        FROM sa_transaction t
        WHERE ${filters}
        GROUP BY ${bucketExpr}
      )

      SELECT
        ${labelExpr}                               AS period,
        COALESCE(agg.tuitionCash, 0)              AS tuitionCash,
        COALESCE(agg.otherCash,   0)              AS otherCash,
        COALESCE(agg.tuitionCash, 0) +
        COALESCE(agg.otherCash,   0)              AS totalCash
      FROM series s
      LEFT JOIN agg
             ON agg.period_key = s.period_key
      ORDER BY s.period_key
      OPTION (MAXRECURSION 0);
    `;

    /*──────────── 5. execute ───────────────*/
    const rows = await views.queryDatabase(query, [
      { name: "FromDate", type: sql.Date, value: fromDate },
      { name: "ToDate", type: sql.Date, value: toDate },
      { name: "Sy", type: sql.NVarChar, value: sy },
      { name: "Sem", type: sql.NVarChar, value: sem },
      { name: "Crs", type: sql.NVarChar, value: crs },
      { name: "Mjr", type: sql.NVarChar, value: mjr },
    ]);

    res.json(rows[0]); // rows[0] = recordset
  } catch (err) {
    console.error(err);
    res.status(500).send("Error retrieving cash report from database");
  }
}

async function transactionsByCourse(req, res) {
  try {
    /*──────── 1. parameters ────────*/
    const {
      sy = null,
      sem = null,
      from: fromStr = null,
      to: toStr = null,
    } = req.body;

    const fromDate = fromStr
      ? new Date(fromStr)
      : new Date(new Date().getFullYear(), 0, 1); // 1-Jan-YYYY

    const toDate = toStr ? new Date(toStr) : new Date(); // today

    /*──────── 2. query ─────────────*/
    const query = `
      SELECT
        t.crs                                       AS course,
        NULLIF(t.mjr,'')                            AS mjr,   -- show null instead of empty string
        SUM(CASE WHEN t._log IN ('INSTALLMENT_FEE','DOWN_PAYMENT')
                 THEN t.cash ELSE 0 END)            AS tuitionCash,
        SUM(CASE WHEN t._log = 'PAY_OTHER'
                 THEN t.cash ELSE 0 END)            AS otherCash,
        SUM(CASE WHEN t._log IN ('INSTALLMENT_FEE','DOWN_PAYMENT','PAY_OTHER')
                 THEN t.cash ELSE 0 END)            AS totalCash
      FROM sa_transaction t
      WHERE t.deleted         = 0
        AND t.dateoftrans    >= @FromDate
        AND t.dateoftrans    <= @ToDate
        AND (@Sy  IS NULL OR t.sy  = @Sy )
        AND (@Sem IS NULL OR t.sem = @Sem)
      GROUP BY t.crs, t.mjr
      ORDER BY t.crs, t.mjr;
    `;

    /*──────── 3. execute ───────────*/
    const rows = await views.queryDatabase(query, [
      { name: "FromDate", type: sql.Date, value: fromDate },
      { name: "ToDate", type: sql.Date, value: toDate },
      { name: "Sy", type: sql.NVarChar, value: sy },
      { name: "Sem", type: sql.NVarChar, value: sem },
    ]);

    res.json(rows[0]); // recordset
  } catch (err) {
    console.error(err);
    res.status(500).send("Error generating course-wise cash report");
  }
}

module.exports = { transactionsReport, transactionsByCourse };
