import { IAppointmentRepository } from "../../domain/ports/repositories/IAppointmentRepository";
import DynamoDB from "aws-sdk/clients/dynamodb";

const dynamoDb = new DynamoDB.DocumentClient();

export class DynamoAppointmentRepository implements IAppointmentRepository {
  private tableName = process.env.APPOINTMENT_TABLE || "";

  async create(appointment: any): Promise<any> {
    const params = {
      TableName: this.tableName,
      Item: appointment,
    };
    await dynamoDb.put(params).promise();
    return appointment;
  }

  async getAll(): Promise<any[]> {
    const params = {
      TableName: this.tableName,
    };
    const result = await dynamoDb.scan(params).promise();
    return result.Items as any[];
  }

  async updateStatus(id: string, status: string): Promise<any> {
    const params = {
      TableName: this.tableName,
      Key: { id },
      UpdateExpression: "set #status = :status",
      ExpressionAttributeNames: { "#status": "status" },
      ExpressionAttributeValues: { ":status": status },
      ReturnValues: "ALL_NEW",
    };
    const result = await dynamoDb.update(params).promise();
    return result.Attributes;
  }
}
