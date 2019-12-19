import { Component, OnInit, ViewChild } from '@angular/core';

import { MatTableDataSource, MatPaginator } from '@angular/material';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import {IMyDpOptions} from 'mydatepicker';

import { ConnectorService } from '../../services/connector.service';
import { ExcelService } from '../../services/excel.service';

import * as shpwrite from 'shp-write';
import * as $ from 'jquery';


@Component({
  selector: 'app-compensation',
  templateUrl: './compensation.component.html',
  styleUrls: ['./compensation.component.scss'],
  providers: [ConnectorService]
})
export class CompensationComponent implements OnInit {

  options;
  record: any;
  dataSource: any;
  dataSource1: any;
  dataSource2: any;
  dataSource3: any;
  dataSource4: any;
  dataSource5: any;
  fromDate;
  toDate;
  displayedCol1: any = [];
  displayedCol2: any = [];
  displayedCol3: any = [];
  displayedCol4: any = [];
  displayedCol5: any = [];
  dataSource6: any;
  dataSource7: any;
  displayedCol6: any = [];
  displayedCol7: any = [];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  totalPost = 10;
  postPerPage = 10;
  pageSizeOptions = [5, 10, 20, 50, 100];

  tableType1 = 'Catagory';
  tableType2 = 'WSID';


  constructor(private wildService: ConnectorService, private excelService: ExcelService, private spinnerService: Ng4LoadingSpinnerService) { }

  public myDatePickerOptions: IMyDpOptions = {
    // other options...
    dateFormat: 'yyyy-mm-dd',
};

  displayedCol = [
        "COM_METAINSTANCE_ID",
         "COM_DEVICE_ID",
         "COM_USER_NAME",
         "COM_OM_TOTAL_CASES"
        ]
  ngOnInit() {
   // this.downloadShapeFile();
    this.spinnerService.show();
    this.getTable1();
    this.getDateRange();
    // this.block2Comp();
    // this.block3Comp();
    this.getTotalCompByCategory();
    this.totalCompomSheet();
    this.getAllCompByWSID("All");

    // this.record = this.wildService.getCompensation_OM();
    // this.record.subscribe(res => {
    //   if (!res) {
    //     this.spinnerService.hide();
    //     return;
    //   }
    //   this.dataSource = new MatTableDataSource(res.response);
    //   this.dataSource.paginator = this.paginator;

    // });
    this.spinnerService.hide();
  }

showMainContent: boolean = false;

  buttonName: any = "Date Range"

  showHideButton() {
    if(this.showMainContent = !this.showMainContent){
      this.buttonName = "All Cases";
      this.block2Comp();
      this.block3Comp();
      this.totalCompomSheetBydate();
      this.compamtomsheetdate();
      this.getcompamtomsheetdatebycat();
      this.getallcompbyomsheet();
      this.getcompbyomsheetdate();
      this.getcompamtomsheetdatebycat();
      this.getCompByRange();
    }
     else{
      this.buttonName = "Date Range";

     }

  }

