import { APIGatewayProxyHandler } from 'aws-lambda'
import { getAppointmentsByInsuredId } from '../../infrastructure/db/dynamoRepository'

export const handler: APIGatewayProxyHandler = async (event) => {
  const insuredId = event.pathParameters?.insuredId
  console.log("insuredId",insuredId)
  if (!insuredId) {
    return { statusCode: 400, body: JSON.stringify({ error: 'Missing insuredId' }) }
  }
  console.log("antes de consultar por id")
  const items = await getAppointmentsByInsuredId(insuredId)
  console.log("items",items)
  return {
    statusCode: 200,
    body: JSON.stringify(items),
  }
}