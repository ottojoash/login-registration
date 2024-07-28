import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { trigger, state, style, transition, animate } from '@angular/animations';

@Component({
  selector: 'app-category-selection',
  templateUrl: './category-selection.component.html',
  styleUrls: ['./category-selection.component.scss'],
  animations: [
    trigger('toggleCategories', [
      state('show', style({
        opacity: 1,
        transform: 'translateY(0)'
      })),
      state('hide', style({
        opacity: 0,
        transform: 'translateY(-20px)'
      })),
      transition('show <=> hide', [
        animate('0.3s ease-in-out')
      ])
    ])
  ]
})
export class CategorySelectionComponent {
  showCategories: boolean = false;

  constructor(private router: Router) {}

  toggleCategories(event: MouseEvent): void {
    event.stopPropagation();  // Stop the click event from propagating
    event.preventDefault();   // Prevent the default behavior
    this.showCategories = !this.showCategories;
  }

  selectCategory(category: string): void {
    this.router.navigate(['/signup']);
    this.resetToDefault();
  }

  resetToDefault(): void {
    this.showCategories = false;
  }
}