  getDateRange(){
    var d: Date = new Date();
    //
          this.toDate = {date: {year: d.getFullYear(),
                               month: d.getMonth() + 1,
                               day: d.getDate()},
                              formatted:d.getFullYear()+"-"+('0' + (d.getMonth() + 1)).slice(-2)+"-"+('0' + (d.getDate())).slice(-2)};
          this.fromDate = {date: {year: d.getFullYear(),
                                month: d.getMonth()+1 -2 ,
                                day: d.getDate()},
                              formatted: d.getFullYear()+"-"+('0' + (d.getMonth()+1-2)).slice(-2)+"-"+('0' + (d.getDate())).slice(-2)};
                              if(this.fromDate.date.month === -1 || this.fromDate.date.month === 0){
                                this.fromDate = {date: {year: d.getFullYear()-1,
                                  month:  d.getMonth() + 11  ,
                                  day: d.getDate()},
                                formatted: d.getFullYear()-1+"-"+('0' + (d.getMonth() + 11)).slice(-2)+"-"+('0' + (d.getDate())).slice(-2)};
                               }

                          }
  allCompByWSID: any=[];
  allCompByWSIDByPark: any = [];
  dispColWSID: any;
  dispColWSIDByPark: any;
  parkFilter: any =[];
  selected1:any;
  getAllCompByWSID(data){
    const record = this.wildService.getCompByWSIDAll();
    record.subscribe(res => {
      this.allCompByWSID = res[0];
      console.log(res);
      this.dispColWSID = ["WSID", "FREQUENCY", "TOTAL", "AVERAGE", "MIN COMP", "MAX COMP", "STANDARD DEVIATION"];

    let parkData = res[1];
    let resultPark = parkData.reduce(function(r, a) {
      r[a.com_park] = r[a.com_park] || [];
      r[a.com_park].push(a);
      return r;
  }, Object.create(null));
  this.parkFilter = Object.keys(resultPark);
  this.parkFilter.unshift("All");
  this.selected1 = this.parkFilter[0];

  let rangeData = res[2];
  let resultRange = rangeData.reduce(function(r, a) {
    r[a.COM_OM_RANGE] = r[a.COM_OM_RANGE] || [];
    r[a.COM_OM_RANGE].push(a);
    return r;
}, Object.create(null));
console.log(resultRange);

  let talukData = res[3];
  let resultTaluk = talukData.reduce(function(r, a) {
    r[a.COM_TALUK] = r[a.COM_TALUK] || [];
    r[a.COM_TALUK].push(a);
    return r;
}, Object.create(null));
console.log(resultTaluk);
    });
  }

  getTable1(){
    this.record = this.wildService.getTotalComp();
    this.record.subscribe(res => {
      console.log(res);
       this.dataSource1 = res;

      this.displayedCol1 = ["FREQUENCY","TOTAL","AVERAGE","MAX COMP","MIN COMP","STANDARD DEVIATION"];
    });
  }


  onSubmit(fDate, tDate){
    this.fromDate= fDate;
    this.toDate=tDate;
    this.block2Comp();
    this.block3Comp();
    this.totalCompomSheetBydate();
    this.compamtomsheetdate();
    this.getcompamtomsheetdatebycat();
    this.getallcompbyomsheet();
    this.getcompbyomsheetdate();
    this.getcompamtomsheetdatebycat();
    this.getCompByRange();
  }

  dataRange: any = [];
  displayedColRange: any = [];
  getCompByRange(){
    let result = this.wildService.getCompbyRange(this.fromDate.formatted,this.toDate.formatted);
    result.subscribe(res => {

      this.dataRange = res;
      this.displayedColRange = ["RANGE", "FREQUENCY", "TOTAL", "AVERAGE", "COMP MAX", "COMP MIN","STANDARD DEVIATION"];
    })
  }

  exportdata(){
    this.xlsxReport(this.dataSource1, 'Total_Compensation');
    this.xlsxReport(this.datcomp, 'Total_Compensation_Category');
    this.xlsxReport(this.totalsheetdata, 'Total_NO_Of_Sheets_In_Compensation');
  }

  exportdatadaterang(){
    this.xlsxReport(this.dataSource2, 'Compensation_by_category');
    this.xlsxReport(this.dataSource3, 'Compensation_by_park');
    this.xlsxReport(this.dataSource4, 'Compensation_by_taluk');
    this.xlsxReport(this.dataRange, 'Compensation_by_Range');
    this.xlsxReport(this.dataSource5, 'Compensation_by_village');
    this.xlsxReport(this.dataSource6, 'Compensation_by_wsid');
    this.xlsxReport(this.dataSource7, 'Comp_by_village_by_data_range');
    this.xlsxReport(this.dataomsheet, 'Total_OM_Sheets_In_Compensation_BY_date');
     this.xlsxReport(this.allcompomsheetdata, 'ALL_Compensation_OM_Sheets_BY_date');
     this.xlsxReport(this.dataomsheetcomp, 'Total_OM_Sheets_In_Compensation_BY_date');
     this.xlsxReport(this.datares, 'Total_NO_Of_Sheets_In_Compensation_BY_date_range');
     this.xlsxReport(this.crcol, 'Om Sheet by Crop Loss by date');
     this.xlsxReport(this.crpdcol, 'Om Sheet by Crop Loss & Property Loss by date');
    this.xlsxReport(this.pdcol, 'Om Sheet by Property Loss by date');
       this.xlsxReport(this.lpcol, 'Om Sheet by Livestock Predation by date');
        this.xlsxReport(this.hicol, 'Om Sheet by Human Injury by date');
         this.xlsxReport(this.hdcol, 'Om Sheet by Human Death by date');


  }

