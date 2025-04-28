import { IEventPublisher } from "../../domain/ports/messaging/IEventPublisher";
import { EventBridge } from "aws-sdk";

const eventBridge = new EventBridge();

export class EventBridgePublisher implements IEventPublisher {
  private eventBusName = process.env.EVENT_BUS_NAME || "appointment-bus";

  async publish(event: any): Promise<void> {
    await eventBridge
      .putEvents({
        Entries: [
          {
            Source: "appointment.service",
            DetailType: "AppointmentCompleted",
            Detail: JSON.stringify(event),
            EventBusName: this.eventBusName,
          },
        ],
      })
      .promise();
  }
}
