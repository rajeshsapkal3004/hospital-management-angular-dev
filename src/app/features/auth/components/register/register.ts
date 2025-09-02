import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Gender, MaritalStatus, RoleName } from '../../../../core/models/registration.model';
import { Auth } from '../../../../core/services/auth';
import { Router } from '@angular/router';
import { Notification } from '../../../../core/services/notification';
import { MatCard, MatCardModule } from "@angular/material/card";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { CommonModule } from '@angular/common';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-register',
  imports: [MatExpansionModule,ReactiveFormsModule, CommonModule, MatNativeDateModule, MatDatepickerModule, MatSelectModule, MatCardModule, MatIconModule, MatInputModule, MatProgressSpinnerModule, MatCheckboxModule],
  templateUrl: './register.html',
  styleUrl: './register.css'
})
export class Register implements OnInit {

  registrationForm!:FormGroup;
  isLoading=false;
  hidePassword=true;
  hideConfirmPassword=true;
  selectedRole:RoleName | null=null;
  currentStep = 1;
  maxSteps = 2;

  //Enums for template

  roles=Object.values(RoleName);
  genders=Object.values(Gender);
  maritalStatuses= Object.values(MaritalStatus);

  //Options for Dropdowns
  bloodTypes=['A+','A-','B+','B-','AB+','AB-','O+','O-'];
  shifts=['MORNING','EVENING','NIGHT'];
  specializations=['cardiology','Neurology','Pediatrics','Surgery','Internal Medicine','orthopedis','Dermatology','Psychiatry','Radiology','Anesthesiology'];

  constructor(
    private formBuilder:FormBuilder,
    private authService: Auth,
    private notificationService:Notification,
    private router:Router,
      private snackBar: MatSnackBar
  ){}

  ngOnInit(): void {
    this.initializeForm();
  }

 private initializeForm(): void {
    this.registrationForm = this.formBuilder.group({
      // Common fields
      username: ['', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(50),
        Validators.pattern(/^[a-zA-Z0-9._-]+$/)
      ]],
      email: ['', [Validators.required, Validators.email, Validators.maxLength(100)]],
      password: ['', [
        Validators.required,
        Validators.minLength(8),
        Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&].*$/)
      ]],
      confirmPassword: ['', Validators.required],
      firstName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      lastName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      phone: ['', [Validators.pattern(/^[+]?[0-9]{10,15}$/)]],
      role: ['', Validators.required],
      gender: [''],
      address: [''],
      city: [''],
      state: [''],
      country: [''],
      postalCode: [''],

      // Patient-specific fields
      dateOfBirth: [''],
      bloodType: [''],
      insuranceProvider: [''],
      insuranceNumber: [''],
      emergencyContactName: [''],
      emergencyContactPhone: [''],
      emergencyContactRelationship: [''],
      occupation: [''],
      maritalStatus: [''],
      heightCm: ['', [Validators.min(0), Validators.max(300)]],
      weightKg: ['', [Validators.min(0), Validators.max(1000)]],
      medicalNotes: ['', Validators.maxLength(1000)],
      allergies: this.formBuilder.array([]),
      medicalConditions: this.formBuilder.array([]),
      currentMedications: this.formBuilder.array([]),

      // Doctor-specific fields
      licenseNumber: [''],
      specialization: [''],
      experience: ['', Validators.min(0)],
      qualification: [''],
      consultationFee: ['', Validators.min(0)],
      availableHours: [''],
      departmentId: [''],

      // Receptionist-specific fields
      shift: [''],
      languagesSpoken: this.formBuilder.array([]),

      // Pharmacist-specific fields
      pharmacyLicenseNumber: [''],

