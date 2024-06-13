import { Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { AuthService } from '../../core/services';

@Component({
  selector: 'layouts-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './header.component.html',
  styles: ``,
})
export class HeaderComponent {
  private readonly authService = inject(AuthService);

  public isLoggedIn = computed(() => this.authService.isLoggedIn());

  constructor() {}

  public logout(): void {
    this.authService.logout();
  }
}
