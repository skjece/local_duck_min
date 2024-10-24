const AWS = require("aws-sdk");

// Replace with your Role ARN and S3 bucket details
const roleArn = "arn:aws:iam::084828557685:role/mac_s3_access_role";
const s3Bucket = "skjece-bucket-1"; // Replace with your bucket name

async function getCredentialsFromRole() {
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
    });
    console.log({ Credentials });
  } catch (error) {
    console.error("Error querying Parquet from S3 via assumed role:", error);
  }
}

// Execute the query function
getCredentialsFromRole();
