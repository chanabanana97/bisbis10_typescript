import { Client } from "pg";

const client = new Client({
  host: "localhost",
  port: 5432,
  user: "postgres",
  password: "example",
  database: "postgres",
});

client.connect((err: Error) => {
  if (err) {
    console.error("DB connection error", err.stack);
  } else {
    console.log("connected to DB");
  }
});


exports.executeQuery = async function(query: string, params: any[]) {
  try {
    const result = await client.query(query, params);
    return result.rows;
  } catch (err) {
    console.error("Error executing query", err);
    throw err;
  }
}

// // Update operation
// export async function updateTable(tableName: string, id: any, updates: Record<string, any>) {
//   const fields = Object.keys(updates).filter(field => field !== 'id'); // Exclude 'id' field
//   const setClause = fields.map((field, index) => `${field} = COALESCE($${index + 1}, ${field})`).join(', ');
//   const query = `UPDATE ${tableName} SET ${setClause} WHERE id = $${fields.length + 1} RETURNING id`;
//   const values = [...Object.values(updates), id];
//   return exec(query, values);
// }


exports.client = client;
