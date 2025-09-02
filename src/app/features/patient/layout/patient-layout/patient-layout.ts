import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSidenav, MatSidenavContainer, MatSidenavModule } from '@angular/material/sidenav';
import { map, Observable, shareReplay } from 'rxjs';
import { AdminRoutingModule } from "../../../admin/admin-routing-module";
import { PatientHeaderComponent } from "../patient-header-component/patient-header-component";
import { PatientSidebar } from "../patient-sidebar/patient-sidebar";
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-patient-layout',
  imports: [MatSidenavContainer, MatSidenavModule, MatSidenav, AdminRoutingModule, PatientHeaderComponent, PatientSidebar,AsyncPipe],
  templateUrl: './patient-layout.html',
  styleUrl: './patient-layout.css'
})
export class PatientLayout implements OnInit{

    @ViewChild('drawer') drawer!: MatSidenav;

  isHandset$!: Observable<boolean>;

  constructor(private breakpointObserver: BreakpointObserver) {
    // Assign here so breakpointObserver is initialized
    this.isHandset$ = this.breakpointObserver
      .observe(Breakpoints.Handset)
      .pipe(
        map(result => result.matches),
        shareReplay()
      );
  }

  ngOnInit(): void {}

  onMenuToggle(): void {
    this.drawer.toggle();
  }

  onSidenavClose(): void {
    this.drawer.close();
  }
}
