import { SNS } from 'aws-sdk';
import { IEventPublisher } from '../../domain/ports/messaging/IEventPublisher';
const sns = new SNS();
export class SNSEventPublisher implements IEventPublisher {
  private topicArn = process.env.SNS_TOPIC_ARN || '';

  async publish(event: any): Promise<void> {
      const params = {
          Message: JSON.stringify(event),
          TopicArn: this.topicArn,
          MessageAttributes: {
            countryISO: {
              DataType: 'String',
              StringValue: event.countryISO,
            },
          },
      };
      await sns.publish(params).promise();
  }
}
