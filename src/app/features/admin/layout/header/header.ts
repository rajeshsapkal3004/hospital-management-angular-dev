import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { Auth } from '../../../../core/services/auth';
import { AdminUser } from '../../../../core/models/auth.model';
import { MatToolbar } from "@angular/material/toolbar";
import { MatIcon, MatIconModule, MatIconRegistry } from "@angular/material/icon";
import { MatMenu, MatMenuModule } from "@angular/material/menu";
import { MatChip } from "@angular/material/chips";
import { MatDivider } from "@angular/material/divider";
@Component({
  selector: 'app-header',
  imports: [MatIcon,MatToolbar, MatIconModule, MatMenu, MatChip, MatDivider,MatMenuModule],
  templateUrl: './header.html',
  styleUrl: './header.css'
})
export class Header implements OnInit  {

   @Output() menuToggle = new EventEmitter<void>();
  
  currentUser: AdminUser | null = null;

  constructor(
    private authService: Auth,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
    });
  }

  toggleMenu(): void {
    this.menuToggle.emit();
  }

  logout(): void {
    this.authService.logout();
  }

  navigateToProfile(): void {
    this.router.navigate(['/admin/profile']);
  }

  getUserDisplayName(): string {
    if (this.currentUser) {
      return `${this.currentUser.firstName} ${this.currentUser.lastName}`;
    }
    return 'Admin';
  }

  getUserInitials(): string {
    if (this.currentUser) {
      return `${this.currentUser.firstName.charAt(0)}${this.currentUser.lastName.charAt(0)}`;
    }
    return 'A';
  }

}
