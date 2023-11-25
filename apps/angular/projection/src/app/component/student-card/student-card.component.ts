import { Component, inject } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { switchMap, tap } from 'rxjs';

import {
  FakeHttpService,
  randStudent,
} from '../../data-access/fake-http.service';
import { StudentStore } from '../../data-access/student.store';
import { CardComponent } from '../../ui/card/card.component';
import { ListItemComponent } from '../../ui/list-item/list-item.component';
import { CardDirective } from '../../ui/card/card.directive';

@Component({
  selector: 'app-student-card',
  template: `
    <app-card
      [list]="(students$ | async)!"
      (addNewItem)="handleAddNewItem()"
      class="bg-yellow-100">
      <img card-header src="assets/img/student.webp" width="200px" />
      <ng-template card-list-item let-student>
        <app-list-item (deleteItem)="handleDeleteItem(student.id)">
          {{ student.firstname }}
        </app-list-item>
      </ng-template>
    </app-card>
  `,
  standalone: true,
  imports: [CardComponent, ListItemComponent, CardDirective, AsyncPipe],
})
export class StudentCardComponent {
  http = inject(FakeHttpService);
  store = inject(StudentStore);
  students$ = this.http.fetchStudents$.pipe(
    tap((students) => this.store.addAll(students)),
    switchMap(() => this.store.students$),
  );

  handleDeleteItem(id: number): void {
    this.store.deleteOne(id);
  }

  handleAddNewItem(): void {
    this.store.addOne(randStudent());
  }
}
