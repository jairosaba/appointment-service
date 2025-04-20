import { SNS } from 'aws-sdk';

const sns = new SNS();

export async function publishToSNS(message: any) {
  try {
    await sns.publish({
      TopicArn: process.env.SNS_TOPIC_ARN,
      Message: JSON.stringify(message),
      MessageAttributes: {
        countryISO: {
          DataType: 'String',
          StringValue: message.countryISO,
        },
      },
    }).promise();
  } catch (error) {
    console.error('Error al publicar en SNS:', error);
    throw error;
  }
}
