import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, NavigationEnd } from '@angular/router';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatBadgeModule } from '@angular/material/badge';
import { filter } from 'rxjs/operators';

import { Auth } from '../../../../core/services/auth'; 

interface MenuItem {
  title: string;
  icon: string;
  route: string;
  badge?: number;
  description?: string;
}

@Component({
  selector: 'app-patient-sidebar',
  imports: [CommonModule,MatBadgeModule,MatListModule,MatIconModule,MatDividerModule ],
  templateUrl: './patient-sidebar.html',
  styleUrl: './patient-sidebar.css'
})
export class PatientSidebar {

   @Output() menuItemClicked = new EventEmitter<void>();

  currentRoute = '';
  
  mainMenuItems: MenuItem[] = [
    {
      title: 'Dashboard',
      icon: 'dashboard',
      route: '/patient/dashboard',
      description: 'Overview and quick actions'
    },
    {
      title: 'Appointments',
      icon: 'event',
      route: '/patient/appointments',
      badge: 2,
      description: 'Manage your appointments'
    },
    {
      title: 'Medical Records',
      icon: 'description',
      route: '/patient/medical-records',
      description: 'View your medical history'
    },
    {
      title: 'Prescriptions',
      icon: 'medication',
      route: '/patient/prescriptions',
      badge: 1,
      description: 'Current and past prescriptions'
    },
    {
      title: 'Lab Results',
      icon: 'biotech',
      route: '/patient/lab-results',
      description: 'Test results and reports'
    },
    {
      title: 'Health Tracking',
      icon: 'favorite',
      route: '/patient/health-tracking',
      description: 'Track your vital signs'
    }
  ];

  accountMenuItems: MenuItem[] = [
    {
      title: 'My Profile',
      icon: 'person',
      route: '/patient/profile',
      description: 'Update personal information'
    },
    {
      title: 'Insurance',
      icon: 'security',
      route: '/patient/insurance',
      description: 'Insurance information'
    },
    {
      title: 'Billing',
      icon: 'receipt',
      route: '/patient/billing',
      description: 'Bills and payments'
    },
    {
      title: 'Settings',
      icon: 'settings',
      route: '/patient/settings',
      description: 'Account preferences'
    }
  ];

  constructor(
    private router: Router,
    private authService: Auth
  ) {}

  ngOnInit(): void {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        this.currentRoute = event.urlAfterRedirects;
      });
    
    this.currentRoute = this.router.url;
  }

  navigateTo(route: string): void {
    this.router.navigate([route]);
    this.menuItemClicked.emit();
  }

  isActive(route: string): boolean {
    return this.currentRoute === route || this.currentRoute.startsWith(route + '/');
  }

  logout(): void {
    this.authService.logout();
  }

}
