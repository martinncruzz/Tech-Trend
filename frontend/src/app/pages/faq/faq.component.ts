import { Component } from '@angular/core';

@Component({
  selector: 'faq',
  standalone: true,
  imports: [],
  templateUrl: './faq.component.html',
  styles: ``,
})
export class FaqComponent {
  public credentials: string = 'test@gmail.com:Abc123';
}
