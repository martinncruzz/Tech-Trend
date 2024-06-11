import { Component } from '@angular/core';

import { FeaturedProductsComponent } from '../products/components/featured-products/featured-products.component';
import { HeroSectionComponent } from './components/hero-section/hero-section.component';

@Component({
  selector: 'home',
  standalone: true,
  imports: [FeaturedProductsComponent, HeroSectionComponent],
  templateUrl: './home.component.html',
  styles: ``,
})
export class HomeComponent {}
