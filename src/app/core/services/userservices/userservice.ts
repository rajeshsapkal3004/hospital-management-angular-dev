import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { BehaviorSubject, Observable } from 'rxjs';
import { Appointment, AppointmentBooking, Doctor, MedicalRecord, Patient, PatientDashboardStats, TimeSlot } from '../../models/patient.model';
import { HttpClient, HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class Userservice {

  private readonly apiUrl = `${environment.apiUrl}/patients`;
  private currentPatientSubject = new BehaviorSubject<Patient | null>(null);
  
  public currentPatient$ = this.currentPatientSubject.asObservable();

  constructor(private http: HttpClient) {}

  // Dashboard
  getDashboardStats(): Observable<PatientDashboardStats> {
    return this.http.get<PatientDashboardStats>(`${this.apiUrl}/dashboard/stats`);
  }

  // Profile
  getProfile(): Observable<Patient> {
    return this.http.get<Patient>(`${this.apiUrl}/profile`);
  }

  updateProfile(patient: Partial<Patient>): Observable<Patient> {
    return this.http.put<Patient>(`${this.apiUrl}/profile`, patient);
  }

  // Medical Records
  getMedicalRecords(page: number = 0, size: number = 10): Observable<{ content: MedicalRecord[], totalElements: number }> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());
    return this.http.get<{ content: MedicalRecord[], totalElements: number }>(`${this.apiUrl}/medical-records`, { params });
  }

  getMedicalRecordById(id: number): Observable<MedicalRecord> {
    return this.http.get<MedicalRecord>(`${this.apiUrl}/medical-records/${id}`);
  }

  downloadMedicalAttachment(attachmentId: number): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/medical-records/attachments/${attachmentId}/download`, { responseType: 'blob' });
  }

  // Appointments
  getAppointments(status?: string, page: number = 0, size: number = 10): Observable<{ content: Appointment[], totalElements: number }> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());
    
    if (status) {
      params = params.set('status', status);
    }
    
    return this.http.get<{ content: Appointment[], totalElements: number }>(`${this.apiUrl}/appointments`, { params });
  }

  getUpcomingAppointments(): Observable<Appointment[]> {
    return this.http.get<Appointment[]>(`${this.apiUrl}/appointments/upcoming`);
  }

  bookAppointment(booking: AppointmentBooking): Observable<Appointment> {
    return this.http.post<Appointment>(`${this.apiUrl}/appointments`, booking);
  }

  cancelAppointment(appointmentId: number, reason: string): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/appointments/${appointmentId}/cancel`, { reason });
  }

  rescheduleAppointment(appointmentId: number, newDate: string, newTime: string): Observable<Appointment> {
    return this.http.put<Appointment>(`${this.apiUrl}/appointments/${appointmentId}/reschedule`, {
      appointmentDate: newDate,
      appointmentTime: newTime
    });
  }

  // Doctors
  getDoctors(specialization?: string): Observable<Doctor[]> {
    let params = new HttpParams();
    if (specialization) {
      params = params.set('specialization', specialization);
    }
    return this.http.get<Doctor[]>(`${this.apiUrl}/doctors`, { params });
  }

  getDoctorAvailableSlots(doctorId: number, date: string): Observable<TimeSlot[]> {
    const params = new HttpParams().set('date', date);
    return this.http.get<TimeSlot[]>(`${this.apiUrl}/doctors/${doctorId}/available-slots`, { params });
  }

  // Utility methods
  setCurrentPatient(patient: Patient): void {
    this.currentPatientSubject.next(patient);
  }

  getCurrentPatient(): Patient | null {
    return this.currentPatientSubject.value;
  }
  
}
