import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTabsModule } from '@angular/material/tabs';
import { MatDividerModule } from '@angular/material/divider';

import { Userservice } from '../../../../core/services/userservices/userservice'; 
import { Auth } from '../../../../core/services/auth'; 
import { Notification } from '../../../../core/services/notification'; 
import { Patient } from '../../../../core/models/patient.model';
import { AdminUser } from '../../../../core/models/auth.model';

@Component({
  selector: 'app-profile',
  imports: [
     CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatChipsModule,
    MatProgressSpinnerModule,
    MatTabsModule,
    MatDividerModule
  ],
  templateUrl: './profile.html',
  styleUrl: './profile.css'
})
export class Profile implements OnInit{

  profileForm!: FormGroup;
  emergencyContactForm!: FormGroup;
  medicalInfoForm!: FormGroup;
  
  currentUser: AdminUser | null = null;
  currentPatient: Patient | null = null;
  isLoading = false;
  isEditing = false;
  isSaving = false;

  bloodTypes = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
  genders = ['MALE', 'FEMALE', 'OTHER'];
  maritalStatuses = ['SINGLE', 'MARRIED', 'DIVORCED', 'WIDOWED'];

  constructor(
    private formBuilder: FormBuilder,
    private patientService: Userservice,
    private authService: Auth,
    private notificationService: Notification
  ) {}

  ngOnInit(): void {
    this.initializeForms();
    this.loadCurrentUser();
    this.loadPatientProfile();
  }

