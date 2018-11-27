import { Component, OnInit, ViewChild } from '@angular/core';

import { MatTableDataSource, MatPaginator } from '@angular/material';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import {IMyDpOptions} from 'mydatepicker';

import { ConnectorService } from '../../services/connector.service';
import { ExcelService } from '../../services/excel.service';

import * as shpwrite from 'shp-write';


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
    this.record = this.wildService.getCompensation_OM();
    this.record.subscribe(res => {
      if (!res) {
        this.spinnerService.hide();
        return;
      }
      this.dataSource = new MatTableDataSource(res.response);
      this.dataSource.paginator = this.paginator;
      this.spinnerService.hide();
    });
  }

  getDateRange(){
    var d: Date = new Date();
  //  console.log(d);
        this.toDate = {date: {year: d.getFullYear(),
                             month: d.getMonth() + 1,
                             day: d.getDate()},
                            formatted:d.getFullYear()+"-"+('0' + (d.getMonth() + 1)).slice(-2)+"-"+('0' + (d.getDate())).slice(-2)};
        this.fromDate = {date: {year: d.getFullYear(),
                              month: d.getMonth() ,
                              day: d.getDate()},
                            formatted: d.getFullYear()+"-"+('0' + (d.getMonth() )).slice(-2)+"-"+('0' + (d.getDate())).slice(-2)};
  }

  getTable1(){
    this.record = this.wildService.getTotalComp();
    this.record.subscribe(res => {

       this.dataSource1 = res;
      for (let key in this.dataSource1[0]){
        this.displayedCol1.push(key);

      }
    });
  }


  onSubmit(data){
    this.fromDate=data[0];
    this.toDate=data[1];
    this.block2Comp();
    this.block3Comp();

  }

  block2Comp(){
    if (this.fromDate !== undefined && this.toDate !== undefined) {
    this.record = this.wildService.getCompFilter(this.fromDate.formatted, this.toDate.formatted);
    this.record.subscribe(res => {
      console.log(res);
      this.dataSource2 = res[0];
      this.displayedCol2 = ["CATAGORY", "FREQUENCY", "TOTAL", "AVERAGE", "COMP_MAX", "COMP_MIN"];

      this.dataSource3 = res[1];
      this.displayedCol3 = ["PARK", "FREQUENCY", "TOTAL", "AVERAGE", "COMP_MAX", "COMP_MIN"];

      this.dataSource4 = res[2];
      this.displayedCol4 = ["TALUK", "FREQUENCY", "TOTAL", "AVERAGE", "COMP_MAX", "COMP_MIN"];

      this.dataSource5 = res[3];
      this.displayedCol5 = ["VILLAGE", "FREQUENCY", "TOTAL", "AVERAGE", "COMP_MAX", "COMP_MIN"];
    });
  }
  }



  block3Comp(){
    if (this.fromDate !== undefined && this.toDate !== undefined) {
    this.record = this.wildService.getTopComp(this.fromDate.formatted, this.toDate.formatted);
    this.record.subscribe(res => {
      console.log(res);
      this.dataSource6 = res[0];
      this.displayedCol6 = ["WSID", "FREQUENCY", "AVERAGE", "COMP_MAX", "COMP_MIN"];

      this.dataSource7 = res[1];
      this.displayedCol7 = ["VILLAGE", "FREQUENCY", "AVERAGE", "COMP_MAX", "COMP_MIN"];
    });
  }
  }


  xlsxReport() {
    this.excelService.exportAsExcelFile(this.dataSource.data,  'Compensation');
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
