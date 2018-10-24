import { Component, OnInit , ViewChild} from '@angular/core';

import { ConnectorService } from '../../services/connector.service';
import { ExcelService } from '../../services/excel.service';

import { MatTableDataSource, MatPaginator } from '@angular/material';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import * as GeoJSON from 'geojson';
import * as tokml from 'tokml';
import * as FileSaver from 'file-saver';

import { Chart } from 'chart.js';

// var GeoJSON = require('geojson');
// var tokml =  require('tokml');

@Component({
  selector: 'app-daily-count',
  templateUrl: './daily-count.component.html',
  styleUrls: ['./daily-count.component.scss'],
  providers: [ConnectorService]
})
export class DailyCountComponent implements OnInit {

   geoJsonData = [
    { name: 'Location A', category: 'Store', street: 'Market', lat: 39.984, lng: -75.343 },
    { name: 'Location B', category: 'House', street: 'Broad', lat: 39.284, lng: -75.833 },
    { name: 'Location C', category: 'Office', street: 'South', lat: 39.123, lng: -74.534 },
    { name: 'Location D', category: 'home', street: 'East', lat: 12.9716, lng: 77.5946 }

  ];
  obj;
  record: any;
  dataSource: any;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  totalPost = 10;
  postPerPage = 10;
  pageSizeOptions = [5, 10, 20, 50, 100];
  constructor(private wildService: ConnectorService, private excelService: ExcelService, private spinnerService: Ng4LoadingSpinnerService) { }

  displayedCol = [
    'DC_METAINSTANCE_ID',
    'DC_DEVICE_ID',
    'DC_SIMCARD_ID',
    'DC_FA_ID',
    'DC_CASE_ID',
    'DC_USER_NAME'
  ];

