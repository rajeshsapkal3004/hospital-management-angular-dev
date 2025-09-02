export enum RoleName {
  PATIENT = 'PATIENT',
  DOCTOR = 'DOCTOR',
  NURSE = 'NURSE',
  RECEPTIONIST = 'RECEPTIONIST',
  PHARMACIST = 'PHARMACIST',
  LAB_TECHNICIAN = 'LAB_TECHNICIAN'
}

export enum Gender {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
  OTHER = 'OTHER'
}

export enum MaritalStatus {
  SINGLE = 'SINGLE',
  MARRIED = 'MARRIED',
  DIVORCED = 'DIVORCED',
  WIDOWED = 'WIDOWED'
}

export interface UserRegistrationDto {
  username: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone: string;
  role: RoleName;
  gender?: Gender;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  postalCode?: string;
}

export interface PatientRegistrationDto extends UserRegistrationDto {
  dateOfBirth: string;
  bloodType?: string;
  insuranceProvider?: string;
  insuranceNumber?: string;
  emergencyContactName: string;
  emergencyContactPhone: string;
  emergencyContactRelationship?: string;
  occupation?: string;
  maritalStatus?: MaritalStatus;
  heightCm?: number;
  weightKg?: number;
  medicalNotes?: string;
  allergies?: string[];
  medicalConditions?: string[];
  currentMedications?: string[];
}

export interface DoctorRegistrationDto extends UserRegistrationDto {
  licenseNumber: string;
  specialization: string;
  experience?: number;
  qualification: string;
  consultationFee?: number;
  availableHours?: string;
  departmentId?: number;
}

export interface ReceptionistRegistrationDto extends UserRegistrationDto {
  shift?: 'MORNING' | 'EVENING' | 'NIGHT';
  languagesSpoken?: string[];
  departmentId?: number;
}

export interface PharmacistRegistrationDto extends UserRegistrationDto {
  licenseNumber: string;
  specialization?: string;
  experience?: number;
  pharmacyLicenseNumber?: string;
}

export interface LabTechnicianRegistrationDto extends UserRegistrationDto {
  certification: string;
  specialization?: string;
  experience?: number;
  labType?: string;
}
