export interface IAppointmentRepository {
    create(appointment: any): Promise<any>;
    getAll(): Promise<any[]>;
    updateStatus(id: string, status: string): Promise<any>;
}
