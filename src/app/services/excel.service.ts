import { Injectable } from '@angular/core';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';

const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';


@Injectable()
export class ExcelService {

  constructor() { }

  /// export excel
  public exportAsExcelFile(json: any[], excelFileName: string): void {
    let worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(json);
    let workbook: XLSX.WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
    let excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    this.saveAsExcelFile(excelBuffer, excelFileName);
  }

  ///export report 3 sheets
  public exportReport(json, excelFileName: string): void {
    let worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(json[0]);
    let worksheet1: XLSX.WorkSheet = XLSX.utils.json_to_sheet(json[1]);
    let worksheet2: XLSX.WorkSheet = XLSX.utils.json_to_sheet(json[2]);


    // tslint:disable-next-line:max-line-length
    let workbook: XLSX.WorkBook = { Sheets: { 'report1': worksheet, 'report2': worksheet1 , 'report3': worksheet2}, SheetNames: ['report1','report2', 'report3'] };
    let excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    this.saveAsExcelFile(excelBuffer, excelFileName);
  }

   ///export report 5 sheets
   public exportReportSheet5(json, excelFileName: string): void {
    let worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(json[0]);
    let worksheet1: XLSX.WorkSheet = XLSX.utils.json_to_sheet(json[1]);
    let worksheet2: XLSX.WorkSheet = XLSX.utils.json_to_sheet(json[2]);
    let worksheet3: XLSX.WorkSheet = XLSX.utils.json_to_sheet(json[3]);
    let worksheet4: XLSX.WorkSheet = XLSX.utils.json_to_sheet(json[4]);



    // tslint:disable-next-line:max-line-length
    let workbook: XLSX.WorkBook = { Sheets: { 'report1': worksheet, 'report2': worksheet1 , 'report3': worksheet2,  'report4': worksheet3, 'report5': worksheet4}, SheetNames: ['report1','report2', 'report3','report4', 'report5'] };
    let excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    this.saveAsExcelFile(excelBuffer, excelFileName);
  }

  private saveAsExcelFile(buffer: any, fileName: string): any {
    const data: Blob = new Blob([buffer], {
      type: EXCEL_TYPE
    });
   // return data;
    FileSaver.saveAs(data, fileName + EXCEL_EXTENSION);
  }
}
