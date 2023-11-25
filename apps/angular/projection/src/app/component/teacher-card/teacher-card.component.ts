import { Component, inject } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { switchMap, tap } from 'rxjs';

import {
  FakeHttpService,
  randTeacher,
} from '../../data-access/fake-http.service';
import { TeacherStore } from '../../data-access/teacher.store';
import { CardComponent } from '../../ui/card/card.component';
import { ListItemComponent } from '../../ui/list-item/list-item.component';
import { CardDirective } from '../../ui/card/card.directive';

@Component({
  selector: 'app-teacher-card',
  template: `
    <app-card
      [list]="(teachers$ | async)!"
      (addNewItem)="handleAddNewItem()"
      class="bg-yellow-100">
      <img card-header src="assets/img/teacher.png" width="200px" />
      <ng-template card-list-item let-teacher>
        <app-list-item (deleteItem)="handleDeleteItem(teacher.id)">
          {{ teacher.firstname }}
        </app-list-item>
      </ng-template>
    </app-card>
  `,
  standalone: true,
  imports: [CardComponent, ListItemComponent, CardDirective, AsyncPipe],
})
export class TeacherCardComponent {
  http = inject(FakeHttpService);
  store = inject(TeacherStore);
  teachers$ = this.http.fetchTeachers$.pipe(
    tap((teachers) => this.store.addAll(teachers)),
    switchMap(() => this.store.teachers$),
  );

  handleDeleteItem(id: number): void {
    this.store.deleteOne(id);
  }

  handleAddNewItem(): void {
    this.store.addOne(randTeacher());
  }
}
