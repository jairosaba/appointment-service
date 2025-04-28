import { APIGatewayProxyHandler } from 'aws-lambda';
import { DynamoAppointmentRepository } from '../../infrastructure/db/DynamoAppointmentRepository';
import { SNSEventPublisher } from '../../infrastructure/messaging/SNSEventPublisher';
import { CreateAppointment } from '../../application/use_cases/CreateAppointment';

export const createAppointment: APIGatewayProxyHandler = async (event) => {
    const appointmentRepository = new DynamoAppointmentRepository();
    const eventPublisher = new SNSEventPublisher();
    const createAppointmentUseCase = new CreateAppointment(appointmentRepository, eventPublisher);

    try {
        const body = JSON.parse(event.body || '{}');
        if (!body.insuredId || !body.scheduleId || !body.countryISO) {
            return {
                statusCode: 400,
                body: JSON.stringify({ error: 'Invalid request body' }),
            };
        }
        const result = await createAppointmentUseCase.execute(body);

        return {
            statusCode: 201,
            body: JSON.stringify(result),
        };
    } catch (error) {
        console.error('Error in createAppointment Lambda:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Internal Server Error' }),
        };
    }
};
