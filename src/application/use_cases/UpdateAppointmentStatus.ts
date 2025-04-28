import { IAppointmentRepository } from '../../domain/ports/repositories/IAppointmentRepository';

export class UpdateAppointmentStatus {
    constructor(private appointmentRepository: IAppointmentRepository) {}

    async execute(id: string, status: string) {
        return this.appointmentRepository.updateStatus(id, status);
    }
}
