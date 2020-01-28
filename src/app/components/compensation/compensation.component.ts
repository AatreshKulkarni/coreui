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
    this.getAllCompByWSID();
    this.getCompFilterAll();
    this.getCompByOMSheet();
    this.getCompByWSIDByCat();
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
      this.getCompByWSIDByDate();
      this.getTotalCompByDate();
      this.getCompensationByWSIDByDate();
    }
     else{
      this.buttonName = "Date Range";
      this.getTable1();
      this.getTotalCompByCategory();
      this.totalCompomSheet();
      this.getAllCompByWSID();
      this.getCompFilterAll();
      this.getCompByOMSheet();
      this.getCompByWSIDByCat();
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
  dispColWSID: any;


  parkFilter: any =[];
  selected1:any;
  resultPark: any = [];
  parkData: any = [];
  parkActualData: any = [];
  dispColWSIDPark: any;

  rangeFilter: any =[];
  selected2:any;
  resultRange: any = [];
  rangeData: any = [];
  rangeActualData: any = [];
  dispColWSIDRange: any;

  talukFilter: any =[];
  selected3:any;
  resultTaluk: any = [];
  talukData: any = [];
  talukActualData: any = [];
  dispColWSIDTaluk: any;
  getAllCompByWSID(){
    const record = this.wildService.getCompByWSIDAll();
    record.subscribe(res => {
      this.allCompByWSID = res[0];
      this.dispColWSID = ["WSID",  "FREQUENCY", "TOTAL", "AVERAGE", "MIN COMP", "MAX COMP", "STANDARD DEVIATION"];

    this.parkData = res[1];
    this.parkActualData = res[1];
    this.dispColWSIDPark = ["WSID", "PARK", "FREQUENCY", "TOTAL", "AVERAGE", "MIN COMP", "MAX COMP", "STANDARD DEVIATION"];
    this.resultPark = this.parkData.reduce(function(r, a) {
      r[a.com_park] = r[a.com_park] || [];
      r[a.com_park].push(a);
      return r;
  }, Object.create(null));
  console.log(this.resultPark);
  this.parkFilter = Object.keys(this.resultPark);
  this.parkFilter.unshift("All");
  this.selected1 = this.parkFilter[0];

  this.rangeData = res[2];
  this.rangeActualData = res[2];
  this.dispColWSIDRange = ["WSID", "RANGE", "FREQUENCY", "TOTAL", "AVERAGE", "MIN COMP", "MAX COMP", "STANDARD DEVIATION"];
  this.resultRange = this.rangeData.reduce(function(r, a) {
    r[a.COM_OM_RANGE] = r[a.COM_OM_RANGE] || [];
    r[a.COM_OM_RANGE].push(a);
    return r;
}, Object.create(null));
console.log(this.resultRange);
this.rangeFilter = Object.keys(this.resultRange);
  this.rangeFilter.unshift("All");
  this.selected2 = this.rangeFilter[0];

  this.talukData = res[3];
  this.talukActualData = res[3];
  this.dispColWSIDTaluk = ["WSID", "TALUK", "FREQUENCY", "TOTAL", "AVERAGE", "MIN COMP", "MAX COMP", "STANDARD DEVIATION"];
  this.resultTaluk = this.talukData.reduce(function(r, a) {
    r[a.COM_TALUK] = r[a.COM_TALUK] || [];
    r[a.COM_TALUK].push(a);
    return r;
}, Object.create(null));
console.log(this.resultTaluk);
this.talukFilter = Object.keys(this.resultTaluk);
  this.talukFilter.unshift("All");
  this.selected3 = this.talukFilter[0];
    });
  }

  filterData(id, arr, type){

    switch (type) {
      case "park":
        this.parkData = arr[id];
   if(id == "All"){
     this.parkData = this.parkActualData;
   }
        break;
    case "range":
      this.rangeData = arr[id];
    if(id == "All"){
      this.rangeData = this.rangeActualData;
    }
      break;

      case "taluk":
        this.talukData = arr[id];
        if(id == "All"){
          this.talukData = this.talukActualData;
        }
        break;
      case "parkByDate":
        this.parkDataByDate = arr[id];
        if(id == "All"){
          this.parkDataByDate = this.parkActualDataByDate;
        }
        break;

        case "rangeByDate":
          this.rangeDataByDate = arr[id];
          if(id == "All"){
            this.rangeDataByDate = this.rangeActualDataByDate;
          }
        break;
      case "talukByDate":
      this.talukDataByDate = arr[id];
     if(id == "All"){
       this.talukDataByDate = this.talukActualDataByDate;
     }
      break;
      case "catPark":
        this.catCompData = arr[id];
        break;
      case "omRange":
        this.totalCompByOMRange  = arr[id];
        if(id == "All"){
          this.totalCompByOMRange = this.totalCompActualDataByOMRange;
        }
        break;
      case "omDate":
        console.log(arr[id]);
        this.totalCompByOMDate  = arr[id];
        // if(id == "All"){
        //   this.totalCompByOMRange = this.totalCompActualDataByOMRange;
        // }
        let monthsData = this.totalCompByOMDate.reduce(function(r,a){
          r[a.MONTH] = r[a.MONTH] || [];
          r[a.MONTH].push(a);
          return r;
        }, Object.create(null));
        this.totalCompByOMDate = Object.values(monthsData);
        break;
      default:
        break;
    }
  }

  parkComp: any = [];
  dispColParkComp: any;

  talukComp: any = [];
  dispColTalukComp: any;

  rangeComp: any = [];
  dispColRangeComp: any;

  villageComp: any = [];
  dispColVillageComp: any;

  catCompByPark: any = [];
  catCompFilter: any =[];
  catCompData: any =[];
  catActualCompData: any =[];
  dispColCatComp: any;
  selected4:any;
  //dispColVillageComp: any;
  getCompFilterAll(){
    const record = this.wildService.getCompFilterAll();
    record.subscribe(res => {
      console.log(res);
      this.parkComp = res[1];
      this.dispColParkComp = ["PARK", "FREQUENCY", "TOTAL", "AVERAGE", "COMP MAX", "COMP MIN", "STANDARD DEVIATION"];

      this.talukComp = res[2];
      this.dispColTalukComp = ["TALUK", "FREQUENCY", "TOTAL", "AVERAGE", "COMP MAX", "COMP MIN", "STANDARD DEVIATION"];

      this.rangeComp = res[3];
       this.rangeComp.forEach(element => {
         element.COM_OM_RANGE =
       element.COM_OM_RANGE.charAt(0).toUpperCase() + element.COM_OM_RANGE.slice(1);
      });
      this.dispColRangeComp = ["RANGE", "FREQUENCY", "TOTAL", "AVERAGE", "COMP MAX", "COMP MIN", "STANDARD DEVIATION"];

      this.villageComp = res[4];
      this.dispColVillageComp = ["VILLAGE", "FREQUENCY", "TOTAL", "AVERAGE", "COMP MAX", "COMP MIN", "STANDARD DEVIATION"];

      this.catCompData = res[5];
      this.catActualCompData = this.catCompData;
      this.catCompByPark = this.catCompData.reduce(function(r, a) {
        r[a.COM_PARK] = r[a.COM_PARK] || [];
        r[a.COM_PARK].push(a);
        return r;
    }, Object.create(null));
    this.catCompFilter = Object.keys(this.catCompByPark);
    this.catCompData = this.catCompByPark[this.catCompFilter[0]];
    this.selected4 = this.catCompFilter[0];
    this.dispColCatComp = ['CATEGORY', 'FREQUENCY', 'TOTAL','AVERAGE','COMP MAX', 'COMP MIN', 'STANDARD DEVIATION']
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
    this.getCompByWSIDByDate();
    this.getTotalCompByDate();
    this.getCompensationByWSIDByDate();
  }

  totalCompByOMDate: any = [];
  dispColOMDate : any;
  resCompOMDate: any = [];
  totalCompFilterByOMDate: any =[];
  selectedOMDate:any;
  totalCompActualDataByOMDate: any = [];

  totalCompByOMRange: any = [];
  dispColOMRange: any;
   totalCompFilterByOMRange: any =[];
   selectedOMRange:any;
   resultCompByOMRange: any = [];
  // talukDataByDate: any = [];
   totalCompActualDataByOMRange: any = [];
  getCompByOMSheet(){
    let record = this.wildService.getCompByOMSheetDate();
    record.subscribe(res => {

      this.totalCompByOMDate = res[0];
      console.log(this.totalCompByOMDate);
      this.totalCompByOMDate.forEach(data => {
        data.COM_OM_SHEET_UPLOADED = (data.COM_OM_SHEET_UPLOADED=== null) ? null : data.COM_OM_SHEET_UPLOADED.slice(0,10)
      });
      this.totalCompActualDataByOMDate = this.totalCompByOMDate;
      this.resCompOMDate = this.totalCompByOMDate.reduce(function(r, a) {
        r[a.YEAR] = r[a.YEAR] || [];
        r[a.YEAR].push(a);
        return r;
    }, Object.create(null));
    console.log(this.resCompOMDate);
    this.totalCompFilterByOMDate = Object.keys(this.resCompOMDate);
   // this.totalCompFilterByOMRange.unshift("All");
    this.selectedOMDate = this.totalCompFilterByOMDate[this.totalCompFilterByOMDate.length-1];
    this.totalCompByOMDate = this.resCompOMDate[this.selectedOMDate];
    let monthsData = this.totalCompByOMDate.reduce(function(r,a){
      r[a.MONTH] = r[a.MONTH] || [];
      r[a.MONTH].push(a);
      return r;
    }, Object.create(null));
    this.totalCompByOMDate = Object.values(monthsData);
      this.dispColOMDate = ['OM SHEET NUMBER', 'SHEET FREQUENCY', 'OM SHEET DATE', 'OM TOTAL CASES', 'OM WS CASES'];


      this.totalCompByOMRange = res[1];
      this.totalCompByOMRange.forEach(data => {
        data.COM_OM_SHEET_UPLOADED = (data.COM_OM_SHEET_UPLOADED=== null) ? null : data.COM_OM_SHEET_UPLOADED.slice(0,10)
      });
      this.totalCompActualDataByOMRange = this.totalCompByOMRange;
      this.resultCompByOMRange = this.totalCompByOMRange.reduce(function(r, a) {
        r[a.COM_OM_RANGE] = r[a.COM_OM_RANGE] || [];
        r[a.COM_OM_RANGE].push(a);
        return r;
    }, Object.create(null));
    this.totalCompFilterByOMRange = Object.keys(this.resultCompByOMRange);
    this.totalCompFilterByOMRange.unshift("All");
    this.selectedOMRange = this.totalCompFilterByOMRange[0];
    //console.log(result);
      this.dispColOMRange = ['RANGE', 'OM SHEET NUMBER', 'SHEET FREQUENCY', 'OM SHEET DATE', 'OM TOTAL CASES', 'OM WS CASES'];
    });
  }

  compByWSID: any = [];
  getCompByWSIDByDate(){
    let record = this.wildService.getCompensationByWSIDByDate(this.fromDate.formatted, this.toDate.formatted);
    record.subscribe(res => {
      console.log(res);
        this.compByWSID = res.data;
    });
  }

  compByWSIdByCatData: any = [];
//  compHeaderByWSIDByCat: any = [];
  getCompByWSIDByCat(){
    let result = this.wildService.getCompWSIDByCat();
    result.subscribe(res => {
   //   console.log(res);
      this.compByWSIdByCatData = JSON.parse(res.data);

    });
  }


  totalComp: any = [];
  dispColComp: any;
  getTotalCompByDate(){
    let record = this.wildService.getTotalCompByDate(this.fromDate.formatted, this.toDate.formatted);
    record.subscribe(res => {
      console.log(res);
        this.totalComp = res.data[0];
        this.dispColComp = ["TOTAL", "AMOUNT", "AVERAGE", "MAX COMP", "MIN COMP", "STANDARD DEVIATION"]
    });
  }

  parkFilterByDate: any =[];
  selected1ByDate:any;
  resultParkByDate: any = [];
  parkDataByDate: any = [];
  parkActualDataByDate: any = [];
  //dispColWSIDParkByDate: any;

  rangeFilterByDate: any =[];
  selected2ByDate:any;
  resultRangeByDate: any = [];
  rangeDataByDate: any = [];
  rangeActualDataByDate: any = [];
  //dispColWSIDRangeByDate: any;

  talukFilterByDate: any =[];
  selected3ByDate:any;
  resultTalukByDate: any = [];
  talukDataByDate: any = [];
  talukActualDataByDate: any = [];
  //dispColWSIDTalukByDate: any;

  getCompensationByWSIDByDate(){
    let record = this.wildService.getCompByWSIDAllByDate(this.fromDate.formatted, this.toDate.formatted);
    record.subscribe(res => {
  this.parkDataByDate = res[1];
  this.parkActualDataByDate = res[1];
  this.resultParkByDate = this.parkDataByDate.reduce(function(r, a) {
      r[a.com_park] = r[a.com_park] || [];
      r[a.com_park].push(a);
      return r;
  }, Object.create(null));
  this.parkFilterByDate = Object.keys(this.resultParkByDate);
  this.parkFilterByDate.unshift("All");
  this.selected1ByDate = this.parkFilterByDate[0];

  this.rangeDataByDate = res[2];
  this.rangeActualDataByDate = res[2];
  this.resultRangeByDate = this.rangeDataByDate.reduce(function(r, a) {
    r[a.COM_OM_RANGE] = r[a.COM_OM_RANGE] || [];
    r[a.COM_OM_RANGE].push(a);
    return r;
}, Object.create(null));
this.rangeFilterByDate = Object.keys(this.resultRangeByDate);
  this.rangeFilterByDate.unshift("All");
  this.selected2ByDate = this.rangeFilterByDate[0];

  this.talukDataByDate = res[3];
  this.talukActualDataByDate = res[3];
  this.resultTalukByDate = this.talukDataByDate.reduce(function(r, a) {
    r[a.COM_TALUK] = r[a.COM_TALUK] || [];
    r[a.COM_TALUK].push(a);
    return r;
}, Object.create(null));
this.talukFilterByDate = Object.keys(this.resultTalukByDate);
  this.talukFilterByDate.unshift("All");
  this.selected3ByDate = this.talukFilterByDate[0];
      });
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
    this.xlsxReport(this.allCompByWSID, 'Total_Compensation_By_WSID');
    this.xlsxReport(this.parkActualData, 'Total_Compensation_By_WSID_By_Park');
    this.xlsxReport(this.talukActualData, 'Total_Compensation_By_WSID_By_Taluk');
    this.xlsxReport(this.rangeActualData, 'Total_Compensation_By_WSID_By_Range');
    this.xlsxReport(this.parkComp, 'Total_Compensation_By_Park');
    this.xlsxReport(this.talukComp, 'Total_Compensation_By_Taluk');
    this.xlsxReport(this.villageComp, 'Total_Compensation_By_Village');
    this.xlsxReport(this.rangeComp, 'Total_Compensation_Range')
    this.xlsxReport(this.totalCompByOMDate, 'Total Compensation By OM Sheet Date');
    this.xlsxReport(this.totalCompByOMRange, 'Total Compensation By OM Sheet Date By Range');

  }

  exportdatadaterang(){
    this.xlsxReport(this.dataSource2, 'Compensation_by_category('+this.fromDate.formatted+'to'+this.toDate.formatted+')');
    this.xlsxReport(this.dataSource3, 'Compensation_by_park('+this.fromDate.formatted+'to'+this.toDate.formatted+')');
    this.xlsxReport(this.dataSource4, 'Compensation_by_taluk('+this.fromDate.formatted+'to'+this.toDate.formatted+')');
    this.xlsxReport(this.dataRange, 'Compensation_by_Range('+this.fromDate.formatted+'to'+this.toDate.formatted+')');
    this.xlsxReport(this.dataSource5, 'Compensation_by_village('+this.fromDate.formatted+'to'+this.toDate.formatted+')');
    this.xlsxReport(this.dataSource6, 'Compensation_by_wsid('+this.fromDate.formatted+'to'+this.toDate.formatted+')');
    this.xlsxReport(this.dataSource7, 'Comp_by_village_by_data_range('+this.fromDate.formatted+'to'+this.toDate.formatted+')');
    this.xlsxReport(this.dataomsheet, 'Total_OM_Sheets_In_Compensation_BY_date('+this.fromDate.formatted+'to'+this.toDate.formatted+')');
     this.xlsxReport(this.allcompomsheetdata, 'ALL_Compensation_OM_Sheets_BY_date('+this.fromDate.formatted+'to'+this.toDate.formatted+')');
     this.xlsxReport(this.dataomsheetcomp, 'Total_OM_Sheets_In_Compensation_BY_date('+this.fromDate.formatted+'to'+this.toDate.formatted+')');
     this.xlsxReport(this.datares, 'Total_NO_Of_Sheets_In_Compensation_BY_date_range('+this.fromDate.formatted+'to'+this.toDate.formatted+')');
     this.xlsxReport(this.crcol, 'Om Sheet by Crop Loss by date('+this.fromDate.formatted+'to'+this.toDate.formatted+')');
     this.xlsxReport(this.crpdcol, 'Om Sheet by Crop Loss & Property Loss by date('+this.fromDate.formatted+'to'+this.toDate.formatted+')');
    this.xlsxReport(this.pdcol, 'Om Sheet by Property Loss by date('+this.fromDate.formatted+'to'+this.toDate.formatted+')');
       this.xlsxReport(this.lpcol, 'Om Sheet by Livestock Predation by date('+this.fromDate.formatted+'to'+this.toDate.formatted+')');
        this.xlsxReport(this.hicol, 'Om Sheet by Human Injury by date('+this.fromDate.formatted+'to'+this.toDate.formatted+')');
         this.xlsxReport(this.hdcol, 'Om Sheet by Human Death by date('+this.fromDate.formatted+'to'+this.toDate.formatted+')');
    this.xlsxReport(this.compByWSID, 'Compensation_By_WSID_By_Date('+this.fromDate.formatted+'to'+this.toDate.formatted+')');
    this.xlsxReport(this.totalComp, 'Total_Compensation_By_Date('+this.fromDate.formatted+'to'+this.toDate.formatted+')');
    this.xlsxReport(this.parkActualDataByDate, 'Total_Compensation_By_WSID_By_Park_By_Date('+this.fromDate.formatted+'to'+this.toDate.formatted+')');
    this.xlsxReport(this.talukActualDataByDate, 'Total_Compensation_By_WSID_By_Taluk_By_Date('+this.fromDate.formatted+'to'+this.toDate.formatted+')');
    this.xlsxReport(this.rangeActualDataByDate, 'Total_Compensation_By_WSID_By_Range_By_Date('+this.fromDate.formatted+'to'+this.toDate.formatted+')');
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

//  downloadShapeFile(){
// // (optional) set names for feature types and zipped folder
// this.options = {
//   folder: 'myshapes',
//   types: {
//       point: 'mypoints',
//       polygon: 'mypolygons',
//       line: 'mylines'
//   }
// }
// // a GeoJSON bridge for features
// shpwrite.download({
//   type: 'FeatureCollection',
//   features: [
//       {
//           type: 'Feature',
//           geometry: {
//               type: 'Point',
//               coordinates: [15.3173, 75.7139]
//           },
//           properties: {
//               name: 'Foo'
//           }
//       },
//       // {
//       //     type: 'Feature',
//       //     geometry: {
//       //         type: 'Point',
//       //         coordinates: [11.90493, 76.52373]
//       //     },
//       //     properties: {
//       //         name: 'Bar'
//       //     }
//       // }
//   ]
// }, this.options);
//  }

}
