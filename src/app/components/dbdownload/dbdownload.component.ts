import { Component, OnInit } from '@angular/core';
import { ConnectorService } from '../../services/connector.service';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { ExcelService } from '../../services/excel.service';
@Component({
  selector: 'app-dbdownload',
  templateUrl: './dbdownload.component.html',
  styleUrls: ['./dbdownload.component.scss']
})
export class DbdownloadComponent implements OnInit {

  constructor(private wildService: ConnectorService, private excelService: ExcelService, private spinnerService: Ng4LoadingSpinnerService) { }

  ngOnInit() {
  //  let year = new Date();
   // console.log(year.getFullYear());
   this.spinnerService.show();
    this.calYear();
    this.dbDownloadDC(this.selected);
    this.dbDownloadHWC(this.selected1);
    this.dbDownloadPub(this.selected2);
    this.spinnerService.hide();
  }
yearArr: any=[];

selected: any;
selected1: any;
selected2: any;

  calYear(){
    let year = new Date();
    for(let i=2015;i<year.getFullYear();i++){
      this.yearArr.push(i + '-' + (i+1));

    }
    this.selected = this.yearArr[this.yearArr.length-1];
    this.selected1 = this.yearArr[this.yearArr.length-1];
    this.selected2 = this.yearArr[this.yearArr.length-1];
  }

  applyFilterHWC(filterValue: string ) {
    this.hwcData.filter = filterValue.trim().toLowerCase();

    if (this.hwcData.paginator) {
      this.hwcData.paginator.firstPage();
    }
  }

  applyFilterDC(filterValue: string ) {
    this.dcData.filter = filterValue.trim().toLowerCase();

    if (this.hwcData.paginator) {
      this.dcData.paginator.firstPage();
    }
  }


  applyFilterPub(filterValue: string ) {
    this.pubData.filter = filterValue.trim().toLowerCase();

    if (this.hwcData.paginator) {
      this.pubData.paginator.firstPage();
    }
  }


  xlsxReport(data, name) {
    this.excelService.exportAsExcelFile(data, name);
    return 'success';
  }

  displayedColHWC: any = [];
  displayedColDC: any = [];
  displayedColPub: any = [];
  hwcData: any;
  dcData: any;
  pubData: any;
  dispColHWC: any = [];
  dispColDC: any = [];
  dispColPub: any = [];



  dbDownloadDC(projYear){

    let data = projYear.split("-");

      let recordDC = this.wildService.getDCDBByYear(data[0], data[1]);
      recordDC.subscribe(res => {
        console.log(res);
        let tableHeaders = Object.keys(Object.values(res)[0]);

        if(this.displayedColDC.length == 0 ){
    tableHeaders.forEach(el => {
    this.displayedColDC.push(el.split('_').join(' '));
    });
  }

    this.dcData = res;
    this.dispColDC = Object.keys(Object.values(res)[0]);

  });


  }

  dbDownloadHWC(projYear){

    let data = projYear.split("-");

    let recordHwc = this.wildService.getHWCDBByYear(data[0],data[1]);

    recordHwc.subscribe(res => {

    let tableHeaders = Object.keys(Object.values(res)[0]);

   if(this.displayedColHWC.length == 0 ){
    tableHeaders.forEach(el => {
    this.displayedColHWC.push(el.split('_').join(' '));
    });
   }

    this.hwcData = res;
    this.dispColHWC = Object.keys(Object.values(res)[0]);

  });
  }

  dbDownloadPub(projYear){

    let data = projYear.split("-");
    let recordPub = this.wildService.getPubDBByYear(data[0], data[1]);
    recordPub.subscribe(res => {
      console.log(res);
      let tableHeaders = Object.keys(Object.values(res)[0]);

  if(this.displayedColPub.length == 0 ){
  tableHeaders.forEach(el => {
  this.displayedColPub.push(el.split('_').join(' '));
  });
}

  this.pubData = res;
  this.dispColPub = Object.keys(Object.values(res)[0]);

});


  }

}
