import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { FormsModule } from '@angular/forms';

import { Userservice } from '../../../../core/services/userservices/userservice';
import { MedicalRecord } from '../../../../core/models/patient.model';

@Component({
  selector: 'app-medical-records',
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    CommonModule
  ],
  templateUrl: './medical-records.html',
  styleUrl: './medical-records.css'
})
export class MedicalRecords implements OnInit {

  medicalRecords: MedicalRecord[] = [];
  filteredRecords: MedicalRecord[] = [];
  isLoading = false;
  totalElements = 0;
  pageSize = 10;
  currentPage = 0;

  // Filters
  searchTerm = '';
  selectedVisitType = '';
  selectedDateRange: { start: Date | null; end: Date | null } = { start: null, end: null };

  visitTypes = [
    { value: '', label: 'All Types' },
    { value: 'CONSULTATION', label: 'Consultation' },
    { value: 'FOLLOW_UP', label: 'Follow Up' },
    { value: 'EMERGENCY', label: 'Emergency' },
    { value: 'CHECKUP', label: 'Check-up' }
  ];

  constructor(private patientService: Userservice) { }

  ngOnInit(): void {
    this.loadMedicalRecords();
  }

  loadMedicalRecords(): void {
    this.isLoading = true;
    this.patientService.getMedicalRecords(this.currentPage, this.pageSize).subscribe({
      next: (response) => {
        this.medicalRecords = response.content;
        this.totalElements = response.totalElements;
        this.applyFilters();
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading medical records:', error);
        this.isLoading = false;
      }
    });
  }

  onPageChange(event: PageEvent): void {
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadMedicalRecords();
  }

  applyFilters(): void {
    let filtered = [...this.medicalRecords];

    // Search filter
    if (this.searchTerm) {
      const term = this.searchTerm.toLowerCase();
      filtered = filtered.filter(record =>
        record.diagnosis.toLowerCase().includes(term) ||
        record.doctorName.toLowerCase().includes(term) ||
        record.symptoms.some(symptom => symptom.toLowerCase().includes(term))
      );
    }

    // Visit type filter
    if (this.selectedVisitType) {
      filtered = filtered.filter(record => record.visitType === this.selectedVisitType);
    }

    // Date range filter
    if (this.selectedDateRange.start && this.selectedDateRange.end) {
      filtered = filtered.filter(record => {
        const recordDate = new Date(record.visitDate);
        return recordDate >= this.selectedDateRange.start! &&
          recordDate <= this.selectedDateRange.end!;
      });
    }

    this.filteredRecords = filtered;
  }

  clearFilters(): void {
    this.searchTerm = '';
    this.selectedVisitType = '';
    this.selectedDateRange = { start: null, end: null };
    this.applyFilters();
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
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

  downloadAttachment(attachmentId: number): void {
    this.patientService.downloadMedicalAttachment(attachmentId).subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `medical-attachment-${attachmentId}`;
        link.click();
        window.URL.revokeObjectURL(url);
      },
      error: (error) => {
        console.error('Error downloading attachment:', error);
      }
    });
  }

}
