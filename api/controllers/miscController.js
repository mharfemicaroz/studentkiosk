const views = require("../views");
const sql = require("mssql");

async function viewSchedule(req, res) {
  try {
    const { studentno, sy, semester } = req.body;
    const schedules = await views.queryDatabase(
      "SELECT Row_number() OVER( partition BY a.id ORDER BY s.term, s.time ) AS STDNO, m.studentno, a.category, Concat( m.surname, ', ', m.firstname, ' ', m.middlename ) AS fullname, m.coursecode, M.major, M.yrlevel, M.sex, ( SELECT Sum(units) FROM schedule AS sc WHERE sc.assessmentid = a.id ) AS totalunits, s.subject_no_code, s.subjectcode, s.day, s.room_no, s.section, s.subjectdesc, s.term, s.time, ( s.units - Isnull(s.lab_units, 0) ) AS units, A.dateenrolled, CONCAT(a.schoolyear,'/',a.semester) as semsy, a.id, m.status FROM masterlist AS m INNER JOIN assessment AS a ON m.studentno = a.studentno INNER JOIN schedule AS s ON a.id = s.assessmentid WHERE M.studentno = @Studentno AND a.semester = @Semester AND a.schoolyear = @Sy AND s.add_drop_flag = 'NA'",
      [
        { name: "Studentno", type: sql.NVarChar, value: studentno },
        { name: "Sy", type: sql.NVarChar, value: sy },
        { name: "Semester", type: sql.NVarChar, value: semester },
      ]
    );
    res.json(schedules[0]);
  } catch (error) {
    res.status(500).send("Error retrieving schedules from database");
  }
}

async function viewEvaluation(req, res) {
  try {
    const { studentno } = req.body;
    const dt = await views.queryDatabase(
      "SELECT (select distinct surname from masterlist WHERE studentno=@Studentno) as surname, (select distinct firstname from masterlist WHERE studentno=@Studentno) as firstname, (select distinct middlename from masterlist WHERE studentno=@Studentno) as middlename, p.yrlevel, p.semester, p.sub_code, p.subject_title, p.sub_units, COALESCE(g.unitgrade, NULL) AS grade, COALESCE(g.reexam, NULL) AS reexam FROM (SELECT DISTINCT sub_code, yrlevel, semester, subject_title, sub_units FROM prospectus WHERE coursecode = (select distinct coursecode from masterlist WHERE studentno=@Studentno) and major =(select distinct major from masterlist WHERE studentno=@Studentno)) AS p LEFT JOIN (SELECT * FROM gradingsheet WHERE studentno=@Studentno) AS g ON p.sub_code = g.subjectcode ORDER BY p.yrlevel, p.semester, p.sub_code",
      [{ name: "Studentno", type: sql.NVarChar, value: studentno }]
    );
    res.json(dt[0]);
  } catch (error) {
    res.status(500).send("Error retrieving records from database");
  }
}

async function viewAssessment(req, res) {
  try {
    const { sy, sem, crs, mjr, lvl } = req.body;
    const dt = await views.queryDatabase(
      "Select miscid,name,type,amount,remarks,levels from sa_tuition_miscs where tid = (select distinct id from sa_tuition where sy=@Sy and sem=@Sem and crs=@Crs and mjr=@Mjr) and levels like '%' + @Lvl + '%'",
      [
        { name: "Sy", type: sql.NVarChar, value: sy },
        { name: "Sem", type: sql.NVarChar, value: sem },
        { name: "Crs", type: sql.NVarChar, value: crs },
        { name: "Mjr", type: sql.NVarChar, value: mjr },
        { name: "Lvl", type: sql.NVarChar, value: lvl },
      ]
    );
    res.json(dt[0]);
  } catch (error) {
    res.status(500).send("Error retrieving records from database");
  }
}

async function viewPayments(req, res) {
  try {
    const { transid } = req.body;
    const dt = await views.queryDatabase(
      "select id,FORMAT(dateoftrans, 'MMMM, dd yyyy HH:mm:ss') as formatdate, dateoftrans,units,balance,cash,orno,remarks, _log, (select distinct username from users where id = sa_transaction.user_id) as cashier, CASE WHEN STR(or_id) is not null then 'RELEASED' else STR(or_id) end as or_id from sa_transaction where deleted = 0 and trans_id = @Transid and _log <> 'PAY_OTHER' order by id desc",
      [{ name: "Transid", type: sql.NVarChar, value: transid }]
    );
    res.json(dt[0]);
  } catch (error) {
    res.status(500).send("Error retrieving records from database");
  }
}

async function countExams(req, res) {
  try {
    const type = req.params.type;
    let dt = await views.queryDatabase(`select ${type} from exams`);
    res.json({ n: parseFloat(dt[0][0][type]) });
  } catch (error) {
    res.status(500).send("Error retrieving records from database");
  }
}

async function getCourse_category(req, res) {
  try {
    const { course, major } = req.body;
    let dt = await views.queryDatabase(
      `select * from course where coursecode = @Course and major = @Major`,
      [
        { name: "Course", type: sql.NVarChar, value: course },
        { name: "Major", type: sql.NVarChar, value: major },
      ]
    );
    res.json(dt[0]);
  } catch (error) {
    res.status(500).send("Error retrieving records from database");
  }
}

async function getDefSYSEM(req, res) {
  try {
    let dt = await views.queryDatabase(`select * from semsy_default`);
    res.json(dt[0]);
  } catch (error) {
    res.status(500).send("Error retrieving records from database");
  }
}

module.exports = {
  viewSchedule,
  viewEvaluation,
  viewAssessment,
  viewPayments,
  countExams,
  getCourse_category,
  getDefSYSEM,
};
