import { Component, OnInit , ViewChild} from '@angular/core';

import { ConnectorService } from '../../services/connector.service';
import { ExcelService } from '../../services/excel.service';
import { MatTableDataSource, MatPaginator } from '@angular/material';
import {IMyDpOptions} from 'mydatepicker';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import * as GeoJSON from "geojson";
import * as tokml from "tokml";
import * as FileSaver from "file-saver";
import { from } from "rxjs";
import { groupBy, mergeMap, toArray } from "rxjs/operators";

import * as shpwrite from 'shp-write';
@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss'],
  providers: [ConnectorService]
})
export class ReportsComponent implements OnInit {

  form: FormGroup;

  public myDatePickerOptions: IMyDpOptions = {
    // other options...
    dateFormat: 'yyyy-mm-dd',
};

  fromDate: any;
  toDate: any;
  dateFlag:boolean = true;
  case:any = "DC_ Byday";
  // caseList:any= ["case1", "case2"]
  categoryType:any="Daily Count";
  caseList:any=["DC_ Byday","DC_ all", "DC_byrange"]
  categoryList:any=["Daily Count", "HWC"];
  record: any;
  dataSource: any;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  totalPost0 : any;
  totalPost1 : any;
  totalPost2 : any;
  totalPost3 : any;
  postPerPage = 6;
  pageSizeOptions = [5, 10, 20, 50, 100];

  constructor(private wildService: ConnectorService, private excelService: ExcelService, private spinnerService: Ng4LoadingSpinnerService, private fb: FormBuilder) {
    this.form = this.fb.group({
      fromDate: ['', Validators.required],
    toDate: ['', Validators.required]
    })
   }


  onSelectCategory(opt){

    this.dateFlag = true;
    this.fromDate = "";
    this.toDate = "";
    if(opt=="Daily Count"){
      ///set default case
      this.case = "DC_ Byday";
      this.caseList = ["DC_ Byday","DC_ all", "DC_byrange"]
    }else{
      ///set default case
      this.case = "HWC_allbycases";
      this.caseList = ["HWC_allbycases", "HWC_allbyday", "HWC_casesbyrange", "HWC_dayby range","HWC_spacialbyrange"]

    }
  }

  onSelectCase(opt){
    if(opt =="DC_byrange" || opt =="HWC_casesbyrange" || opt =="HWC_dayby range" || opt =="HWC_spacialbyrange"){
      this.dateFlag = false;
    }else{
      this.dateFlag = true;
      this.fromDate = "";
      this.toDate = "";
    }
      }

  // displayedCol = [
  //   'DC_METAINSTANCE_ID',
  //   'DC_DEVICE_ID',
  //   'DC_SIMCARD_ID',
  //   'DC_PHONE_NUMBER',
  //   'DC_CASE_ID',
  //   'DC_USER_NAME'
  // ];

  ngOnInit() {
    this.getHwc();
    this.getCompensation();
    this.getDailyCount();
    this.getPublicity();

  }

  dataSourceHWC: any;
  dataSourceDC: any;
  dataSourceComp: any;
  dataSourcePub: any;

  displayedColDC = [
    'DC_METAINSTANCE_ID',
    'DC_DEVICE_ID',
    'DC_SIMCARD_ID',
    'DC_FA_ID',
    'DC_CASE_ID',
    'DC_USER_NAME'
  ];

  displayedColComp = [
    "COM_METAINSTANCE_ID",
     "COM_DEVICE_ID",
     "COM_USER_NAME",
     "COM_OM_TOTAL_CASES"
    ]

    displayedColHWC = [
    'HWC_METAINSTANCE_ID',
    'HWC_METASUBMISSION_DATE',
    'HWC_FULL_NAME',
    'HWC_NEWPHONE_NUMBER',
    'HWC_PARK_NAME',
    'HWC_TALUK_NAME',
    'HWC_VILLAGE_NAME',
    'HWC_ANIMAL'
    ]

    displayedColPub = [
      'PB_DEVICE_ID',
      'PB_USER_NAME',
      'PB_V_DATE',
      'PB_PARK',
      'PB_TALUK',
      'PB_VILLAGE_1',
    ];

  getHwc(){
    let recordHwc = this.wildService.getHWC();
    recordHwc.subscribe(res => {
      // if (!res) {
      //   this.spinnerService.hide();
      //   return;
      // }
      this.totalPost0 = res.response.length;
      this.dataSourceHWC = new MatTableDataSource(res.response);
      this.dataSourceHWC.paginator = this.paginator;
    });
  }

