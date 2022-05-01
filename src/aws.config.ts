import AWS = require("aws-sdk");

export class AWSConfig {

  public static update() {
    AWS.config.update({
      apiVersion: '2012-08-10',
      region: AWSConfig.getRegion(),
      // // accessKeyId default can be used while using the downloadable version of DynamoDB.
      // // For security reasons, do not store AWS Credentials in your files. Use Amazon Cognito instead.
      accessKeyId: AWSConfig.getAccessKeyId(),
      // // secretAccessKey default can be used while using the downloadable version of DynamoDB.
      // // For security reasons, do not store AWS Credentials in your files. Use Amazon Cognito instead.
      secretAccessKey: AWSConfig.getSecretAccessKey()
    });
  }

  public static getRegion() {
    return `us-east-1`;
  }

  public static getAccessKeyId() {
    return `socmo`;
  }

  public static getSecretAccessKey() {
    return `479f4n`;
  }

  public static getDynamoDbEnpoint() {
    return `http://localhost:8888`;
  }

}