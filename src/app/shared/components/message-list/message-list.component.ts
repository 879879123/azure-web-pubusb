import { Component, Input, OnChanges, OnInit } from '@angular/core';
import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver';
import { tap } from 'rxjs';

@Component({
  selector: 'app-message-list',
  templateUrl: './message-list.component.html',
  styleUrls: ['./message-list.component.scss'],
})
export class MessageListComponent implements OnInit, OnChanges {
  @Input() logs;
  datas: Array<any> = [];
  constructor() {}

  ngOnInit(): void {}

  ngOnChanges() {
    this.logs.pipe(tap((log) => this.datas.push(log))).subscribe();
  }

  exportExcel() {
    const json = this.datas.filter((data) => data);
    if (json?.length <= 0) return;

    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(json);
    const workbook: XLSX.WorkBook = {
      Sheets: { data: worksheet },
      SheetNames: ['data'],
    };
    const excelBuffer: any = XLSX.write(workbook, {
      bookType: 'xlsx',
      type: 'array',
    });

    const EXCEL_TYPE =
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
    const data: Blob = new Blob([excelBuffer], {
      type: EXCEL_TYPE,
    });
    FileSaver.saveAs(data, `pubsub_log_${new Date().getTime()}.xlsx`);
  }
}
