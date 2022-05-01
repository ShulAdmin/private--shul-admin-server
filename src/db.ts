import { AWSConfig } from './aws.config';
import AWS = require("aws-sdk");
import { CreateTableInput } from 'aws-sdk/clients/dynamodb';

class _DbCore {

  private db = this.createClients();

  private createClients() {
    const marshallOptions = {
      // Whether to automatically convert empty strings, blobs, and sets to `null`.
      convertEmptyValues: false, // false, by default.
      // Whether to remove undefined values while marshalling.
      removeUndefinedValues: true, // false, by default.
      // Whether to convert typeof object to map attribute.
      convertClassInstanceToMap: false, // false, by default.
    };

    const unmarshallOptions = {
      // Whether to return numbers as a string instead of converting them to native JavaScript numbers.
      wrapNumbers: false, // false, by default.
    };

    const translateConfig = { marshallOptions, unmarshallOptions };

    const ddb = new AWS.DynamoDB({
      endpoint: AWSConfig.getDynamoDbEnpoint(),
    });
    // Create the DynamoDB document client.
    const docClient = new AWS.DynamoDB.DocumentClient({
      // Whether to return numbers as a string instead of converting them to native JavaScript numbers.
      wrapNumbers: false, // false, by default.
      // Whether to automatically convert empty strings, blobs, and sets to `null`.
      convertEmptyValues: false, // false, by default.
      // Whether to remove undefined values while marshalling.
      // removeUndefinedValues: true, // false, by default.
      // Whether to convert typeof object to map attribute.
      // convertClassInstanceToMap: false, // false, by default.
    });
    return { ddb, docClient };
  }

  public async createTable(tableName: string, hashKey: string, rangeKey: string) {
    const params: CreateTableInput = {
      TableName: tableName,
      KeySchema: [ // The type of of schema.  Must start with a HASH type, with an optional second RANGE.
        { // Required HASH type attribute
          AttributeName: hashKey,
          KeyType: 'HASH',
        },
        {
          AttributeName: rangeKey,
          KeyType: 'RANGE'
        }
      ],
      AttributeDefinitions: [ // The names and types of all primary and index key attributes only
        { // Type attribute
          AttributeName: hashKey,
          AttributeType: 'S',
        },
        {
          AttributeName: rangeKey,
          AttributeType: 'S'
        }
        // ... more attributes ...
      ],
      ProvisionedThroughput: { // required provisioned throughput for the table
        ReadCapacityUnits: 5,
        WriteCapacityUnits: 5,
      },
      StreamSpecification: {
        StreamEnabled: false,
      },
    };

    try {
      const data = await this.db.ddb.createTable(params).promise();
      console.log('Success response', JSON.stringify(data, null, 2)); // successful response
    } catch (err) {
      console.log('Error response', JSON.stringify(err, null, 2)); // an error occurred
    }
  }

}

export const dbCore = new _DbCore();
