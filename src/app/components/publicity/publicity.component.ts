import { Component, OnInit, ViewChild } from '@angular/core';

import { ConnectorService } from '../../services/connector.service';
import { ExcelService } from '../../services/excel.service';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { MatTableDataSource, MatPaginator } from '@angular/material';
import { Chart } from 'chart.js';
@Component({
  selector: 'app-publicity',
  templateUrl: './publicity.component.html',
  styleUrls: ['./publicity.component.scss'],
  providers: [ConnectorService]
})
export class PublicityComponent implements OnInit {


  record: any;
  dataSource: any;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  totalPost = 10;
  postPerPage = 10;
  pageSizeOptions = [5, 10, 20, 50, 100];

  constructor(private wildService: ConnectorService, private excelService: ExcelService, private spinnerService: Ng4LoadingSpinnerService) { }

  displayedCol = [
    'PB_DEVICE_ID',
    'PB_USER_NAME',
    'PB_V_DATE',
    'PB_PARK',
    'PB_TALUK',
    'PB_VILLAGE_1',
  ];

  ngOnInit() {
    this.spinnerService.show();
    this.record = this.wildService.getPublicity();
    this.getTotalPublicity();
    this.getAllPublicity();
    this.getDateRange();
    this.getPublicityByRange();
    this.record.subscribe(res => {
      if (!res) {
        this.spinnerService.hide();
        return;
      }
      this.dataSource = new MatTableDataSource(res.response);
      this.dataSource.paginator = this.paginator;
    });
    this.spinnerService.hide();
  }

  xlsxReport() {
    this.excelService.exportAsExcelFile(this.dataSource.data,  'Publicity');
    return 'success';
  }

  dataSource1: any;
  dataSource2: any;
  dataSource3: any;
  dataSource4: any;

  tableType1 = 'Village';

  displayedCol1: any = [];
  displayedCol2: any = [];
  displayedCol3: any = [];
  displayedCol4: any = [];

  getTotalPublicity(){
    this.record = this.wildService.getPublicityTotal();
    this.record.subscribe(res => {
      this.dataSource1 = res;
      //console.log(this.dataSource1);
      this.displayedCol1 = ['Total Villages'];
    });
  }

  getAllPublicity(){
    this.record = this.wildService.getPublicityAll();
    this.record.subscribe(res => {
      this.dataSource2 = res[0];
     // console.log(this.dataSource2);
      this.displayedCol2 = ['Village Name', 'Frequency'];

      this.dataSource3 = res[1];
      this.displayedCol3 = ['Park Name', 'Frequency'];

      this.dataSource4 = res[2];
      this.displayedCol4 = ['Taluk', 'Frequency'];
    });
  }

  fromDate: any;
  toDate: any;

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
                            formatted: d.getFullYear()+"-"+('0' + (d.getMonth() - 5)).slice(-2)+"-"+('0' + (d.getDate())).slice(-2)};
  }

  onSubmit(data){
    this.fromDate=data[0];
    this.toDate=data[1];
    this.getPublicityByRange();
  }

  barChart1: any = [];
  barChart2: any = [];
  barChart3: any = [];

  getPublicityByRange(){
    this.record = this.wildService.getPublicityByDate(this.fromDate.formatted, this.toDate.formatted);
    this.record.subscribe(res => {
      let data = res;
      let villageFreq: any = [];
      let talukFreq: any = [];
      let parkFreq: any = [];

      let villageArr: any = [];
      let talukArr: any = [];
      let parkArr: any = [];

      villageFreq = data[0].reduce(function(res, obj) {
        if (!(obj.VILLAGE_NAME in res)){
            res.__array.push(res[obj.VILLAGE_NAME] = obj);
            res}
        else {
            res[obj.VILLAGE_NAME].VILLAGE_FREQ += obj.VILLAGE_FREQ;
            // res[obj.category].bytes += obj.bytes;
        }
        return res;
    }, {__array:[]}).__array
                    .sort(function(a,b) { return b.bytes - a.bytes; });


      console.log(villageFreq);
      this.barChart1 = new Chart('village', {
        type: 'bar',
        data: {
          labels: [],
          datasets: [
            {
              data: [],
            borderColor: "purple",
            backgroundColor: "orange",
              label: 'Village Freq',
              borderWidth:2,
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

         },
         scales: {
          yAxes: [{
              ticks: {
                  beginAtZero: true
              }
          }],
          xAxes:[{
          ticks:{
          autoSkip: false,
        }
        }]
      }
        }
      });
      villageFreq.forEach(element => {

        this.barChart1.data.labels.push(element.VILLAGE_NAME);
        this.barChart1.data.datasets[0].data.push(element.VILLAGE_FREQ);
        });
        this.barChart1.update();


  // Park

        parkFreq = data[1].reduce(function(res, obj) {
          if (!(obj.PARK in res)){
              res.__array.push(res[obj.PARK] = obj);
              res}
          else {
              res[obj.PARK].PARK_FREQ += obj.PARK_FREQ;
              // res[obj.category].bytes += obj.bytes;
          }
          return res;
      }, {__array:[]}).__array
                      .sort(function(a,b) { return b.bytes - a.bytes; });

      console.log(parkFreq);

      this.barChart2 = new Chart('park', {
        type: 'bar',
        data: {
          labels: [],
          datasets: [
            {
              data: [],
              borderColor: 'rgb(247, 45, 45)',
              backgroundColor: 'rgb(200, 243, 113)',
              label: 'Park Freq',
              borderWidth: 2
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

         },
         scales: {
          yAxes: [{
              ticks: {
                  beginAtZero: true
              }
          }],
          xAxes:[{
            ticks:{
            autoSkip: false,
          }
          }]
      }
        }
      });

      parkFreq.forEach(element => {

        this.barChart2.data.labels.push(element.PARK);
        this.barChart2.data.datasets[0].data.push(element.PARK_FREQ);
        });
        this.barChart2.update();

  // Taluk

  talukFreq = data[2].reduce(function(res, obj) {
    if (!(obj.TALUK in res)){
        res.__array.push(res[obj.TALUK] = obj);
        res}
    else {
        res[obj.TALUK].TALUK_FREQ += obj.TALUK_FREQ;
        // res[obj.category].bytes += obj.bytes;
    }
    return res;
}, {__array:[]}).__array
                .sort(function(a,b) { return b.bytes - a.bytes; });

console.log(talukFreq);

      this.barChart3 = new Chart('taluk', {
        type: 'bar',
        data: {
          labels: [],
          datasets: [
            {
              data: [],
              borderColor: 'chocolate',
              label: 'Taluk Freq',
              backgroundColor:' rgb(247, 217, 162)',
              borderWidth:2
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

         },
         scales: {
          yAxes: [{
              ticks: {
                  beginAtZero: true
              }
          }],
          xAxes:[{
            ticks:{
            autoSkip: false,
          }
          }]
      }
        }
      });

      talukFreq.forEach(element => {
        this.barChart3.data.labels.push(element.TALUK);
        this.barChart3.data.datasets[0].data.push(element.TALUK_FREQ);
        });
        this.barChart3.update();

    });
  }

}