  disColDC: any = [];

  getDailyCount(){
    let record = this.wildService.getDailyCountUsers();
    record.subscribe(res => {
      // if (!res) {
      //   this.spinnerService.hide();
      //   return;
      // }
      this.totalPost1 = res.response.length;
      this.dataSourceDC = new MatTableDataSource(res.response);
      this.dataSourceDC.paginator = this.paginator;

    });
  }

  disColComp: any = [];

  getCompensation(){
  let record = this.wildService.getCompensation_OM();
    record.subscribe(res => {
      // if (!res) {
      //   this.spinnerService.hide();
      //   return;
      // }
      this.totalPost2 = res.response.length;
      this.dataSourceComp = new MatTableDataSource(res.response);
      this.dataSourceComp.paginator = this.paginator;

    });
  }

  disColPub: any = [];

  getPublicity(){
    let record = this.wildService.getPublicity();
     record.subscribe(res => {
      // if (!res) {
      //   this.spinnerService.hide();
      //   return;
      // }
      this.totalPost3 = res.response.length;
      this.dataSourcePub = new MatTableDataSource(res.response);
      this.dataSourcePub.paginator = this.paginator;
    });
  }

  xlsxReport1(res, name) {
    console.log(res.data);
    this.excelService.exportAsExcelFile(res.data, name);
    return "success";
  }

  _arr: Array<any> = [];

  geoJsonData = []

  kmlReport() {
    var kmlData = {};
    for (let i = 0; i < this.dataSourceHWC.data.length; i++) {
      kmlData = {
        Name: this.dataSourceHWC.data[i].HWC_TALUK_NAME,
        Park: this.dataSourceHWC.data[i].HWC_PARK_NAME,
        lat: this.dataSourceHWC.data[i].HWC_LATITUDE,
        lng: this.dataSourceHWC.data[i].HWC_LONGITUDE
      };
      this.geoJsonData.push(kmlData);
    }
    //emit each data
    const source = from(this.geoJsonData);
    //group by park
    const example = source.pipe(
      groupBy(data => data.Park),
      // return each item in group as array
      mergeMap(group => group.pipe(toArray()))
    );

    const subscribe = example.subscribe(val => {
      console.log(val);
      this._arr.push({ Name: val[0].Name, Park: val[0].Park, points: [[]] }); //styles: this.newStyle(),
      let _index = this._arr.length;

      val.forEach((x, index) => {
        this._arr[_index - 1].points[0].push([x.lat, x.lng]);
      });
    });

    //  GeoJSON.defaults = { Polygon: 'points', include: ['Park'],  'extra' : { style: 'styles'}};
    this.obj = GeoJSON.parse(this._arr, {
      Polygon: "points",
      extra: { style: this.newStyle() },
      include: ["Park"]
    });
    var kmlNameDescription = tokml(this.obj, {
      name: "Name",
      description: "description"
    });
    this.saveAsKmlFile(kmlNameDescription, "HWC");
  }

  obj;

  private saveAsKmlFile(buffer: any, fileName: string): void {
    const data: Blob = new Blob([buffer]);
    FileSaver.saveAs(data, fileName + "_export.kml");
  }

  newStyle() {
    return {
      weight: 2,
      opacity: 1,
      color: this.getRandomColor()
    };
  }

  getRandomColor() {
    var color = Math.floor(0x1000000 * Math.random()).toString(16);
    return "#" + ("000000" + color).slice(-6);
  }

  options;

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

