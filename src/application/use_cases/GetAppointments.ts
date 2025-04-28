import { IAppointmentRepository } from '../../domain/ports/repositories/IAppointmentRepository';

export class GetAppointments {
    constructor(private appointmentRepository: IAppointmentRepository) {}

    async execute() {
        return this.appointmentRepository.getAll();
    }
}
