import { Pipe, PipeTransform } from '@angular/core';
import { Category } from '../interfaces/categories';

@Pipe({
  name: 'categoryImage',
  standalone: true,
})
export class CategoryImagePipe implements PipeTransform {
  transform(category: Category): string {
    return `/icons/${category.name.toLowerCase()}.png`;
  }
}
