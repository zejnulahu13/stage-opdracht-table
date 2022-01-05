import { DataSource } from '@angular/cdk/collections';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { map } from 'rxjs/operators';
import { Observable, of as observableOf, merge } from 'rxjs';
import { compileFactoryFunction } from '@angular/compiler';

// TODO: Replace this with your own data model type
export interface DataTableItem {
  name: string;
  id: string;
  gender: string;
  company: string;
  email: string;
}

// TODO: replace this with real data from your application
const EXAMPLE_DATA: DataTableItem[] = [
  {
    id: '5d2c8549116acb1d6fc7104a',
    name: 'Castillo Barnes',
    gender: 'male',
    company: 'ZENTILITY',
    email: 'castillobarnes@zentility.com'},
  {
    id: '5d2c8549b74cbcc7f9099dc9',
    name: 'Tabatha Adams',
    gender: 'female',
    company: 'APEX',
    email: 'tabathaadams@apex.com'},
  {
    id: '5d2c8549680c5d25ac52d9d5',
    name: 'Estrada Blake',
    gender: 'male',
    company: 'SONGBIRD',
    email: 'estradablake@songbird.com'},
  {
    id: '5d2c85492c11dfc3aa6c4065',
    name: 'Patterson Salinass',
    gender: 'male',
    company: 'CODACT',
    email: 'pattersonsalinas@codact.com'},
  {
    id: '5d2c8549492ab8feb572bfd8',
    name: 'Rhodes Goodwin",',
    gender: 'male',
    company: 'EWEVILLE',
    email: '"rhodesgoodwin@eweville.com'},
  {
    id: '5d2c854900da46a3ba6236f8',
    name: 'Katharine Lindsay',
    gender: 'female',
    company: 'QUIZKA',
    email: '"katharinelindsay@quizka.com'}, 
  {
    id: '5d2c8549e0d8784e52edf29d',
    name: 'Maude Bright',
    gender: 'female',
    company: 'JIMBIES',
    email: 'maudebright@jimbies.com'},
  {
    id: '5d2c85497f5f7f54696d4831',
    name: 'Oneal Wolf',
    gender: 'male',
    company: 'ZENTRY',
    email: 'onealwolf@zentry.com"'},
  {
    id: '5d2c8549e18cf0fdc3cf4422',
    name: 'Munoz Kline',
    gender: 'male',
    company: 'NETAGY',
    email: 'munozkline@netagy.com'},
  {
    id: '5d2c8549eb6eeaf10fa4b1b6',
    name: 'Isabella Sweet',
    gender: 'female',
    company: 'VOLAX',
    email: '"isabellasweet@volax.com'},
];

/**
 * Data source for the DataTable view. This class should
 * encapsulate all logic for fetching and manipulating the displayed data
 * (including sorting, pagination, and filtering).
 */
export class DataTableDataSource extends DataSource<DataTableItem> {
  data: DataTableItem[] = EXAMPLE_DATA;
  paginator: MatPaginator | undefined;
  sort: MatSort | undefined;

  constructor() {
    super();
  }

  /**
   * Connect this data source to the table. The table will only update when
   * the returned stream emits new items.
   * @returns A stream of the items to be rendered.
   */
  connect(): Observable<DataTableItem[]> {
    if (this.paginator && this.sort) {
      // Combine everything that affects the rendered data into one update
      // stream for the data-table to consume.
      return merge(observableOf(this.data), this.paginator.page, this.sort.sortChange)
        .pipe(map(() => {
          return this.getPagedData(this.getSortedData([...this.data ]));
        }));
    } else {
      throw Error('Please set the paginator and sort on the data source before connecting.');
    }
  }

  /**
   *  Called when the table is being destroyed. Use this function, to clean up
   * any open connections or free any held resources that were set up during connect.
   */
  disconnect(): void {}

  /**
   * Paginate the data (client-side). If you're using server-side pagination,
   * this would be replaced by requesting the appropriate data from the server.
   */
  private getPagedData(data: DataTableItem[]): DataTableItem[] {
    if (this.paginator) {
      const startIndex = this.paginator.pageIndex * this.paginator.pageSize;
      return data.splice(startIndex, this.paginator.pageSize);
    } else {
      return data;
    }
  }

  /**
   * Sort the data (client-side). If you're using server-side sorting,
   * this would be replaced by requesting the appropriate data from the server.
   */
  private getSortedData(data: DataTableItem[]): DataTableItem[] {
    if (!this.sort || !this.sort.active || this.sort.direction === '') {
      return data;
    }

    return data.sort((a, b) => {
      const isAsc = this.sort?.direction === 'asc';
      switch (this.sort?.active) {
        case 'name': return compare(a.name, b.name, isAsc);
        case 'id': return compare(+a.id, +b.id, isAsc);
        default: return 0;
      }
    });
  }
}

/** Simple sort comparator for example ID/Name columns (for client-side sorting). */
function compare(a: string | number, b: string | number, isAsc: boolean): number {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}
