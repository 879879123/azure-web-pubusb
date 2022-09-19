import { Component, Input, OnChanges, OnInit } from '@angular/core';
import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver';

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
    this.logs.subscribe((log) => {
      this.datas.push(log);
    });
  }

  onExportExcel() {
    const json = this.datas.filter((data) => data);
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
