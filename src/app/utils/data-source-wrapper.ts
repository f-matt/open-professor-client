import {MatTableDataSource} from "@angular/material/table";

export class DataSourceWrapper<Type> {

  data : Type[];
  dataSource : MatTableDataSource<Type>;
  displayedColumns : string[];
  pageIndex : number;
  pageSize : number;
  length : number;

  constructor(data : Type[], displayedColumns : string[]) {
    this.data = data;
    this.dataSource = new MatTableDataSource<Type>(this.data);
    this.displayedColumns = displayedColumns;
    this.pageIndex = 0;
    this.pageSize = 0;
    this.length = 0;
  }

  update(data : Type[]) : void {
    this.data = data;
    this.dataSource = new MatTableDataSource<Type>(this.data);
    this.pageIndex = 0;
    this.pageSize = 5;
    this.length = this.data.length;
  }
}
