import {
  Component,
  ContentChild,
  EventEmitter,
  Input,
  Output,
  TemplateRef,
} from '@angular/core';
import { NgFor, NgIf, NgTemplateOutlet } from '@angular/common';

import { CardDirective } from './card.directive';

@Component({
  selector: 'app-card',
  template: `
    <ng-content select="[card-header]" />

    <section>
      <ng-container *ngFor="let item of list">
        <ng-container
          [ngTemplateOutlet]="rowTemplate"
          [ngTemplateOutletContext]="{ $implicit: item }" />
      </ng-container>
    </section>

    <button
      class="border border-blue-500 bg-blue-300 p-2 rounded-sm"
      (click)="addNewItem.emit()">
      Add
    </button>
  `,
  standalone: true,
  imports: [NgIf, NgFor, NgTemplateOutlet, CardDirective],
  host: {
    class: 'border-2 border-black rounded-md p-4 w-fit flex flex-col gap-3',
  },
})
export class CardComponent<T> {
  @Input() list: T[] = [];
  @Output() addNewItem = new EventEmitter<void>();
  @ContentChild(CardDirective, { read: TemplateRef })
  rowTemplate!: TemplateRef<{ $implicit: T }>;
}
