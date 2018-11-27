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
                              month: d.getMonth() ,
                              day: d.getDate()},
                            formatted: d.getFullYear()+"-"+('0' + (d.getMonth())).slice(-2)+"-"+('0' + (d.getDate())).slice(-2)};
  }

  onSubmit(data){
    this.fromDate=data[0];
    this.toDate=data[1];
    this.getTotalDailyCountByDate();
  }

  lineChart: any = [];
  barChart: any = [];
  result: any;
  getTotalDailyCountByDate() {
    if (this.fromDate !== undefined && this.toDate !== undefined) {
    this.record = this.wildService.getTotalDCByDate(this.fromDate.formatted, this.toDate.formatted);
    this.record.subscribe(res => {
      //console.log(res);
      let data = res;
      let dateArr1: Array<string> = [];
      let dateArr2: Array<string> = [];
      let dataArr1: any = [];
      let crop: any ;
      let cropProperty: any ;
      let humanDeath: any ;
      let humanInjury: any;
      let liveStock: any;
      let property: any ;
      let total: any;


      data[0].forEach(element => {
        if (element.CASE_DATE !==undefined && element.DC_TOTAL_CASES !== undefined){
        dateArr1.push(element.CASE_DATE);
        dataArr1.push(element.DC_TOTAL_CASES);
      }
      });

//       var months = ['January', 'Febuary', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
//       console.log(dateArr1[0]);
//       var date = dateArr1[0];
// var newdate = date.split("-").reverse().join("-");
//        console.log(newdate);
//       // console.log(dataArr1);
//    var newD = new Date(newdate);
//     console.log(months[newD.getMonth()]);
      this.lineChart = new Chart('canvas', {
        type: 'line',
        data: {
          labels: dateArr1.reverse(),
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
          responsive: true, maintainAspectRatio: false,
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


    console.log(data[1]);
    total = 0;
    crop = 0;
    cropProperty = 0;
    humanDeath = 0;
    humanInjury = 0;
    liveStock = 0;
    property = 0;

    this.result = data[1];

    for (let i = 0; i < this.result.length; i++) {  //loop through the array
      total += Number(this.result[i].TOTAL);
      crop += Number(this.result[i].CROP);
      property += Number(this.result[i].PROPERTY);
      cropProperty += Number(this.result[i].CROP_PROPERTY);
      liveStock += Number(this.result[i].LIVESTOCK);
      humanInjury += Number(this.result[i].HUMAN_INJURY);
      humanDeath += Number(this.result[i].HUMAN_DEATH);
  }
//    console.log(this.result);



    // data[1].forEach(element => {
    //   if(element.CASE_DATE !== undefined){
    //     dateArr2.push(element.CASE_DATE);
    //     crop.push(element.CROP);
    //     cropProperty.push(element.CROP_PROPERTY);
    //     humanDeath.push(element.HUMAN_DEATH);
    //     humanInjury.push(element.HUMAN_INJURY);
    //     liveStock.push(element.LIVESTOCK);
    //     property.push(element.PROPERTY);
    //     total.push(element.TOTAL);
    //   }
    // });

    // console.log(dateArr2);
    // console.log(crop);
    this.barChart = new Chart('can', {
      type: 'bar',
      data: {
        labels: ['TOTAL', 'CROP', 'PROPERTY', 'CROP PROPERTY', 'LIVESTOCK', 'HUMAN INJURY', 'HUMAN DEATH'],
        datasets: [
          {
            data: [total, crop, property, cropProperty, liveStock, humanInjury, humanDeath],
            borderColor: 'black',
            label: 'Record',
            backgroundColor: 'chocolate',
            borderWidth: 2,
          }

        ]
      },
      options: {
        responsive: true, maintainAspectRatio: false,
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
