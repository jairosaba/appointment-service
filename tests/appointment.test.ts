import { handler as createAppointmentHandler } from '../src/interfaces/lambdas/createAppointment'
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import { v4 as uuid } from 'uuid'

jest.mock('uuid', () => ({ v4: () => 'mock-uuid' }))
jest.mock('../src/infrastructure/db/dynamoRepository', () => ({
  saveAppointment: jest.fn().mockResolvedValue(undefined),
}))
jest.mock('../src/infrastructure/messaging/snsPublisher', () => ({
  publishToSNS: jest.fn().mockResolvedValue(undefined),
}))

describe('createAppointment Lambda', () => {
  it('debe crear una cita válida y devolver 201', async () => {
    const event: Partial<APIGatewayProxyEvent> = {
      body: JSON.stringify({
        insuredId: 'insured-123',
        scheduleId: 'schedule-123',
        countryISO: 'PE',
      }),
    }

    const response = await createAppointmentHandler(event as any, {} as any, () => {}) as APIGatewayProxyResult

    expect(response.statusCode).toBe(201)
    const data = JSON.parse(response.body)
    expect(data.message).toBe('Appointment created')
    expect(data.appointment).toHaveProperty('id')
    expect(data.appointment.countryISO).toBe('PE')
  })

  it('debe devolver 400 si el body está malformado', async () => {
    const event: Partial<APIGatewayProxyEvent> = {
      body: JSON.stringify({ insuredId: '', countryISO: 'INVALID' }),
    }

    const result = await createAppointmentHandler(event as any, {} as any, () => {}) as APIGatewayProxyResult

    expect(result.statusCode).toBe(400)
    const response = JSON.parse(result.body || '{}')
    expect(response.error).toBeDefined()
  })

  it('debe devolver 500 en caso de error inesperado', async () => {
    jest.resetModules()
    const original = process.env.APPOINTMENTS_TABLE
    process.env.APPOINTMENTS_TABLE = undefined as any

    const event: Partial<APIGatewayProxyEvent> = {
      body: 'not-json',
    }

    const result = await createAppointmentHandler(event as any, {} as any, () => {}) as APIGatewayProxyResult
    expect(result.statusCode).toBe(500)

    process.env.APPOINTMENTS_TABLE = original
  })
})
