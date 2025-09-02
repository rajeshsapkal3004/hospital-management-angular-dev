import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatMenuModule } from '@angular/material/menu';
import { MatBadgeModule } from '@angular/material/badge';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';



import { AdminRoutingModule } from './admin-routing-module';
import { AdminLayout } from './layout/admin-layout/admin-layout';
import { Dashboard } from './components/dashboard/dashboard';


@NgModule({
  declarations: [
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatToolbarModule,
    MatSidenavModule,
    MatListModule,
    MatGridListModule,
    MatMenuModule,
    MatBadgeModule,
    MatChipsModule,
    MatProgressSpinnerModule
  ]
})
export class AdminModule { }