  block2Comp(){
    if (this.fromDate !== undefined && this.toDate !== undefined) {
    this.record = this.wildService.getCompFilter(this.fromDate.formatted, this.toDate.formatted);
    this.record.subscribe(res => {

      this.dataSource2 = res[0];
      this.displayedCol2 = ["CATEGORY", "FREQUENCY", "TOTAL", "AVERAGE", "COMP MAX", "COMP MIN", "STANDARD DEVIATION"];

      this.dataSource3 = res[1];
      this.displayedCol3 = ["PARK", "FREQUENCY", "TOTAL", "AVERAGE", "COMP MAX", "COMP MIN", "STANDARD DEVIATION"];

      this.dataSource4 = res[2];
      this.dataSource4.forEach(element => {
          if (element.TALUK === "Hdkote")
        {
         element.TALUK = this.change();
      }

      if (element.TALUK === "Gsbetta")
        {
        element.TALUK = this.changegb();
      }
      if (element.TALUK === "Dbkuppe")
        {
        element.TALUK = this.changedb();
      }
      if (element.TALUK === "Nbeguru")
        {
        element.TALUK = this.changenb();
      }
      });
      this.displayedCol4 = ["TALUK", "FREQUENCY", "TOTAL", "AVERAGE", "COMP MAX", "COMP MIN","STANDARD DEVIATION"];

      this.dataSource5 = res[3];
      this.displayedCol5 = ["VILLAGE", "FREQUENCY", "TOTAL", "AVERAGE", "COMP MAX", "COMP MIN", "STANDARD DEVIATION"];
    });
  }
  }

change() {

          var str:any = 'Hdkote'; //the subject string
          var arr =[0,2,1]; //to uppercase character index 0 and 2

           str = str.split("");

          for(var i = 0; i < str.length; i++){
              if($.inArray(i,arr)!= -1){
                 str[i] = str[i].toUpperCase();
              }
          }

          str = str.join('');

          //the result must be PoSt
          var str1 = str;
          var newStr = [str1.slice(0, 2), str1.slice(2)].join(' ');
          return newStr;
        }

        changegb() {

          var str:any = 'Gsbetta'; //the subject string
          var arr =[0,2,1]; //to uppercase character index 0 and 2

           str = str.split("");

          for(var i = 0; i < str.length; i++){
              if($.inArray(i,arr)!= -1){
                 str[i] = str[i].toUpperCase();
              }
          }

          str = str.join('');

          //the result must be PoSt
          var str1 = str;
          var newStr = [str1.slice(0, 2), str1.slice(2)].join(' ');
          return newStr;
        }

        changedb() {

          var str:any = 'Dbkuppe'; //the subject string
          var arr =[0,2,1]; //to uppercase character index 0 and 2

           str = str.split("");

          for(var i = 0; i < str.length; i++){
              if($.inArray(i,arr)!= -1){
                 str[i] = str[i].toUpperCase();
              }
          }

          str = str.join('');

          //the result must be PoSt
          var str1 = str;
          var newStr = [str1.slice(0, 2), str1.slice(2)].join(' ');
          return newStr;
        }

