import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDividerModule } from '@angular/material/divider';
import { MatTableModule } from '@angular/material/table';

import { Userservice } from '../../../../core/services/userservices/userservice'; 
import { MedicalRecord } from '../../../../core/models/patient.model';

@Component({
  selector: 'app-medical-record-detail-component',
  imports: [ CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatProgressSpinnerModule,
    MatDividerModule,
    MatTableModule,
  CommonModule],
  templateUrl: './medical-record-detail-component.html',
  styleUrl: './medical-record-detail-component.css'
})
export class MedicalRecordDetailComponent implements OnInit {
  medicalRecord: MedicalRecord | null = null;
  isLoading = false;
  recordId: number = 0;

  prescriptionColumns = ['medication', 'dosage', 'frequency', 'duration', 'instructions'];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private patientService: Userservice
  ) {}

  ngOnInit(): void {
    this.recordId = Number(this.route.snapshot.paramMap.get('id'));
    this.loadMedicalRecord();
  }

  loadMedicalRecord(): void {
    this.isLoading = true;
    this.patientService.getMedicalRecordById(this.recordId).subscribe({
      next: (record) => {
        this.medicalRecord = record;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading medical record:', error);
        this.isLoading = false;
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/patient/medical-records']);
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  getVisitTypeClass(type: string): string {
    switch (type) {
      case 'CONSULTATION':
        return 'visit-consultation';
      case 'FOLLOW_UP':
        return 'visit-followup';
      case 'EMERGENCY':
        return 'visit-emergency';
      case 'CHECKUP':
        return 'visit-checkup';
      default:
        return '';
    }
  }

  downloadAttachment(attachmentId: number, fileName: string): void {
    this.patientService.downloadMedicalAttachment(attachmentId).subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = fileName;
        link.click();
        window.URL.revokeObjectURL(url);
      },
      error: (error) => {
        console.error('Error downloading attachment:', error);
      }
    });
  }
}