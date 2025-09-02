import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSidenav, MatSidenavContainer, MatSidenavModule } from '@angular/material/sidenav';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { Header } from "../header/header";
import { Sidebar } from "../sidebar/sidebar";
import { RouterOutlet } from "@angular/router";
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-layout',
  imports: [MatSidenavContainer, MatSidenav, MatSidenavModule, Header, Sidebar, RouterOutlet, CommonModule],
  templateUrl: './admin-layout.html',
  styleUrls: ['./admin-layout.css']  // fix: styleUrls plural
})
export class AdminLayout implements OnInit {
  @ViewChild('drawer') drawer!: MatSidenav;

  isHandset$!: Observable<boolean>;  // Declare without initialization

  constructor(private breakpointObserver: BreakpointObserver) {}

  ngOnInit(): void {
    this.isHandset$ = this.breakpointObserver.observe(Breakpoints.Handset)
      .pipe(
        map(result => result.matches),
        shareReplay()
      );
  }

  closeSidenav(): void {
    if (this.drawer) {
      this.drawer.close();
    }
  }
}
