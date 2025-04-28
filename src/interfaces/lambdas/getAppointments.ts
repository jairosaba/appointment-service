import { APIGatewayProxyHandler } from 'aws-lambda';
import { DynamoAppointmentRepository } from '../../infrastructure/db/DynamoAppointmentRepository';
import { GetAppointments } from '../../application/use_cases/GetAppointments';

export const getAppointments: APIGatewayProxyHandler = async () => {
    const appointmentRepository = new DynamoAppointmentRepository();
    const getAppointmentsUseCase = new GetAppointments(appointmentRepository);

    const appointments = await getAppointmentsUseCase.execute();

    return {
        statusCode: 200,
        body: JSON.stringify(appointments),
    };
};