  ngOnInit() {
  //   this.obj = GeoJSON.parse(this.geoJsonData, {Point: ['lat', 'lng']});
  //   var kmlNameDescription = tokml(this.obj, {
  //     name: 'name',
  //     description: 'description'
  // });
  // this.saveAsKmlFile(kmlNameDescription,'Sample' );
    this.spinnerService.show();
    this.getTotalDailyCount();
    this.getDateRange();
    this.getTotalDailyCountByDate();
    this.record = this.wildService.getDailyCountUsers();
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
  private saveAsKmlFile(buffer: any, fileName: string): void {
    const data: Blob = new Blob([buffer]);
    FileSaver.saveAs(data, fileName + '_export_' + new Date().getTime() + '.kml');
  }

  ConvertToCSV(objArray) {
    const array = typeof objArray !== 'object' ? JSON.parse(objArray) : objArray;
      let str = '';
    let row = '';

     // tslint:disable-next-line:forin
     for (const index in objArray[0]) {
         // Now convert each value to string and comma-separated
         row += index + ',';
     }
     row = row.slice(0, -1);
     // append Label row with line break
     str += row + '\r\n';

     for (let i = 0; i < array.length; i++) {
        let line = '';
         // tslint:disable-next-line:forin
         for (const index in array[i]) {
             // tslint:disable-next-line:curly
             if (line !== '') line += ',';

             line += array[i][index];
         }
         str += line + '\r\n';
     }
     return str;
 }

 download() {
  const csvData = this.ConvertToCSV(this.dataSource.data);
                         const a = document.createElement('a');
                          a.setAttribute('style', 'display:none;');
                          document.body.appendChild(a);
                         const blob = new Blob([csvData], { type: 'text/csv' });
                         const url = window.URL.createObjectURL(blob);
                          a.href = url;
                          a.download = 'Daily_count.csv'; /* your file name*/
                          a.click();
                          return 'success';
  }

  xlsxReport() {
    this.excelService.exportAsExcelFile(this.dataSource.data,  'DailyCount');
    return 'success';
  }

  dataSource1: any;
  dataSource2: any;
  dataSource3: any;
  dataSource4: any;

  fromDate;
  toDate;
  displayedCol1: any = [];
  displayedCol2: any = [];
  displayedCol3: any = [];
  displayedCol4: any = [];


  tableType1 = 'Park';
  tableType2 = 'each Field Assistant';

  getTotalDailyCount() {
    this.record = this.wildService.getTotalDC();
    this.record.subscribe(res => {
     // console.log(res);
      this.dataSource1 = res[0];
      this.displayedCol1 = ['TOTAL DC CASES', 'TOTAL NH CASES', 'TOTAL BP CASES'];

      this.dataSource2 = res[1];
      this.displayedCol2 = ['CROP', 'CROP PROPERTY', 'HUMAN DEATH', 'HUMAN INJURY', 'LIVESTOCK', 'PROPERTY', 'TOTAL'];

      this.dataSource3 = res[2];
      this.displayedCol3 = ['TOTAL', 'FIELD ASSISTANT'];

      this.dataSource4 = res[3];
      this.displayedCol4 = ['CROP', 'CROP PROPERTY', 'FIELD ASSISTANT', 'HUMAN DEATH', 'HUMAN INJURY', 'LIVESTOCK', 'PROPERTY', 'TOTAL']
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
                              month: d.getMonth() - 5,
                              day: d.getDate()},
                            formatted: d.getFullYear()+"-"+('0' + (d.getMonth() - 5)).slice(-2)+"-"+('0' + (d.getDate())).slice(-2)};
  }

  onSubmit(data){
    this.fromDate=data[0];
    this.toDate=data[1];
    this.getTotalDailyCountByDate();
  }

  lineChart: any = [];
  barChart: any = [];

  getTotalDailyCountByDate() {
    if (this.fromDate !== undefined && this.toDate !== undefined) {
    this.record = this.wildService.getTotalDCByDate(this.fromDate.formatted, this.toDate.formatted);
    this.record.subscribe(res => {
      //console.log(res);
      let data = res;
      let dateArr1: Array<string> = [];
      let dateArr2: Array<string> = [];
      let dataArr1: any = [];
      let crop: any = [];
      let cropProperty: any = [];
      let humanDeath: any = [];
      let humanInjury: any = [];
      let liveStock: any = [];
      let property: any = [];
      let total: any = [];

      console.log(data[1]);
      data[0].forEach(element => {
        if (element.CASE_DATE !==undefined && element.DC_TOTAL_CASES !== undefined){
        dateArr1.push(element.CASE_DATE);
        dataArr1.push(element.DC_TOTAL_CASES);
      }
      });
      // console.log(dateArr1);
      // console.log(dataArr1);

      this.lineChart = new Chart('canvas', {
        type: 'line',
        data: {
          labels: dateArr1,
          datasets: [
            {
              data: dataArr1,
              borderColor: 'brown',
              label: 'DC Total Cases',
              file: false,
              "fill" : false
            }
          ]
        },
        options: {
          legend : {
           display: true,
           labels: {
             boxWidth: 10,
           fontSize: 8
           },
           position: "right",

         }
        }
      });

    data[1].forEach(element => {
      if(element.CASE_DATE !== undefined){
        dateArr2.push(element.CASE_DATE);
        crop.push(element.CROP);
        cropProperty.push(element.CROP_PROPERTY);
        humanDeath.push(element.HUMAN_DEATH);
        humanInjury.push(element.HUMAN_INJURY);
        liveStock.push(element.LIVESTOCK);
        property.push(element.PROPERTY);
        total.push(element.TOTAL);
      }
    });

    // console.log(dateArr2);
    // console.log(crop);
    this.barChart = new Chart('can', {
      type: 'bar',
      data: {
        labels: dateArr2,
        datasets: [
          {
            data: crop,
            borderColor: 'black',
            label: 'CROP',
            backgroundColor: 'chocolate',
            borderWidth: 2,
          },
          {
            data: cropProperty,
            borderColor: 'black',
            label: 'CROP PROPERTY',
            backgroundColor: 'orange',
            borderWidth: 2,
            "fill" : false
          },
          {
            data: humanDeath,
            borderColor: 'black',
            label: 'HUMAN DEATH',
            backgroundColor: 'violet',
            borderWidth: 2,
          },
          {
            data: humanInjury,
            borderColor: 'black',
            label: 'HUMAN INJURY',
            backgroundColor: 'purple',
            borderWidth: 2,
          },
          {
            data: liveStock,
            borderColor: 'black',
            label: 'LIVE STOCK',
            backgroundColor: 'brown',
            borderWidth: 2,
          },
          {
            data: property,
            borderColor: 'black',
            label: 'PROPERTY',
            backgroundColor: 'yellow',
            borderWidth: 2,
          },
          {
            data: total,
            borderColor: 'black',
            label: 'TOTAL',
            backgroundColor: 'rgb(226, 82, 82)',
            borderWidth: 2,
          }
        ]
      },
      options: {
        legend : {
         display: true,
         labels: {
           boxWidth: 10,
         fontSize: 8
         },
         position: "right",

       }
      }
    });



    });
    }
  }

}
