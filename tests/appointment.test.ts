import { createAppointment } from '../src/interfaces/lambdas/createAppointment';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';

jest.mock('uuid', () => ({ v4: () => 'mock-uuid' }));

jest.mock('../src/infrastructure/db/DynamoAppointmentRepository', () => ({
  DynamoAppointmentRepository: jest.fn().mockImplementation(() => ({
    create: jest.fn().mockResolvedValue({
      id: 'mock-uuid',
      insuredId: 'insured-123',
      scheduleId: 'schedule-123',
      countryISO: 'PE',
    }),
    getAll: jest.fn(),
    updateStatus: jest.fn(),
  })),
}));

jest.mock('../src/infrastructure/messaging/SNSEventPublisher', () => ({
  SNSEventPublisher: jest.fn().mockImplementation(() => ({
    publish: jest.fn().mockResolvedValue(undefined),
  })),
}));

describe('createAppointment Lambda', () => {
  it('debe crear una cita válida y devolver 201', async () => {
    const event: Partial<APIGatewayProxyEvent> = {
      body: JSON.stringify({
        insuredId: 'insured-123',
        scheduleId: 'schedule-123',
        countryISO: 'PE',
      }),
    };

    const response = await createAppointment(event as any, {} as any, () => {}) as APIGatewayProxyResult;

    expect(response.statusCode).toBe(201);
    const data = JSON.parse(response.body);
    expect(data.id).toBe('mock-uuid');
    expect(data.countryISO).toBe('PE');
  });

  it('debe devolver 400 si el body está malformado', async () => {
    const event: Partial<APIGatewayProxyEvent> = {
      body: JSON.stringify({ insuredId: '', countryISO: 'INVALID' }),
    };

    const result = await createAppointment(event as any, {} as any, () => {}) as APIGatewayProxyResult;

    expect(result.statusCode).toBe(400);
    const response = JSON.parse(result.body || '{}');
    expect(response.error).toBeDefined();
  });

  it('debe devolver 500 en caso de error inesperado', async () => {
    jest.resetModules();
    const original = process.env.APPOINTMENTS_TABLE;
    process.env.APPOINTMENTS_TABLE = undefined as any;

    const event: Partial<APIGatewayProxyEvent> = {
      body: 'not-json',
    };

    const result = await createAppointment(event as any, {} as any, () => {}) as APIGatewayProxyResult;
    expect(result.statusCode).toBe(500);

    process.env.APPOINTMENTS_TABLE = original;
  });
});
