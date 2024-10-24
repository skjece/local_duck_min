const duckdb = require("duckdb");
const AWS = require("aws-sdk");

// Initialize DuckDB
const db = new duckdb.Database(":memory:");

// Replace with your Role ARN and S3 bucket details
const roleArn = "arn:aws:iam::084828557685:role/mac_s3_access_role";
const s3Bucket = "skjece-bucket-1"; // Replace with your bucket name
const s3Key = "wire_2m.parquet"; // Replace with your Parquet file path
const region = "eu-north-1"; // Replace with your AWS region

async function queryParquetFromS3() {
  try {
    // Initialize STS client to assume role
    const sts = new AWS.STS({});

    // Assume role to get temporary credentials
    const { Credentials } = await sts
      .assumeRole({
        RoleArn: roleArn,
        RoleSessionName: "duckdbS3Session",
      })
      .promise();

    // Update AWS SDK configuration to use assumed role credentials
    AWS.config.update({
      accessKeyId: Credentials.AccessKeyId,
      secretAccessKey: Credentials.SecretAccessKey,
      sessionToken: Credentials.SessionToken,
      region: region,
    });

    // DuckDB supports querying from S3 directly, using the s3:// protocol
    const s3ParquetUrl = `s3://${s3Bucket}/${s3Key}`;

    // Run a simple query from the S3 parquet file
    await new Promise((resolve, reject) => {
      db.all(
        `SELECT * FROM read_parquet('${s3ParquetUrl}') LIMIT 100`,
        (err, rows) => {
          if (err) reject(err);
          console.log("Total records:", rows);
          resolve();
        }
      );
    });
  } catch (error) {
    console.error("Error querying Parquet from S3 via assumed role:", error);
  }
}

// Execute the query function
queryParquetFromS3();
