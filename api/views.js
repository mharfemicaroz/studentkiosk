var config = require("./dbconfig");
const sql = require("mssql");

async function queryDatabase(query, parameters = []) {
  try {
    let pool = await sql.connect(config);
    let request = pool.request();
    parameters.forEach((param) => {
      request = request.input(param.name, param.type, param.value);
    });
    let result = await request.query(query);
    return result.recordsets;
  } catch (error) {
    console.error("Database query error:", error);
    throw error; // Rethrow to handle it elsewhere if necessary
  }
}

async function getAll(tableName) {
  return await queryDatabase(`SELECT * FROM ${tableName}`);
}

async function getById(tableName, id) {
  return await queryDatabase(`SELECT * FROM ${tableName} WHERE id = @id`, [
    { name: "id", type: sql.Int, value: id },
  ]);
}

async function insertInto(tableName, data) {
  const fields = Object.keys(data);
  const values = fields.map((field) => `@${field}`);
  const parameters = fields.map((field) => ({
    name: field,
    type: sql.NVarChar /* or other types based on schema */,
    value: data[field],
  }));
  const query = `
    INSERT INTO ${tableName} (${fields.join(", ")})
    VALUES (${values.join(", ")})
  `;
  return await queryDatabase(query, parameters);
}

async function updateById(tableName, id, data) {
  const updates = Object.keys(data).map((field) => `${field} = @${field}`);
  const parameters = Object.keys(data).map((field) => ({
    name: field,
    type: sql.NVarChar,
    value: data[field],
  }));
  parameters.push({ name: "id", type: sql.Int, value: id }); // For the WHERE clause
  const query = `UPDATE ${tableName} SET ${updates.join(", ")} WHERE id = @id`;
  return await queryDatabase(query, parameters);
}

async function deleteById(tableName, id) {
  const query = `DELETE FROM ${tableName} WHERE id = @id`;
  const parameters = [{ name: "id", type: sql.Int, value: id }];
  return await queryDatabase(query, parameters);
}

async function filterBy(tableName, columnNames, columnValues) {
  if (columnNames.length !== columnValues.length) {
    throw new Error("Column names and values must be of the same length.");
  }

  const conditions = columnNames.map((col, index) => `${col} = @value${index}`);
  const parameters = columnNames.map((col, index) => ({
    name: `value${index}`,
    type: sql.NVarChar, // Adjust this type based on the column data type
    value: columnValues[index],
  }));

  const query = `SELECT * FROM ${tableName} WHERE ${conditions.join(" AND ")}`;
  return await queryDatabase(query, parameters);
}

async function search(tableName, searchQuery, columns) {
  const searchCondition = columns
    .map((column) => `${column} LIKE @searchQuery`)
    .join(" OR ");
  const parameters = [
    { name: "searchQuery", type: sql.NVarChar, value: `%${searchQuery}%` },
  ];
  const query = `SELECT * FROM ${tableName} WHERE ${searchCondition}`;
  return await queryDatabase(query, parameters);
}

async function paginate(tableName, pageSize, pageNumber) {
  const offset = (pageNumber - 1) * pageSize;
  const query = `SELECT * FROM ${tableName} ORDER BY id OFFSET @offset ROWS FETCH NEXT @pageSize ROWS ONLY`;
  const parameters = [
    { name: "pageSize", type: sql.Int, value: pageSize },
    { name: "offset", type: sql.Int, value: offset },
  ];
  return await queryDatabase(query, parameters);
}

async function aggregate(tableName, column, operation) {
  const query = `SELECT ${operation}(${column}) AS result FROM ${tableName}`;
  return await queryDatabase(query);
}

async function joinTables(
  baseTable,
  joinTable,
  baseColumn,
  joinColumn,
  selectColumns,
  joinType = "INNER"
) {
  const columns = selectColumns.join(", ");
  const query = `SELECT ${columns} FROM ${baseTable} ${joinType} JOIN ${joinTable} ON ${baseTable}.${baseColumn} = ${joinTable}.${joinColumn}`;
  return await queryDatabase(query);
}

async function bulkInsert(tableName, data) {
  const fields = Object.keys(data[0]);
  const valuesPlaceholder = data
    .map((_) => `(${fields.map(() => "?").join(", ")})`)
    .join(", ");
  const values = data.flatMap((obj) => fields.map((field) => obj[field]));
  const query = `INSERT INTO ${tableName} (${fields.join(
    ", "
  )}) VALUES ${valuesPlaceholder}`;
  return await queryDatabase(
    query,
    values.map((value) => ({ value }))
  );
}

async function transaction(operations) {
  const pool = await sql.connect(config);
  const transaction = new sql.Transaction(pool);
  try {
    await transaction.begin();
    const result = await operations(transaction);
    await transaction.commit();
    return result;
  } catch (error) {
    await transaction.rollback();
    console.error("Transaction error:", error);
    throw error;
  }
}

module.exports = {
  queryDatabase,
  getAll,
  getById,
  insertInto,
  updateById,
  deleteById,
  filterBy,
  search,
  paginate,
  aggregate,
  joinTables,
  bulkInsert,
  transaction,
};