        changenb() {

          var str:any = 'Nbeguru'; //the subject string
          var arr =[0,1]; //to uppercase character index 0 and 2

           str = str.split("");

          for(var i = 0; i < str.length; i++){
              if($.inArray(i,arr)!= -1){
                 str[i] = str[i].toUpperCase();
              }
          }

          str = str.join('');

          //the result must be PoSt
          var str1 = str;
          var newStr = [str1.slice(0, 1), str1.slice(1)].join(' ');

          return newStr;

        }


  displayedColsheetcat:any=[];
  compamtomsheetdata1:any;
  compamtomsheetcat:any;
  data1:any;
  bcat:any;
  cr=[
    "OM SHEET DATE","HWC CATEGORY","FREQ HWC CATEGORY","TOTAL","AVERAGE","MAX COMP","MIN COMP","STANDARD DEVIATION"
  ];

  crpdcol:any=[];
  pdcol:any=[];
  lpcol:any=[];
  hdcol:any=[];
  hicol:any=[];
crcol: any = [];

  getcompamtomsheetdatebycat(){

    this.compamtomsheetcat = this.wildService.getcompamtomsheetdatebycategory(this.fromDate.formatted, this.toDate.formatted);
    this.compamtomsheetcat.subscribe(res => {

    this.compamtomsheetdata1 = res;
    let compamtomsheetdata2 = res.reduce(function (r, a) {
        r[a.HWC_Category] = r[a.HWC_Category] || [];
        r[a.HWC_Category].push(a);
        return r;
    },Object.create(null));
    let categry: any[] = Object.keys(compamtomsheetdata2)

    this.crcol = compamtomsheetdata2["CR"];
    if(this.crcol != undefined){
    this.crcol.forEach(element => {
        element.Om_Sheet_Date =
        element.Om_Sheet_Date.slice(0,10);
      });
    }

    this.crpdcol = compamtomsheetdata2["CRPD"];
    if(this.crpdcol != undefined){
    this.crpdcol.forEach(element => {
        element.Om_Sheet_Date =
        element.Om_Sheet_Date.slice(0,10);
      });
    }

    this.pdcol = compamtomsheetdata2["PD"];
    if(this.pdcol != undefined){
    this.pdcol.forEach(element => {
        element.Om_Sheet_Date =
        element.Om_Sheet_Date.slice(0,10);
      });
    }

    this.hicol = compamtomsheetdata2["HI"];
    if(this.hicol != undefined){
    this.hicol.forEach(element => {
        element.Om_Sheet_Date =
        element.Om_Sheet_Date.slice(0,10);
      });
    }

    this.lpcol = compamtomsheetdata2["LP"];
    if(this.lpcol != undefined){
    this.lpcol.forEach(element => {
        element.Om_Sheet_Date =
        element.Om_Sheet_Date.slice(0,10);
      });
    }

    this.hdcol = compamtomsheetdata2["HD"];
    if(this.hdcol != undefined){
    this.hdcol.forEach(element => {
        element.Om_Sheet_Date =
        element.Om_Sheet_Date.slice(0,10);
      });
    }
  });
  }


