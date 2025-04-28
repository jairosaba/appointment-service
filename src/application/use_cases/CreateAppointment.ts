import { IAppointmentRepository } from '../../domain/ports/repositories/IAppointmentRepository';
import { IEventPublisher } from '../../domain/ports/messaging/IEventPublisher';

export class CreateAppointment {
    constructor(
        private appointmentRepository: IAppointmentRepository,
        private eventPublisher: IEventPublisher
    ) {}

    async execute(appointment: any) {
        const created = await this.appointmentRepository.create(appointment);
        await this.eventPublisher.publish({ type: 'AppointmentCreated', data: created });
        return created;
    }
}
