import { EventBridge } from 'aws-sdk'

const eventBridge = new EventBridge()

export async function publishToEventBridge(payload: any) {
  await eventBridge.putEvents({
    Entries: [
      {
        Source: 'appointment.service',
        DetailType: 'AppointmentCompleted',
        Detail: JSON.stringify(payload),
        EventBusName: process.env.EVENT_BUS_NAME || 'appointment-bus',
      },
    ],
  }).promise()
}
