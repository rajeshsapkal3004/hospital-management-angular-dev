export interface Patient {
  id: number;
  userId: number;
  patientId: string;
  dateOfBirth: string;
  bloodType: string;
  height: number;
  weight: number;
  emergencyContactName: string;
  emergencyContactPhone: string;
  emergencyContactRelationship: string;
  insuranceProvider?: string;
  insuranceNumber?: string;
  allergies: string[];
  medicalConditions: string[];
  currentMedications: string[];
  createdAt: string;
  updatedAt: string;
  postalCode:number;
  city:String;
  patientNumber:String
}

export interface MedicalRecord {
  id: number;
  patientId: number;
  doctorId: number;
  doctorName: string;
  visitDate: string;
  visitType: 'CONSULTATION' | 'FOLLOW_UP' | 'EMERGENCY' | 'CHECKUP';
  diagnosis: string;
  symptoms: string[];
  treatment: string;
  prescriptions: Prescription[];
  notes: string;
  attachments: MedicalAttachment[];
  vitalSigns: VitalSigns;
  createdAt: string;
  

}

export interface Prescription {
  id: number;
  medicationName: string;
  dosage: string;
  frequency: string;
  duration: string;
  instructions: string;
  isActive: boolean;
}

export interface VitalSigns {
  bloodPressure: string;
  heartRate: number;
  temperature: number;
  weight: number;
  height: number;
  respiratoryRate: number;
  oxygenSaturation: number;
}

export interface MedicalAttachment {
  id: number;
  fileName: string;
  fileType: string;
  fileSize: number;
  uploadDate: string;
  url: string;
}

export interface Appointment {
  id: number;
  patientId: number;
  doctorId: number;
  doctorName: string;
  doctorSpecialization: string;
  appointmentDate: string;
  appointmentTime: string;
  status: 'SCHEDULED' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED' | 'NO_SHOW';
  type: 'CONSULTATION' | 'FOLLOW_UP' | 'CHECKUP' | 'EMERGENCY';
  reason: string;
  notes?: string;
  department: string;
  createdAt: string;
}

export interface PatientDashboardStats {
  totalAppointments: number;
  upcomingAppointments: number;
  completedAppointments: number;
  totalMedicalRecords: number;
  activePrescriptions: number;
  lastVisitDate?: string;
  nextAppointmentDate?: string;
  
}

export interface Doctor {
  id: number;
  firstName: string;
  lastName: string;
  specialization: string;
  department: string;
  experience: number;
  qualification: string;
  consultationFee: number;
  rating: number;
  availableSlots: TimeSlot[];
}

export interface TimeSlot {
  id: number;
  date: string;
  time: string;
  isAvailable: boolean;
}

export interface AppointmentBooking {
  doctorId: number;
  appointmentDate: string;
  appointmentTime: string;
  reason: string;
  type: 'CONSULTATION' | 'FOLLOW_UP' | 'CHECKUP';
}