  xlsxReport(data) {
    if(data.valid){

      this.spinnerService.show();

    /// Daily Count Report
    if(this.categoryType == "Daily Count"){
      if(this.fromDate != null && this.toDate !=null && this.case == "DC_byrange"){

        // var fday = this.fromDate.getDate();
        // var fmonthIndex = this.fromDate.getMonth();
        // var fyear = this.fromDate.getFullYear();
        // var tday = this.toDate.getDate();
        // var tmonthIndex = this.toDate.getMonth();
        // var tyear = this.toDate.getFullYear();
        // this.record = this.wildService.getDcByRange(fyear+"-"+fmonthIndex+"-"+fday, tyear+"-"+tmonthIndex+"-"+tday);
        this.record = this.wildService.getDCreportbyrange(this.fromDate.formatted, this.toDate.formatted);

        this.record.subscribe(res => {
          if (!res) {
            this.spinnerService.hide();

            return;
          }
          this.spinnerService.hide();

          this.dataSource = new MatTableDataSource(res);
          this.dataSource.paginator = this.paginator;
          if(this.dataSource.data){
            this.excelService.exportReport(this.dataSource.data,  'DC_Reports');
            return 'success';
          }else{
            alert("No data to export");
          }
        });
      }else if(this.case == "DC_ Byday"){
        this.record = this.wildService.getDCreportbyday();
        this.record.subscribe(res => {
          if (!res) {
            this.spinnerService.hide();
            return;
          }
          this.spinnerService.hide();

          this.dataSource = new MatTableDataSource(res);
          this.dataSource.paginator = this.paginator;
          if(this.dataSource.data){
            this.excelService.exportReport(this.dataSource.data,  'DC_Reports');
            return 'success';
          }else{
            alert("No data to export");
          }
        });
      }
      else if(this.case == "DC_ all"){

        this.record = this.wildService.getDCreportbyMonth();
        this.record.subscribe(res => {
          if (!res) {
            this.spinnerService.hide();
            return;
          }
          this.spinnerService.hide();

          this.dataSource = new MatTableDataSource(res);
          this.dataSource.paginator = this.paginator;
          if(this.dataSource.data){
            this.excelService.exportReport(this.dataSource.data,  'DC_Reports');
            return 'success';
          }else{
            alert("No data to export");
          }
        });
      }
    }else{
      ///HWC Report

      if(this.case == "HWC_allbycases"){

        this.record = this.wildService.getHWCreport_bycases();
        this.record.subscribe(res => {
          if (!res) {
            this.spinnerService.hide();
            return;
          }
          this.spinnerService.hide();

          this.dataSource = new MatTableDataSource(res);
          this.dataSource.paginator = this.paginator;
          if(this.dataSource.data){
            this.excelService.exportReport(this.dataSource.data,  'HWC_Reports');
            return 'success';
          }else{
            alert("No data to export");
          }
        });
      }else if(this.case == "HWC_allbyday"){

        this.record = this.wildService.getHWCreport_byday();
        this.record.subscribe(res => {
          if (!res) {
            this.spinnerService.hide();
            return;
          }
          this.spinnerService.hide();

          this.dataSource = new MatTableDataSource(res);
          this.dataSource.paginator = this.paginator;
          if(this.dataSource.data){
            this.excelService.exportReport(this.dataSource.data,  'HWC_Reports');
            return 'success';
          }else{
            alert("No data to export");
          }
        });
      }
      else if(this.case == "HWC_casesbyrange"){

        this.record = this.wildService.getHWCreport_bycases_range(this.fromDate.formatted, this.toDate.formatted);
        this.record.subscribe(res => {
          if (!res) {
            this.spinnerService.hide();
            return;
          }
          this.spinnerService.hide();

          this.dataSource = new MatTableDataSource(res);
          this.dataSource.paginator = this.paginator;
          if(this.dataSource.data){
            this.excelService.exportReport(this.dataSource.data,  'HWC_Reports');
            return 'success';
          }else{
            alert("No data to export");
          }
        });
      }  else if(this.case == "HWC_dayby range"){

        this.record = this.wildService.getHWCreport_byday_range(this.fromDate.formatted, this.toDate.formatted);
        this.record.subscribe(res => {
          if (!res) {
            this.spinnerService.hide();
            return;
          }
          this.spinnerService.hide();

          this.dataSource = new MatTableDataSource(res);
          this.dataSource.paginator = this.paginator;
          if(this.dataSource.data){
            this.excelService.exportReport(this.dataSource.data,  'HWC_Reports');
            return 'success';
          }else{
            alert("No data to export");
          }
        });
      } else if(this.case == "HWC_spacialbyrange"){

        this.record = this.wildService.getHWCreport_byspacial_range(this.fromDate.formatted, this.toDate.formatted);
        this.record.subscribe(res => {
          if (!res) {
            this.spinnerService.hide();
            return;
          }
          this.spinnerService.hide();

          this.dataSource = new MatTableDataSource(res);
          this.dataSource.paginator = this.paginator;
          if(this.dataSource.data){
            this.excelService.exportReportSheet5(this.dataSource.data,  'HWC_Reports');
            return 'success';
          }else{
            alert("No data to export");
          }
        });
      }
    }
    }else{

      alert("Please select Date range");

    }




  }



}
