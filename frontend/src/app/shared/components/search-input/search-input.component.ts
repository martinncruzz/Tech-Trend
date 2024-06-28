import { Component, input, output } from '@angular/core';

@Component({
  selector: 'shared-search-input',
  standalone: true,
  imports: [],
  templateUrl: './search-input.component.html',
  styles: ``,
})
export class SearchInputComponent {
  public styles = input.required<string>();
  public label = input.required<string>();
  public disabled = input<boolean>();

  public onSearch = output<string>();

  public searchQuery(searchTerm: string): void {
    this.onSearch.emit(searchTerm);
  }
}
