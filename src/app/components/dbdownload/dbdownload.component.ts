import { Component, OnInit , ViewChild, QueryList, ViewChildren} from '@angular/core';
import { ConnectorService } from '../../services/connector.service';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { MatTableDataSource, MatPaginator } from '@angular/material';
import { ExcelService } from '../../services/excel.service';
@Component({
  selector: 'app-dbdownload',
  templateUrl: './dbdownload.component.html',
  styleUrls: ['./dbdownload.component.scss'],
  providers: [ConnectorService]
})
export class DbdownloadComponent implements OnInit {
  @ViewChildren(MatPaginator) paginator = new QueryList<MatPaginator>();

  dataSourceDC: any = [];
  dataSourceHWC: any = [];
  dataSourceCOMP: any = [];
  dataSourcePUB: any = [];

  constructor(private wildService: ConnectorService, private excelService: ExcelService, private spinnerService: Ng4LoadingSpinnerService) { }

  ngOnInit() {
  //  let year = new Date();
   // console.log(year.getFullYear());
   this.spinnerService.show();
    this.calYear();
     this.dbDownloadDC(this.selected);
     this.dbDownloadHWC(this.selected1);
     this.dbDownloadPub(this.selected2);
    this.dbDownloadComp(this.selected3);
    this.spinnerService.hide();
  }
yearArr: any=[];

selected: any;
selected1: any;
selected2: any;
selected3: any;

  calYear(){
    let year = new Date();
 //   year.setFullYear(2020);
    let curYear = year.getFullYear();
  if(year.getMonth() >= 6)
    year.setFullYear(curYear+1);
  for(let i=2015;i<year.getFullYear();i++){

        this.yearArr.push(i + '-' + (i+1));


    }
    this.selected = this.yearArr[this.yearArr.length-1];
    this.selected1 = this.yearArr[this.yearArr.length-1];
    this.selected2 = this.yearArr[this.yearArr.length-1];
    this.selected3 = this.yearArr[this.yearArr.length-1];

  }


  xlsxReport(data, name) {
    this.excelService.exportAsExcelFile(data, name);
    return 'success';
  }

  displayedColHWC: any[] = [];
  displayedColDC: any[] = [];
  displayedColPub: any[] = [];
  displayedColComp: any[] = [];

  hwcData: any;
  dcData: any;
  pubData: any;
  compData: any;



//  applyFilterHWC(filterValue: string ) {

//     this.hwcData.filter = filterValue.trim().toLowerCase();

//     if (this.hwcData.paginator) {
//       this.hwcData.paginator.firstPage();
//     }
//   }

//   applyFilterDC(filterValue: string ) {
//   filterValue = filterValue.trim();
//   filterValue = filterValue.toLowerCase();
//   this.dcData.filter = filterValue;


//     if (this.dcData.paginator) {
//       this.dcData.paginator.firstPage();
//     }
//   }

dbDownloadComp(projYear){
  let data = projYear.split("-");


    let recordComp = this.wildService.getCompDBByYear(data[0], data[1]);
    recordComp.subscribe(res => {
      this.compData = res;
     if(res.length != 0 ){
      this.displayedColComp.push("COMP_EDIT_BUTTON");
      Object.keys(Object.values(res)[0]).forEach(data => this.displayedColComp.push(data));

this.dataSourceCOMP = new MatTableDataSource(res);
  this.dataSourceCOMP.paginator = this.paginator.toArray()[2];;
}
});

  }


  dbDownloadDC(projYear){

    let data = projYear.split("-");
    console.log(data);

      let recordDC = this.wildService.getDCDBByYear(data[0], data[1]);
      recordDC.subscribe(res => {
        this.dcData = res;
        if(res.length != 0 ){

         this.displayedColDC.push("DC_EDIT_BUTTON");
        Object.keys(Object.values(res)[0]).forEach(data => this.displayedColDC.push(data));
  //   //     if(this.displayedColDC.length == 0 ){
  //   // tableHeaders.forEach(el => {
  //   // this.displayedColDC.push(el);
  //   // });
  // }

  console.log(this.displayedColDC);

  this.dataSourceDC = new MatTableDataSource(res);
  this.dataSourceDC.paginator = this.paginator.toArray()[0];;
}
  // this.dcData = res;
    // this.dcData.paginator = this.paginatorDC;
    // this.dispColDC = Object.keys(Object.values(res)[0]);

  });


  }


  dbDownloadHWC(projYear){

    let data = projYear.split("-");

    let recordHwc = this.wildService.getHWCDBByYear(data[0],data[1]);

    recordHwc.subscribe(res => {

    this.hwcData = res;
    if(res.length != 0 ){

      this.displayedColHWC.push("HWC_EDIT_BUTTON");
      Object.keys(Object.values(res)[0]).forEach(data => this.displayedColHWC.push(data));
   this.dataSourceHWC = new MatTableDataSource(res);
   this.dataSourceHWC.paginator = this.paginator.toArray()[1];;
  }
  });
  }

  dbDownloadPub(projYear){

    let data = projYear.split("-");
    let recordPub = this.wildService.getPubDBByYear(data[0], data[1]);
    recordPub.subscribe(res => {
     this.pubData = res;
     if(res.length != 0 ){
      this.displayedColPub.push("PUB_EDIT_BUTTON");
      Object.keys(Object.values(res)[0]).forEach(data => this.displayedColPub.push(data));
      this.dataSourcePUB = new MatTableDataSource(res);
      this.dataSourcePUB.paginator = this.paginator.toArray()[3];;
     }
  });


  }

   applyFilterDC(filterValue: string) {
    this.dataSourceDC.filter = filterValue.trim().toLowerCase();

    if (this.dataSourceDC.paginator) {
      this.dataSourceDC.paginator.firstPage();
    }
  }

  applyFilterHWC(filterValue: string) {
    this.dataSourceHWC.filter = filterValue.trim().toLowerCase();

    if (this.dataSourceHWC.paginator) {
      this.dataSourceHWC.paginator.firstPage();
    }
  }

  applyFilterPub(filterValue: string ) {
    this.dataSourcePUB.filter = filterValue.trim().toLowerCase();


    if (this.dataSourcePUB.paginator) {
      this.dataSourcePUB.paginator.firstPage();
    }
  }

  applyFilterComp(filterValue: string ) {
    this.dataSourceCOMP.filter = filterValue.trim().toLowerCase();


    if (this.dataSourceCOMP.paginator) {
      this.dataSourceCOMP.paginator.firstPage();
    }
  }

  // ame = 'Angular 6';
  // email="";
  // aa:boolean=false;

  // users=[{
  //   id:'123',
  //   email:'abc@gmail.com'
  // },{
  //   id:'1234',
  //   email:'xyz@hotmail.com'
  // },{
  //   id:'12345',
  //   email:'jsgsbh@kk.com'
  // },{
  //   id:'123456',
  //   email:'test@gmail.com'
  // }]

  // setIndex(ii){
  //   this.aa=ii;
  //   console.log
  // }

  // rows: any = [];
  // columns1: any;
  // data1: any = [];


}