  allcompomsheetdata:any;
  allcompsheetcol:any=[];
  allcompsheetres:any;
  getallcompbyomsheet(){
    this.allcompsheetres = this.wildService.getcompbyomsheet(this.fromDate.formatted, this.toDate.formatted);
    this.allcompsheetres.subscribe(res => {
      this.allcompomsheetdata = res;
      this.allcompsheetcol = ["OM SHEET NO","WSID","FREQUENCY","TOTAL","AVERAGE","MAX COMP","MIN COMP", "STANDARD DEVIATION"];
    });

  }

totalsheetdatabydate:any;
datares:any;
totalsheetdisplayedCol:any=[];
totalCompomSheetBydate(){
 this.totalsheetdatabydate = this.wildService.getcompomsheetBydate(this.fromDate.formatted, this.toDate.formatted);
 this.totalsheetdatabydate.subscribe(res =>{
   this.datares = res;
   this.totalsheetdisplayedCol = ["TOTAL NO SHEETS"];

 })

}

Om_Sheet_Datedata:any;
dataomsheet:any;
omsheetdisplayedCol:any=[];

compamtomsheetdate(){
  this.Om_Sheet_Datedata = this.wildService.getcompamtomsheetdate(this.fromDate.formatted, this.toDate.formatted);
 this.Om_Sheet_Datedata.subscribe(res =>{
   this.dataomsheet = res;
   this.dataomsheet.forEach(element => {
        element.Om_Sheet_Date =
        element.Om_Sheet_Date.slice(0,10);
      });
   this.omsheetdisplayedCol = ["OM SHEET DATE","TOTAL","AVERAGE","MAX COMP", "MIN COMP","STANDARD DEVIATION"];

 });
}

Om_Sheet_com_Datedata:any;
dataomsheetcomp:any;
omsheetcompdisplayedCol:any=[];

getcompbyomsheetdate(){
  this.Om_Sheet_com_Datedata = this.wildService.getcompbyomsheetdate(this.fromDate.formatted, this.toDate.formatted);
  this.Om_Sheet_com_Datedata.subscribe(res =>{

   this.dataomsheetcomp = res;
   this.dataomsheetcomp.forEach(element => {
        element.Om_Sheet_Date =
        element.Om_Sheet_Date.slice(0,10);
      });
   this.omsheetcompdisplayedCol =["OM SHEET DATE","FREQUENCY","TOTAL","AVERAGE","MAX COMP","MIN COMP", "STANDARD DEVIATION"]

 });

}


  block3Comp(){
    if (this.fromDate !== undefined && this.toDate !== undefined) {
    this.record = this.wildService.getTopComp(this.fromDate.formatted, this.toDate.formatted);
    this.record.subscribe(res => {

      this.dataSource6 = res[0];
      this.displayedCol6 = ["WSID", "FREQUENCY","TOTAL", "AVERAGE", "COMP MAX", "COMP MIN", "STANDARD DEVIATION"];

      this.dataSource7 = res[1];
      this.displayedCol7 = ["VILLAGE", "FREQUENCY","TOTAL", "AVERAGE", "COMP MAX", "COMP MIN", "STANDARD DEVIATION"];
    });
  }
  }

  comprecord:any;
  displayedcompCol: any = [];
  datcomp:any;
  getTotalCompByCategory(){
    this.comprecord = this.wildService.getTotalCompByCat();
   this.comprecord.subscribe(res => {
    console.log(res);
     this.datcomp = res;
      this.displayedcompCol = ["CATEGORY", "FREQUENCY","TOTAL", "AVERAGE", "COMP MAX", "COMP MIN","STANDARD DEVIATION"];

   });

  }

totalsheet:any;
totalsheetdata:any;
displayedsheetCol: any=[];

  totalCompomSheet(){
    this.comprecord = this.wildService.getcompomsheet();
   this.comprecord.subscribe(res => {

     this.totalsheetdata = res;
      this.displayedsheetCol = ["TOTAL NO OF SHEETS"];
   });

  }

  xlsxReport(data, name) {
     if( data != undefined){
      let d = new Date();
      if(data.length != 0){
        name = name+'_'+d.getDate()+'/'+(d.getMonth()+1 )+'/'+d.getFullYear();
    this.excelService.exportAsExcelFile(data,  name);
    return 'success';
      }
     }
  }

 downloadShapeFile(){
// (optional) set names for feature types and zipped folder
this.options = {
  folder: 'myshapes',
  types: {
      point: 'mypoints',
      polygon: 'mypolygons',
      line: 'mylines'
  }
}
// a GeoJSON bridge for features
shpwrite.download({
  type: 'FeatureCollection',
  features: [
      {
          type: 'Feature',
          geometry: {
              type: 'Point',
              coordinates: [15.3173, 75.7139]
          },
          properties: {
              name: 'Foo'
          }
      },
      // {
      //     type: 'Feature',
      //     geometry: {
      //         type: 'Point',
      //         coordinates: [11.90493, 76.52373]
      //     },
      //     properties: {
      //         name: 'Bar'
      //     }
      // }
  ]
}, this.options);
 }

}
