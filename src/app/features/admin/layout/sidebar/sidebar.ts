import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { Auth } from '../../../../core/services/auth';
import { MatIconModule } from "@angular/material/icon";
import { MatNavList, MatListModule } from "@angular/material/list";
import { CommonModule } from '@angular/common';

interface MenuItem {
  title: string;
  icon: string;
  route: string;
  badge?: number;
  children?: MenuItem[];
}


@Component({
  selector: 'app-sidebar',
  imports: [MatIconModule, MatNavList, MatListModule,CommonModule],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css'
})
export class Sidebar implements OnInit {

   @Output() menuItemClicked = new EventEmitter<void>();

  currentRoute = '';
  
  menuItems: MenuItem[] = [
    {
      title: 'Dashboard',
      icon: 'dashboard',
      route: '/admin/dashboard'
    },
    {
      title: 'User Management',
      icon: 'people',
      route: '/admin/users'
    },
    {
      title: 'Doctors',
      icon: 'local_hospital',
      route: '/admin/doctors'
    },
    {
      title: 'Patients',
      icon: 'person',
      route: '/admin/patients'
    },
    {
      title: 'Appointments',
      icon: 'event',
      route: '/admin/appointments',
      badge: 5
    },
    {
      title: 'Medical Records',
      icon: 'description',
      route: '/admin/medical-records'
    },
    {
      title: 'Departments',
      icon: 'business',
      route: '/admin/departments'
    },
    {
      title: 'Reports',
      icon: 'assessment',
      route: '/admin/reports'
    },
    {
      title: 'Settings',
      icon: 'settings',
      route: '/admin/settings'
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
