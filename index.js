const duckdb = require("duckdb");

async function queryWithDuckDB() {
  const db = new duckdb.Database("");
  const con = db.connect();
  const start = performance.now(); // Start time for performance measurement

  const queries = [`SELECT * FROM 'userdata1.parquet' limit 2`];

  for (const query of queries) {
    await new Promise((resolve, reject) => {
      con.all(query, (err, rows) => {
        if (err) reject(err);
        console.log(`Result of query "${query}":`, rows);
        resolve();
      });
    });
  }

  const end = performance.now(); // End time for performance measurement
  console.log(`Queries executed in ${end - start} milliseconds`);
}
const memoryUsageBefore = process.memoryUsage();
console.log("Memory usage before queries:", memoryUsageBefore);

// Execute the queries
queryWithDuckDB()
  .then(() => {
    const memoryUsageAfter = process.memoryUsage();
    console.log("Memory usage after queries:", memoryUsageAfter);
  })
  .catch((err) => console.error(err));