  private initializeForms(): void {
    this.profileForm = this.formBuilder.group({
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.pattern(/^[+]?[0-9]{10,15}$/)]],
      dateOfBirth: ['', Validators.required],
      gender: [''],
      bloodType: [''],
      height: ['', [Validators.min(0), Validators.max(300)]],
      weight: ['', [Validators.min(0), Validators.max(1000)]],
      address: [''],
      city: [''],
      state: [''],
      country: [''],
      postalCode: [''],
      occupation: [''],
      maritalStatus: [''],
      insuranceProvider: [''],
      insuranceNumber: ['']
    });

    this.emergencyContactForm = this.formBuilder.group({
      emergencyContactName: ['', [Validators.required, Validators.minLength(2)]],
      emergencyContactPhone: ['', [Validators.required, Validators.pattern(/^[+]?[0-9]{10,15}$/)]],
      emergencyContactRelationship: ['']
    });

    this.medicalInfoForm = this.formBuilder.group({
      allergies: this.formBuilder.array([]),
      medicalConditions: this.formBuilder.array([]),
      currentMedications: this.formBuilder.array([])
    });
  }

  private loadCurrentUser(): void {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
    });
  }

  private loadPatientProfile(): void {
    this.isLoading = true;
    this.patientService.getProfile().subscribe({
      next: (patient) => {
        console.log(patient);
        this.currentPatient = patient;
        this.patientService.setCurrentPatient(patient);
        this.populateForms(patient);
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading patient profile:', error);
        this.notificationService.showError('Failed to load profile');
        this.isLoading = false;
      }
    });
  }

  private populateForms(patient: Patient): void {
    // Populate basic profile form
    this.profileForm.patchValue({
      firstName: this.currentUser?.firstName || '',
      lastName: this.currentUser?.lastName || '',
      email: this.currentUser?.email || '',
      phone: patient.userId ? '' : '', // This should come from user table
      dateOfBirth: patient.dateOfBirth,
      bloodType: patient.bloodType,
      height: patient.height,
      weight: patient.weight,
      // Add other fields as needed
    });

    // Populate emergency contact form
    this.emergencyContactForm.patchValue({
      emergencyContactName: patient.emergencyContactName,
      emergencyContactPhone: patient.emergencyContactPhone,
      emergencyContactRelationship: patient.emergencyContactRelationship
    });

    // Populate medical info arrays
    this.setFormArray('allergies', patient.allergies || []);
    this.setFormArray('medicalConditions', patient.medicalConditions || []);
    this.setFormArray('currentMedications', patient.currentMedications || []);
  }

  private setFormArray(arrayName: string, values: string[]): void {
    const formArray = this.medicalInfoForm.get(arrayName) as FormArray;
    formArray.clear();
    values.forEach(value => {
      formArray.push(this.formBuilder.control(value, Validators.required));
    });
  }

  // Form Array getters
  get allergies(): FormArray {
    return this.medicalInfoForm.get('allergies') as FormArray;
  }

  get medicalConditions(): FormArray {
    return this.medicalInfoForm.get('medicalConditions') as FormArray;
  }

  get currentMedications(): FormArray {
    return this.medicalInfoForm.get('currentMedications') as FormArray;
  }

  addItem(arrayName: string): void {
    const array = this.medicalInfoForm.get(arrayName) as FormArray;
    array.push(this.formBuilder.control('', Validators.required));
  }

  removeItem(arrayName: string, index: number): void {
    const array = this.medicalInfoForm.get(arrayName) as FormArray;
    array.removeAt(index);
  }

  toggleEdit(): void {
    this.isEditing = !this.isEditing;
    if (!this.isEditing) {
      // If canceling edit, reload the original data
      if (this.currentPatient) {
        this.populateForms(this.currentPatient);
      }
    }
  }

  saveProfile(): void {
    if (this.profileForm.valid && this.emergencyContactForm.valid && this.medicalInfoForm.valid) {
      this.isSaving = true;
      
      const updateData = {
        ...this.profileForm.value,
        ...this.emergencyContactForm.value,
        allergies: this.allergies.value.filter((item: string) => item.trim()),
        medicalConditions: this.medicalConditions.value.filter((item: string) => item.trim()),
        currentMedications: this.currentMedications.value.filter((item: string) => item.trim())
      };

      this.patientService.updateProfile(updateData).subscribe({
        next: (updatedPatient) => {
          this.currentPatient = updatedPatient;
          this.patientService.setCurrentPatient(updatedPatient);
          this.isEditing = false;
          this.isSaving = false;
          this.notificationService.showSuccess('Profile updated successfully');
        },
        error: (error) => {
          console.error('Error updating profile:', error);
          this.notificationService.showError('Failed to update profile');
          this.isSaving = false;
        }
      });
    } else {
      this.markAllFormsAsTouched();
      this.notificationService.showError('Please fill in all required fields');
    }
  }

  private markAllFormsAsTouched(): void {
    this.profileForm.markAllAsTouched();
    this.emergencyContactForm.markAllAsTouched();
    this.medicalInfoForm.markAllAsTouched();
  }

  getErrorMessage(form: FormGroup, fieldName: string): string {
    const control = form.get(fieldName);
    
    if (control?.hasError('required')) {
      return `${this.getFieldDisplayName(fieldName)} is required`;
    }
    if (control?.hasError('email')) {
      return 'Please enter a valid email address';
    }
    if (control?.hasError('minlength')) {
      const requiredLength = control.errors?.['minlength']?.requiredLength;
      return `Must be at least ${requiredLength} characters`;
    }
    if (control?.hasError('pattern')) {
      return 'Please enter a valid phone number';
    }
    if (control?.hasError('min')) {
      const min = control.errors?.['min']?.min;
      return `Must be at least ${min}`;
    }
    if (control?.hasError('max')) {
      const max = control.errors?.['max']?.max;
      return `Cannot exceed ${max}`;
    }
    
    return '';
  }

  private getFieldDisplayName(fieldName: string): string {
    const displayNames: { [key: string]: string } = {
      firstName: 'First Name',
      lastName: 'Last Name',
      email: 'Email',
      phone: 'Phone',
      dateOfBirth: 'Date of Birth',
      emergencyContactName: 'Emergency Contact Name',
      emergencyContactPhone: 'Emergency Contact Phone',
      height: 'Height',
      weight: 'Weight'
    };
    return displayNames[fieldName] || fieldName;
  }

  calculateAge(): number | null {
    if (!this.currentPatient?.dateOfBirth) return null;
    
    const birthDate = new Date(this.currentPatient.dateOfBirth);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age;
  }

  calculateBMI(): number | null {
    if (!this.currentPatient?.height || !this.currentPatient?.weight) return null;
    
    const heightInMeters = this.currentPatient.height / 100;
    const bmi = this.currentPatient.weight / (heightInMeters * heightInMeters);
    return Math.round(bmi * 10) / 10;
  }

  getBMICategory(): string {
    const bmi = this.calculateBMI();
    if (!bmi) return 'N/A';
    
    if (bmi < 18.5) return 'Underweight';
    if (bmi < 25) return 'Normal';
    if (bmi < 30) return 'Overweight';
    return 'Obese';
  }

  formatDate(dateString: string): string {
    if (!dateString) return 'Not specified';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }


}
