import { APIGatewayProxyHandler } from 'aws-lambda';
import { DynamoAppointmentRepository } from '../../infrastructure/db/DynamoAppointmentRepository';
import { UpdateAppointmentStatus } from '../../application/use_cases/UpdateAppointmentStatus';

export const updateStatus: APIGatewayProxyHandler = async (event) => {
    const appointmentRepository = new DynamoAppointmentRepository();
    const updateStatusUseCase = new UpdateAppointmentStatus(appointmentRepository);

    const body = JSON.parse(event.body || '{}');
    const { id, status } = body;

    const updated = await updateStatusUseCase.execute(id, status);

    return {
        statusCode: 200,
        body: JSON.stringify(updated),
    };
};
