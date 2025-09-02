import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Auth } from '../../../../core/services/auth';
import { Loading } from '../../../../core/services/loading';
import { AdminUser, DashboardStats } from '../../../../core/models/auth.model';
import { MatIconModule } from "@angular/material/icon";
import { MatCard, MatCardModule } from "@angular/material/card";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

interface QuickAction {
  title: string;
  description: string;
  icon: string;
  route: string;
  color: string;
}

interface RecentActivity {
  id: number;
  type: 'appointment' | 'user' | 'system';
  title: string;
  description: string;
  timestamp: Date;
  icon: string;
}

@Component({
  selector: 'app-dashboard',
  imports: [MatIconModule, MatCard, MatCardModule, MatProgressSpinnerModule,RouterModule, CommonModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class Dashboard  implements OnInit  {

    currentUser: AdminUser | null = null;
  isLoading = false;
  
  // Mock data - replace with actual API calls
  dashboardStats: DashboardStats = {
    totalPatients: 1248,
    totalDoctors: 45,
    todayAppointments: 23,
    monthlyRevenue: 125000,
    emergencyCases: 3,
    availableBeds: 15
  };

  quickActions: QuickAction[] = [
    {
      title: 'Manage Users',
      description: 'Add, edit, and manage system users',
      icon: 'people',
      route: '/admin/users',
      color: '#1976d2'
    },
    {
      title: 'View Reports',
      description: 'Access analytics and reports',
      icon: 'assessment',
      route: '/admin/reports',
      color: '#388e3c'
    },
    {
      title: 'System Settings',
      description: 'Configure system preferences',
      icon: 'settings',
      route: '/admin/settings',
      color: '#f57c00'
    },
    {
      title: 'Appointments',
      description: 'Manage hospital appointments',
      icon: 'event',
      route: '/admin/appointments',
      color: '#7b1fa2'
    }
  ];

  recentActivities: RecentActivity[] = [
    {
      id: 1,
      type: 'user',
      title: 'New Doctor Added',
      description: 'Dr. Sarah Johnson joined Cardiology department',
      timestamp: new Date(Date.now() - 1000 * 60 * 15), // 15 minutes ago
      icon: 'person_add'
    },
    {
      id: 2,
      type: 'appointment',
      title: 'Emergency Appointment',
      description: 'Patient John Doe scheduled for immediate consultation',
      timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
      icon: 'emergency'
    },
    {
      id: 3,
      type: 'system',
      title: 'System Backup Complete',
      description: 'Daily backup completed successfully',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
      icon: 'backup'
    }
  ];

  constructor(
    private authService: Auth,
    private loadingService: Loading,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    this.loadDashboardData();
  }

  private loadDashboardData(): void {
    this.isLoading = true;
    this.loadingService.showLoading();

    // Simulate API call - replace with actual service
    setTimeout(() => {
      this.isLoading = false;
      this.loadingService.hideLoading();
    }, 1000);
  }

  getUserWelcomeMessage(): string {
    const hour = new Date().getHours();
    let greeting = 'Good morning';
    
    if (hour >= 12 && hour < 18) {
      greeting = 'Good afternoon';
    } else if (hour >= 18) {
      greeting = 'Good evening';
    }

    return `${greeting}, ${this.currentUser?.firstName || 'Admin'}!`;
  }

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  }

  getActivityIcon(activity: RecentActivity): string {
    return activity.icon;
  }

  getActivityTime(timestamp: Date): string {
    const now = new Date();
    const diffMs = now.getTime() - timestamp.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
  }

  refreshDashboard(): void {
    this.loadDashboardData();
  }

}