      // Lab Technician-specific fields
      certification: [''],
      labType: ['']
    }, { validators: this.passwordMatchValidator });

    // Listen for role changes
    this.registrationForm.get('role')?.valueChanges.subscribe(role => {
      this.onRoleChange(role);
    });
  }

  passwordMatchValidator(group:FormGroup){
    const password=group.get('password')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;
    return password===confirmPassword?null:{
      passwordMisatch:true
    };
  }

  onRoleChange(role:RoleName):void{
    this.selectedRole=role;
    this.updateValidators();
  }

  private updateValidators():void{
    //reset all validators
    this.clearValidators();

    if(this.selectedRole===RoleName.PATIENT){
      this.setPatientValidators();
    }else if (this.selectedRole === RoleName.DOCTOR) {
      this.setDoctorValidators();
    } else if (this.selectedRole === RoleName.RECEPTIONIST) {
      this.setReceptionistValidators();
    } else if (this.selectedRole === RoleName.PHARMACIST) {
      this.setPharmacistValidators();
    } else if (this.selectedRole === RoleName.LAB_TECHNICIAN) {
      this.setLabTechnicianValidators();
    }
  }

  private clearValidators(): void {
    const roleSpecificFields = [
      'dateOfBirth', 'emergencyContactName', 'emergencyContactPhone',
      'licenseNumber', 'specialization', 'qualification', 'certification'
    ];

    roleSpecificFields.forEach(field => {
      const control = this.registrationForm.get(field);
      if (control) {
        control.clearValidators();
        control.updateValueAndValidity();
      }
    });
  }

  private setPatientValidators(): void {
    this.registrationForm.get('dateOfBirth')?.setValidators([Validators.required]);
    this.registrationForm.get('emergencyContactName')?.setValidators([
      Validators.required, Validators.minLength(2), Validators.maxLength(100)
    ]);
    this.registrationForm.get('emergencyContactPhone')?.setValidators([
      Validators.required, Validators.pattern(/^[+]?[0-9]{10,15}$/)
    ]);
    this.registrationForm.get('bloodType')?.setValidators([
      Validators.pattern(/^(A|B|AB|O)[+-]$/)
    ]);
  }

  private setDoctorValidators(): void {
    this.registrationForm.get('licenseNumber')?.setValidators([Validators.required]);
    this.registrationForm.get('specialization')?.setValidators([Validators.required]);
    this.registrationForm.get('qualification')?.setValidators([Validators.required]);
  }

   private setReceptionistValidators(): void {
    // Add receptionist-specific validators if needed
  }

  private setPharmacistValidators(): void {
    this.registrationForm.get('licenseNumber')?.setValidators([Validators.required]);
  }

  private setLabTechnicianValidators(): void {
    this.registrationForm.get('certification')?.setValidators([Validators.required]);
  }

  // Form Array helpers
  get allergies(): FormArray {
    return this.registrationForm.get('allergies') as FormArray;
  }

  get medicalConditions(): FormArray {
    return this.registrationForm.get('medicalConditions') as FormArray;
  }

  get currentMedications(): FormArray {
    return this.registrationForm.get('currentMedications') as FormArray;
  }

  get languagesSpoken(): FormArray {
    return this.registrationForm.get('languagesSpoken') as FormArray;
  }

  addItem(arrayName: string, value: string = ''): void {
    const array = this.registrationForm.get(arrayName) as FormArray;
    array.push(this.formBuilder.control(value, Validators.required));
  }

  removeItem(arrayName: string, index: number): void {
    const array = this.registrationForm.get(arrayName) as FormArray;
    array.removeAt(index);
  }

  togglePasswordVisibility(field: 'password' | 'confirmPassword'): void {
    if (field === 'password') {
      this.hidePassword = !this.hidePassword;
    } else {
      this.hideConfirmPassword = !this.hideConfirmPassword;
    }
  }

  onSubmit(): void {
    if (this.registrationForm.valid) {
      this.isLoading = true;
      const formValue = this.registrationForm.value;
      
      // Remove confirmPassword from submission
      delete formValue.confirmPassword;

      // Convert form arrays to string arrays
      if (formValue.allergies) {
        formValue.allergies = formValue.allergies.filter((item: string) => item.trim());
      }
      if (formValue.medicalConditions) {
        formValue.medicalConditions = formValue.medicalConditions.filter((item: string) => item.trim());
      }
      if (formValue.currentMedications) {
        formValue.currentMedications = formValue.currentMedications.filter((item: string) => item.trim());
      }
      if (formValue.languagesSpoken) {
        formValue.languagesSpoken = formValue.languagesSpoken.filter((item: string) => item.trim());
      }

      this.authService.register(formValue).subscribe({
        next: (response) => {
          this.notificationService.showSuccess('Registration successful! Please login.');
          this.router.navigate(['/auth/login']);
        },
        error: (error) => {
          const message = error?.error?.message || 'Registration failed. Please try again.';
          this.notificationService.showError(message);
        },
        complete: () => {
          this.isLoading = false;
        }
      });
    } else {
      this.markFormGroupTouched();
    }
  }

  private markFormGroupTouched(): void {
    Object.keys(this.registrationForm.controls).forEach(key => {
      const control = this.registrationForm.get(key);
      control?.markAsTouched();
    });
  }

  getErrorMessage(fieldName: string): string {
    const control = this.registrationForm.get(fieldName);
    
    if (control?.hasError('required')) {
      return `${this.getFieldDisplayName(fieldName)} is required`;
    }
    if (control?.hasError('email')) {
      return 'Please enter a valid email address';
    }
    if (control?.hasError('minlength')) {
      const requiredLength = control.errors?.['minlength']?.requiredLength;
      return `${this.getFieldDisplayName(fieldName)} must be at least ${requiredLength} characters`;
    }
    if (control?.hasError('maxlength')) {
      const maxLength = control.errors?.['maxlength']?.requiredLength;
      return `${this.getFieldDisplayName(fieldName)} cannot exceed ${maxLength} characters`;
    }
    if (control?.hasError('pattern')) {
      return this.getPatternErrorMessage(fieldName);
    }
    if (control?.hasError('min')) {
      const min = control.errors?.['min']?.min;
      return `${this.getFieldDisplayName(fieldName)} must be at least ${min}`;
    }
    if (control?.hasError('max')) {
      const max = control.errors?.['max']?.max;
      return `${this.getFieldDisplayName(fieldName)} cannot exceed ${max}`;
    }
    
    return '';
  }

  private getFieldDisplayName(fieldName: string): string {
    const displayNames: { [key: string]: string } = {
      username: 'Username',
      email: 'Email',
      password: 'Password',
      confirmPassword: 'Confirm Password',
      firstName: 'First Name',
      lastName: 'Last Name',
      phone: 'Phone',
      dateOfBirth: 'Date of Birth',
      emergencyContactName: 'Emergency Contact Name',
      emergencyContactPhone: 'Emergency Contact Phone',
      licenseNumber: 'License Number',
      specialization: 'Specialization',
      qualification: 'Qualification',
      certification: 'Certification'
    };
    return displayNames[fieldName] || fieldName;
  }

  private getPatternErrorMessage(fieldName: string): string {
    switch (fieldName) {
      case 'username':
        return 'Username can only contain letters, numbers, dots, underscores, and hyphens';
      case 'password':
        return 'Password must contain at least one uppercase letter, one lowercase letter, one digit, and one special character';
      case 'phone':
      case 'emergencyContactPhone':
        return 'Please provide a valid phone number';
      case 'bloodType':
        return 'Blood type must be valid (A+, A-, B+, B-, AB+, AB-, O+, O-)';
      default:
        return 'Invalid format';
    }
  }

  hasPasswordMismatch(): boolean {
  const hasError = this.registrationForm.hasError('passwordMismatch');
  const isTouched = this.registrationForm.get('confirmPassword')?.touched;
  return !!(hasError && isTouched); // Use !! to ensure boolean return
}

  goToLogin(): void {
    this.router.navigate(['/auth/login']);
  }

   // Get role icon
  getRoleIcon(role: string): string {
    const icons: { [key: string]: string } = {
      'PATIENT': 'person',
      'DOCTOR': 'local_hospital',
      'RECEPTIONIST': 'desk',
      'PHARMACIST': 'local_pharmacy',
      'LAB_TECHNICIAN': 'science'
    };
    return icons[role] || 'person';
  }

  countries = [
  { code: 'US', name: 'United States' },
  { code: 'CA', name: 'Canada' },
  { code: 'UK', name: 'United Kingdom' },
  { code: 'IN', name: 'India' },
  // Add more countries as needed
];



   // Step navigation methods
  nextStep() {
    if (this.canProceed()) {
      this.currentStep++;
    }
  }

  previousStep() {
    if (this.currentStep > 1) {
      this.currentStep--;
    }
  }

  
  canProceed(): boolean {
    if (this.currentStep === 1) {
      // Check if basic fields are valid
      const basicFields = ['role', 'firstName', 'lastName', 'username', 'email', 'password', 'confirmPassword', 'phone'];
      return basicFields.every(field => {
        const control = this.registrationForm.get(field);
        return control?.valid || false;
      }) && !this.hasPasswordMismatch();
    }
    return true;
  }

   // Getter to compute the length of medicalNotes for the hint
  get medicalNotesLength(): number {
    const notes = this.registrationForm.get('medicalNotes')?.value;
    return notes ? notes.length : 0;
  }

}
