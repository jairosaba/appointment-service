import { APIGatewayProxyHandler } from "aws-lambda";
import { v4 as uuid } from "uuid";
import { appointmentSchema } from "../http/validators/appointmentValidator";
import { saveAppointment } from "../../infrastructure/db/dynamoRepository";
import { publishToSNS } from "../../infrastructure/messaging/snsPublisher";

export const handler: APIGatewayProxyHandler = async (event) => {
  console.log("Received event:", JSON.stringify(event, null, 2));

  try {
    const body = JSON.parse(event.body || "{}");
    console.log("Parsed request body:", body);

    const { error, value } = appointmentSchema.validate(body);
    if (error) {
      console.error("Validation error:", error.message);
      return {
        statusCode: 400,
        body: JSON.stringify({ error: error.message }),
      };
    }

    const appointment = {
      id: uuid(),
      createdAt: new Date().toISOString(),
      status: "pending",
      ...value,
    };
    console.log("Created appointment object:", appointment);

    await saveAppointment(appointment);
    console.log("Appointment saved to DynamoDB");

    await publishToSNS(appointment);
    console.log("Appointment published to SNS");

    return {
      statusCode: 201,
      body: JSON.stringify({ message: "Appointment created", appointment }),
    };
  } catch (err) {
    console.error("Error during processing:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Internal Server Error" }),
    };
  }
};
