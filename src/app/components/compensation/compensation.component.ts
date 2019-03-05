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
    this.block2Comp();
    this.block3Comp();
    this.getTotalCompByCategory();
    this.totalCompomSheet();
    
    
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
    }
     else{
      this.buttonName = "Date Range";

     }

  }

  getDateRange(){
    var d: Date = new Date();
    //  console.log(d);
          this.toDate = {date: {year: d.getFullYear(),
                               month: d.getMonth() + 1,
                               day: d.getDate()},
                              formatted:d.getFullYear()+"-"+('0' + (d.getMonth() + 1)).slice(-2)+"-"+('0' + (d.getDate())).slice(-2)};
          this.fromDate = {date: {year: d.getFullYear(),
                                month: d.getMonth() -2 ,
                                day: d.getDate()},
                              formatted: d.getFullYear()+"-"+('0' + (d.getMonth()-2)).slice(-2)+"-"+('0' + (d.getDate())).slice(-2)};
                              if(this.fromDate.date.month === -2 || this.fromDate.date.month === -1){
                                this.fromDate = {date: {year: d.getFullYear()-1,
                                  month:  d.getMonth() + 11  ,
                                  day: d.getDate()},
                                formatted: d.getFullYear()-1+"-"+('0' + (d.getMonth() + 11)).slice(-2)+"-"+('0' + (d.getDate())).slice(-2)};
                               }

                          }

  getTable1(){
    this.record = this.wildService.getTotalComp();
    this.record.subscribe(res => {

       this.dataSource1 = res;
       console.log(res);
      this.displayedCol1 = ["FREQUENCY","TOTAL","AVERAGE","MAX COMP","MIN COMP"];
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

  }

  block2Comp(){
    if (this.fromDate !== undefined && this.toDate !== undefined) {
    this.record = this.wildService.getCompFilter(this.fromDate.formatted, this.toDate.formatted);
    this.record.subscribe(res => {
      console.log(res);
      this.dataSource2 = res[0];
      this.displayedCol2 = ["CATEGORY", "FREQUENCY", "TOTAL", "AVERAGE", "COMP MAX", "COMP MIN"];

      this.dataSource3 = res[1];
      this.displayedCol3 = ["PARK", "FREQUENCY", "TOTAL", "AVERAGE", "COMP MAX", "COMP MIN"];

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
      this.displayedCol4 = ["TALUK", "FREQUENCY", "TOTAL", "AVERAGE", "COMP MAX", "COMP MIN"];

      this.dataSource5 = res[3];
      this.displayedCol5 = ["VILLAGE", "FREQUENCY", "TOTAL", "AVERAGE", "COMP MAX", "COMP MIN"];
    });
  }
  }

change() {

          var str:any = 'Hdkote'; //the subject string
          var arr =[0,2,1]; //to uppercase character index 0 and 2

           str = str.split("");
           console.log(str)
          for(var i = 0; i < str.length; i++){
              if($.inArray(i,arr)!= -1){
                 str[i] = str[i].toUpperCase();
              }
          }
          console.log(str);
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
           console.log(str)
          for(var i = 0; i < str.length; i++){
              if($.inArray(i,arr)!= -1){
                 str[i] = str[i].toUpperCase();
              }
          }
          console.log(str);
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
           console.log(str)
          for(var i = 0; i < str.length; i++){
              if($.inArray(i,arr)!= -1){
                 str[i] = str[i].toUpperCase();
              }
          }
          console.log(str);
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
           console.log(str)
          for(var i = 0; i < str.length; i++){
              if($.inArray(i,arr)!= -1){
                 str[i] = str[i].toUpperCase();
              }
          }

          str = str.join('');
          console.log(str);
          //the result must be PoSt
          var str1 = str;
          var newStr = [str1.slice(0, 1), str1.slice(1)].join(' ');
          console.log(newStr)
          return newStr;

        }


  displayedColsheetcat:any=[];
  compamtomsheetdata1:any;
  compamtomsheetcat:any;
  data1:any;
  bcat:any;
  cr=[
    "OM SHEET DATE","HWC CATEGORY","FREQ HWC CATEGORY","TOTAL","AVERAGE","MAX COMP","MIN COMP"
  ];
  crcol:any;
  crpdcol:any=[];
  pdcol:any=[];
  lpcol:any=[];
  hdcol:any=[];
  hicol:any=[];


  getcompamtomsheetdatebycat(){

    this.compamtomsheetcat = this.wildService.getcompamtomsheetdatebycategory(this.fromDate.formatted, this.toDate.formatted);
    this.compamtomsheetcat.subscribe(res => {
      console.log(res);
    this.compamtomsheetdata1 = res;
    let compamtomsheetdata2 = res.reduce(function (r, a) {
        r[a.HWC_Category] = r[a.HWC_Category] || [];
        r[a.HWC_Category].push(a);
        return r;
    },Object.create(null));
    let categry: any[] = Object.keys(compamtomsheetdata2)
    console.log(compamtomsheetdata2["LP"]);
    console.log(categry);  

    console.log(compamtomsheetdata2["CR"])
    this.crcol = compamtomsheetdata2["CR"];
     this.crcol.forEach(element => {
        element.Om_Sheet_Date =
        element.Om_Sheet_Date.slice(0,10);
      });
    this.crpdcol = compamtomsheetdata2["CRPD"];
    this.crpdcol.forEach(element => {
        element.Om_Sheet_Date =
        element.Om_Sheet_Date.slice(0,10);
      });
    this.pdcol = compamtomsheetdata2["PD"];
    this.pdcol.forEach(element => {
        element.Om_Sheet_Date =
        element.Om_Sheet_Date.slice(0,10);
      });
   
    this.hicol = compamtomsheetdata2["HI"];
     console.log(compamtomsheetdata2["HI"])
    this.hicol.forEach(element => {
        element.Om_Sheet_Date =
        element.Om_Sheet_Date.slice(0,10);
      });
    this.lpcol = compamtomsheetdata2["LP"];
    console.log(compamtomsheetdata2["LP"])
    this.lpcol.forEach(element => {
        element.Om_Sheet_Date =
        element.Om_Sheet_Date.slice(0,10);
      });
       this.hdcol = compamtomsheetdata2["HD"];
    this.hdcol.forEach(element => {
        element.Om_Sheet_Date = 
        element.Om_Sheet_Date.slice(0,10);
      }); 
      
  });
  }


  allcompomsheetdata:any;
  allcompsheetcol:any=[];
  allcompsheetres:any;
  getallcompbyomsheet(){
    this.allcompsheetres = this.wildService.getcompbyomsheet(this.fromDate.formatted, this.toDate.formatted);
    this.allcompsheetres.subscribe(res => {
      console.log(res);
      this.allcompomsheetdata = res;
      this.allcompsheetcol = ["OM SHEET NO","WSID","FREQUENCY","TOTAL","AVERAGE","MAX COMP","MIN COMP"];
    });

  }

totalsheetdatabydate:any;
datares:any;
totalsheetdisplayedCol:any=[];
totalCompomSheetBydate(){
 this.totalsheetdatabydate = this.wildService.getcompomsheetBydate(this.fromDate.formatted, this.toDate.formatted);
 this.totalsheetdatabydate.subscribe(res =>{
   console.log(res);
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
   console.log(res);
   this.dataomsheet = res;
   this.dataomsheet.forEach(element => {
        element.Om_Sheet_Date =
        element.Om_Sheet_Date.slice(0,10);
      });
   this.omsheetdisplayedCol = ["OM SHEET DATE","TOTAL","AVERAGE","MAX COMP", "MIN COMP"];

 });
}

Om_Sheet_com_Datedata:any;
dataomsheetcomp:any;
omsheetcompdisplayedCol:any=[];

getcompbyomsheetdate(){
  this.Om_Sheet_com_Datedata = this.wildService.getcompbyomsheetdate(this.fromDate.formatted, this.toDate.formatted);
  this.Om_Sheet_com_Datedata.subscribe(res =>{
   console.log(res);
   this.dataomsheetcomp = res;
   this.dataomsheetcomp.forEach(element => {
        element.Om_Sheet_Date =
        element.Om_Sheet_Date.slice(0,10);
      });
   this.omsheetcompdisplayedCol =["OM SHEET DATE","FREQUENCY","TOTAL","AVERAGE","MAX COMP","MIN COMP"]

 });

}


  block3Comp(){
    if (this.fromDate !== undefined && this.toDate !== undefined) {
    this.record = this.wildService.getTopComp(this.fromDate.formatted, this.toDate.formatted);
    this.record.subscribe(res => {
      console.log(res);
      this.dataSource6 = res[0];
      this.displayedCol6 = ["WSID", "FREQUENCY","TOTAL", "AVERAGE", "COMP MAX", "COMP MIN"];

      this.dataSource7 = res[1];
      this.displayedCol7 = ["VILLAGE", "FREQUENCY","TOTAL", "AVERAGE", "COMP MAX", "COMP MIN"];
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
      this.displayedcompCol = ["CATEGORY", "FREQUENCY","TOTAL", "AVERAGE", "COMP MAX", "COMP MIN"];

   });

  }

totalsheet:any;
totalsheetdata:any;
displayedsheetCol: any=[];

  totalCompomSheet(){
    this.comprecord = this.wildService.getcompomsheet();
   this.comprecord.subscribe(res => {
     console.log(res);
     this.totalsheetdata = res;
      this.displayedsheetCol = ["TOTAL NO OF SHEETS"];
   });

  }

  xlsxReport(data, name) {
    this.excelService.exportAsExcelFile(data,  name);
    return 'success';
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
