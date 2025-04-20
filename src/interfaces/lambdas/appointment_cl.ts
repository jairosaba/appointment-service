import { SQSEvent } from 'aws-lambda'
import { getPEConnection } from '../../infrastructure/db/mysqlClient'
import { publishToEventBridge } from '../../infrastructure/events/eventBridgePublisher'

export const handler = async (event: SQSEvent) => {
  const connection = await getPEConnection()
  console.log("connection", connection)

  for (const record of event.Records) {
    const appointment = JSON.parse(record.body)
    console.log("appointment", appointment)

    const data = JSON.parse(appointment.Message)
    console.log("data", data)

    try {
      await connection.execute(
        'INSERT INTO appointments (id, insuredId, scheduleId, countryISO) VALUES (?, ?, ?, ?)',
        [data.id, data.insuredId, data.scheduleId, data.countryISO]
      )

      console.log(`Cita ${data.id} insertada con éxito.`)

      await publishToEventBridge(data)

    } catch (error: any) {
      if (error.code === 'ER_DUP_ENTRY') {
        console.warn(`Cita duplicada (${data.id}), no se volverá a intentar ni publicar.`)
        continue
      }
      console.error('Error al insertar cita:', error)
      throw error
    }
  }

  await connection.end()
}
