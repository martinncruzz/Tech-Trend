import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'admin-layout',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './admin-layout.component.html',
  styles: ``,
})
export class AdminLayoutComponent implements OnInit {
  private readonly router = inject(Router);
  public currentRoute = signal<string>('');

  ngOnInit(): void {
    this.router.events.subscribe(() => {
      this.currentRoute.set(this.router.url);
    });
  }
}
