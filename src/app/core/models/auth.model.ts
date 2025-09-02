export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  token: string;
  refreshToken?: string;
  user: AdminUser;
  expiresIn: number;
}

export interface AdminUser {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  permissions: string[];
}
export enum UserRole {
  SUPER_ADMIN = 'ROLE_SUPER_ADMIN',
  ADMIN = 'ROLE_ADMIN',
  STAFF = 'ROLE_STAFF',
  DOCTOR = 'ROLE_DOCTOR',
  NURSE = 'ROLE_NURSE',
  PATIENT = 'ROLE_PATIENT',
  RECEPTIONIST = 'ROLE_RECEPTIONIST',
  LAB_TECHNICIAN = 'ROLE_LAB_TECHNICIAN',
  PHARMACIST = 'ROLE_PHARMACIST'
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message: string;
  errors?: string[];
}

export interface DashboardStats {
  totalPatients: number;
  totalDoctors: number;
  todayAppointments: number;
  monthlyRevenue: number;
  emergencyCases: number;
  availableBeds: number;
}
