import { SQSEvent } from 'aws-lambda'
import { updateStatusInDynamo } from '../../infrastructure/db/dynamoRepository'

export const handler = async (event: SQSEvent) => {
  console.log('Event received:', JSON.stringify(event, null, 2))

  for (const record of event.Records) {
    try {
      const body = JSON.parse(record.body)
      console.log('Parsed body:', body)

      const appointment = body.id ? body : JSON.parse(body.Message)
      console.log('Final appointment object:', appointment)

      await updateStatusInDynamo(appointment.id)
      console.log(`Estado actualizado para cita ${appointment.id}`)
    } catch (err) {
      console.error('Error procesando mensaje SQS:', err)
    }
  }
  
}
