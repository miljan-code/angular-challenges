import { Component, inject } from '@angular/core';
import { switchMap, tap } from 'rxjs';
import { AsyncPipe } from '@angular/common';

import {
  FakeHttpService,
  randomCity,
} from '../../data-access/fake-http.service';
import { CityStore } from '../../data-access/city.store';
import { CardComponent } from '../../ui/card/card.component';
import { ListItemComponent } from '../../ui/list-item/list-item.component';
import { CardDirective } from '../../ui/card/card.directive';

@Component({
  selector: 'app-city-card',
  template: `
    <app-card
      [list]="(cities$ | async)!"
      (addNewItem)="handleAddNewItem()"
      class="bg-yellow-100">
      <img card-header src="assets/img/city.jpg" width="200px" />
      <ng-template card-list-item let-city>
        <app-list-item (deleteItem)="handleDeleteItem(city.id)">
          {{ city.name }}
        </app-list-item>
      </ng-template>
    </app-card>
  `,
  standalone: true,
  imports: [CardComponent, ListItemComponent, CardDirective, AsyncPipe],
})
export class CityCardComponent {
  http = inject(FakeHttpService);
  store = inject(CityStore);
  cities$ = this.http.fetchCities$.pipe(
    tap((cities) => this.store.addAll(cities)),
    switchMap(() => this.store.cities$),
  );

  handleDeleteItem(id: number): void {
    this.store.deleteOne(id);
  }

  handleAddNewItem(): void {
    this.store.addOne(randomCity());
  }
}
