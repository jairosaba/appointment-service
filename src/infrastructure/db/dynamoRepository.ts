import { DynamoDB } from "aws-sdk";
import { Appointment } from "../../domain/entities/Appointment";

const dynamo = new DynamoDB.DocumentClient({ region: "us-east-1" });
const table = process.env.APPOINTMENTS_TABLE || "Appointments";

export async function saveAppointment(appointment: Appointment) {
  await dynamo.put({ TableName: table, Item: appointment }).promise();
}

export async function getAppointmentsByInsuredId(insuredId: string) {
  console.log(`Buscando citas para insuredId: ${insuredId}`, table);

  try {
    const result = await dynamo
      .query({
        TableName: table,
        IndexName: "InsuredIndex",
        KeyConditionExpression: "insuredId = :id",
        ExpressionAttributeValues: { ":id": insuredId },
        Limit: 10,
      })
      .promise();

    console.log("Resultado de DynamoDB:", result);

    if (!result.Items || result.Items.length === 0) {
      return { error: `No appointments found for insuredId: ${insuredId}` };
    }

    return result.Items;
  } catch (error) {
    console.error("Error al consultar DynamoDB:", error);
    throw error; // Puedes lanzar el error nuevamente o manejarlo como corresponda
  }
}

export async function updateStatusInDynamo(id: string) {
  await dynamo
    .update({
      TableName: table,
      Key: { id },
      UpdateExpression: "set #s = :s",
      ExpressionAttributeNames: { "#s": "status" },
      ExpressionAttributeValues: { ":s": "completed" },
    })
    .promise();
}
