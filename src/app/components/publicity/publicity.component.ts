import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';

import * as jsPDF from 'jspdf'
import * as html2canvas from 'html2canvas'
import * as $ from 'jquery';
//import saveAs from 'file-saver'
import { saveAs } from 'file-saver'

import { ConnectorService } from '../../services/connector.service';
import { ExcelService } from '../../services/excel.service';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { MatTableDataSource, MatPaginator } from '@angular/material';
import { Chart } from 'chart.js';
import   GeoJSON  from 'geojson';

import mapboxgl from 'mapbox-gl';
import { toDate } from '@angular/common/src/i18n/format_date';

@Component({
  selector: 'app-publicity',
  templateUrl: './publicity.component.html',
  styleUrls: ['./publicity.component.scss'],
  providers: [ConnectorService]
})
export class PublicityComponent implements OnInit {

  public myDatePickerOptions: any = {
    // other options...
    dateFormat: 'yyyy-mm-dd',
  };
  record: any;
  dataSource: any;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild('mapElement') mapElement: ElementRef;
  // @ViewChild('mapElementByDate') mapElementByDate: ElementRef;
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
   // mapboxgl.accessToken =  'pk.eyJ1IjoiYWF0cmVzaG1rIiwiYSI6ImNqcXl6NGJidzA4YzI0MnBvNnJsNzI2YWEifQ.NCLzymCBnu0mJs1WZBmuqQ';

     this.getDateRange();
    this.getTotalPublicity();
    this.getAllPublicity();
    this.getallpublicityvillagefreq();
    this.getallpublicityvillagefa();
  //  this.mapAllPubVillages();


  }

  showMainContent: boolean = false;

  buttonName: any = "Date Range"

  showHideButton() {
    if(this.showMainContent = !this.showMainContent){
      this.buttonName = "All Cases";
      this.getPublicityByRange();

      this.getpublicityvillagefreqdate();
      this.getpublicityvillagefadate();
    //  this.mapPubVillagesByDate();
    }
     else{
      this.buttonName = "By Date";
      this.getAllPublicity();
      this.getallpublicityvillagefreq();
      this.getallpublicityvillagefa();
    //  this.mapAllPubVillages();
     }

  }

  xlsxReport(data, name) {
     if( data != undefined){
       let d = new Date();
      if(data.length != 0){
        name = name+'_'+d.getDate()+'/'+(d.getMonth()+1 )+'/'+d.getFullYear();
    this.excelService.exportAsExcelFile(data, name);
    return "success";
      }
     }
  }
  exportdata(){
  this.xlsxReport(this.dataPubFa, 'All_Publicity_Villages_By_Field_Assisstant');
  this.xlsxReport(this.dataPubFreq, 'All_Publicity_Villages_By_Frequency');
  this.xlsxReport(this.dataSource1, 'Total_Publicity');
  this.xlsxReport(this.dataSource3, 'Frequency of Villages Visited By Park');
  this.xlsxReport(this.dataSource4, 'Frequency of Villages Visited By Taluk');
  this.xlsxReport(this.dataSource2, 'Frequency of Villages Visited');
  this.xlsxReport(this.dataSourceBP, 'Frequence of Villages(Bandipur)');
  this.xlsxReport(this.dataSourceNH, 'Frequence of Villages(Nagarahole)');
}

exportdatadaterang(){
  this.xlsxReport(this.data1, 'Publicity_by_Villages');
  this.xlsxReport(this.data2, 'Publicity_by_Villages');
  this.xlsxReport(this.data3, 'Publicity_by_Villages');
  this.xlsxReport(this.dataPubFreqByDate, 'All_Publicity_Villages_By_Frequency');
  this.xlsxReport(this.dataPubFaByDate, 'All_Publicity_Villages_By_FA_Date');

}





   downloadImage(data, myImage) {
  /* save as image */
  var link = document.createElement('a');
//  link.href = this.bar.toBase64Image();
  link.href = data.toBase64Image();
  link.download = myImage +'.png';
  link.click();
  }

  dataSource1: any;
  dataSource2: any;
  dataSource3: any;
  dataSource4: any;
  dataPubFreq: any[]= [];



  pubfreqchart;
  pubfreqdatechart;
  pubfadatechart;

  tableType1 = 'Village';

  displayedCol1: any = [];
  displayedCol2: any = [];
  displayedCol3: any = [];
  displayedCol4: any = [];

  getTotalPublicity(){
    this.record = this.wildService.getPublicityTotal();
    this.record.subscribe(res => {
      this.dataSource1 = res;
      //
      this.displayedCol1 = ['Total Villages'];
    });
  }

  //Publicity Village frequency by date
 // dataPubFreqByDate: any[];
 dataPubFreqByDate: any;

  getpublicityvillagefreqdate(){
    if (this.fromDate !== undefined && this.toDate !== undefined) {
      let record = this.wildService.getpublicityvillagefreqbydate(this.fromDate.formatted, this.toDate.formatted);
  record.subscribe(res =>
  {

 Chart.Legend.prototype.afterFit = function() {
  this.height = this.height + 40;
};
 //this.dataPubFreq = JSON.parse(res.data);
 this.dataPubFreqByDate = res;

 if(this.pubfreqdatechart !== undefined){
  this.pubfreqdatechart.destroy();
}
//  this.dataAnimal = res[1];
     // var canvas = $('#wsidin').get(0) as HTMLCanvasElement;
    //
      this.pubfreqdatechart = new Chart('pubfreqdate', {
        type: "bar",
        data: {
          labels: [],
          datasets: [
            {
              backgroundColor: "#FFBF00",
              label: "frequency",
              data: []
            }
          ]
        },
        options: {
          title: {
            text: "Frequency (over time) of villages visited in date range[" + this.fromDate.formatted + " to " + this.toDate.formatted + "]",
            display: true
          },
          legend: {
          display: false
          },
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            xAxes: [
              {
                gridLines: {
                display: false
              },
              ticks: {
                autoSkip: false
              }
            }
            ],
            yAxes: [
              {
                ticks: {
                  beginAtZero: true
                }
              }
            ]
          },
           plugins: {
              datalabels: {
                anchor: 'end',
                align: 'top',
                formatter: Math.round,
                font: {
                  weight: 'bold'
                }
              }
            }
        }
      });

      this.dataPubFreqByDate.forEach(element => {
        element.Village =
        element.Village.charAt(0).toUpperCase() + element.Village.slice(1);
        this.pubfreqdatechart.data.labels.push(element.Village);
        this.pubfreqdatechart.data.datasets[0].data.push(element.Visits);
      });
      //
      //
      this.pubfreqdatechart.update();

  });
//

    }
  }

  //Publicity Villages Fa By date
dataPubFaByDate: any[];
  getpublicityvillagefadate(){
    if (this.fromDate !== undefined && this.toDate !== undefined) {
      let record = this.wildService.getpublicityvillagefabydate(this.fromDate.formatted, this.toDate.formatted);
  record.subscribe(res =>
  {

 Chart.Legend.prototype.afterFit = function() {
  this.height = this.height + 40;
};
 //this.dataPubFreq = JSON.parse(res.data);
 this.dataPubFaByDate = res;


 if(this.pubfadatechart !== undefined){
  this.pubfadatechart.destroy();
}
//  this.dataAnimal = res[1];
     // var canvas = $('#wsidin').get(0) as HTMLCanvasElement;
    //
      this.pubfadatechart = new Chart('pubfabydatechart', {
        type: "bar",
        data: {
          labels: [],
          datasets: [
            {
              backgroundColor: "#011627",
              label: "frequency",
              data: []
            }
          ]
        },
        options: {
          title: {
            text: "Number of villages visited by each Field Assistant in date range[" + this.fromDate.formatted + " to " + this.toDate.formatted + "]",
            display: true
          },
          legend: {
          display: false
          },
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            xAxes: [
              {
                gridLines: {
                display: false
              },
              ticks: {
                autoSkip: false
              }
            }
            ],
            yAxes: [
              {
                ticks: {
                  beginAtZero: true
                }
              }
            ]
          },
           plugins: {
              datalabels: {
                anchor: 'end',
                align: 'top',
                formatter: Math.round,
                font: {
                  weight: 'bold'
                }
              }
            }
        }
      });

      this.dataPubFaByDate.forEach(element => {
        element.FA =
        element.FA.charAt(0).toUpperCase() + element.FA.slice(1);
        this.pubfadatechart.data.labels.push(element.FA);
        this.pubfadatechart.data.datasets[0].data.push(element.Visited_to_villages);
      });
      this.pubfadatechart.update();

  });
//

    }
  }

  // publicity villages by frequency

private getallpublicityvillagefreq(){
  let record = this.wildService.getpublicityvillagefreq();
  record.subscribe(res =>
  {

 //this.dataPubFreq = JSON.parse(res.data);
 this.dataPubFreq = res.slice(0,30);



Chart.Legend.prototype.afterFit = function() {
  this.height = this.height + 40;
};
     // var canvas = $('#wsidin').get(0) as HTMLCanvasElement;
    //
      this.pubfreqchart = new Chart('pubvill', {
        type: "bar",
        data: {
          labels: [],
          datasets: [
            {
              backgroundColor: "#ffbf00",
              label: "frequency",
              data: []
            }
          ]
        },
        options: {
          title: {
            text: "All Publicity Villages By Frequency",
            display: true
          },
          legend: {
          display: false
          },
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            xAxes: [
              {
                gridLines: {
                display: false
              },
              ticks: {
                autoSkip: false
              }
            }
            ],
            yAxes: [
              {
                ticks: {
                  beginAtZero: true
                }
              }
            ]
          },
           plugins: {
              datalabels: {
                anchor: 'end',
                align: 'top',
                formatter: Math.round,
                font: {
                  weight: 'bold'
                }
              }
            }
        }
      });

      this.dataPubFreq.forEach(element => {
         element.Village =
         element.Village.charAt(0).toUpperCase() + element.Village.slice(1);
        this.pubfreqchart.data.labels.push(element.Village);
        this.pubfreqchart.data.datasets[0].data.push(element.Visits);
      });

      this.pubfreqchart.update();

  });
//
}

// Publicity villages By Field Assistant
dataPubFa : any[] =[];
pubfachart;

private getallpublicityvillagefa(){
  let record = this.wildService.getpublicityvillagefa();
  record.subscribe(res =>
  {

 //this.dataPubFreq = JSON.parse(res.data);
 this.dataPubFa = res;

console.log(res);
//
//  this.dataAnimal = res[1];
Chart.Legend.prototype.afterFit = function() {
  this.height = this.height + 40;
};
     // var canvas = $('#wsidin').get(0) as HTMLCanvasElement;
    //
      this.pubfachart = new Chart('pubfa', {
        type: "bar",
        data: {
          labels: [],
          datasets: [
            {
              backgroundColor: "#dc7633",
              label: "frequency",
              data: []
            }
          ]
        },
        options: {
          title: {
            text: "Number of villages visited by each Field Assistant since start",
            display: true
          },
          legend: {
          display: false
          },
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            xAxes: [
              {
                gridLines: {
                display: false
              },
              ticks: {
                autoSkip: false
              }
            }
            ],
            yAxes: [
              {
                ticks: {
                  beginAtZero: true
                }
              }
            ]
          },
           plugins: {
              datalabels: {
                anchor: 'end',
                align: 'top',
                formatter: Math.round,
                font: {
                  weight: 'bold'
                }
              }
            }
        }
      });

      this.dataPubFa.forEach(element => {
         element.FA =
         element.FA.charAt(0).toUpperCase() + element.FA.slice(1);
        this.pubfachart.data.labels.push(element.FA);
        this.pubfachart.data.datasets[0].data.push(element.Visited_to_villages);
      });
      //
      //
      this.pubfachart.update();

  });
//
}

length2: any;
length3: any;
length4: any;

dataSourceBP: any = [];
dataSourceNH: any = [];
displayedColBP: any= [];
displayedColNH: any = [];

  getAllPublicity(){
    this.record = this.wildService.getPublicityAll();
    this.record.subscribe(res => {
      console.log(res);
      res[0].forEach(element => {
        if(element.VILLAGE_NAME !== null)
        element.VILLAGE_NAME =
        element.VILLAGE_NAME.charAt(0).toUpperCase() + element.VILLAGE_NAME.slice(1);
      });
      res[0].sort((a,b) => b.VILLAGE_FREQ - a.VILLAGE_FREQ);
      this.dataSource2 = res[0];
     this.length2 = this.dataSource2.length;
      this.displayedCol2 = ['Village Name', 'Frequency'];

      res[1].forEach(element => {
        if(element.PARK !== null)
        element.PARK =
        element.PARK.charAt(0).toUpperCase() + element.PARK.slice(1);
      });
      res[1].sort((a,b) => b.PARK_FREQ - a.PARK_FREQ);
      this.dataSource3 = res[1];
      this.length3 = this.dataSource3.length;
      this.displayedCol3 = ['Park Name', 'Frequency'];

      let result = res[2].reduce(function (r, a) {
            r[a.PARK] = r[a.PARK] || [];
            r[a.PARK].push(a);
            return r;
        }, Object.create(null));
        console.log(result);

        this.dataSourceBP = result.bandipur;
        this.dataSourceBP.forEach(element => {
          if(element.PB_C_VILLAGE !== null)
          element.PB_C_VILLAGE =
          element.PB_C_VILLAGE.charAt(0).toUpperCase() + element.PB_C_VILLAGE.slice(1);
        });
        this.dataSourceBP.sort((a,b) => b.PARK_FREQ - a.PARK_FREQ);
        this.displayedColBP = ['Village', 'Frequency'];
        this.dataSourceNH = result.nagarahole;
        this.dataSourceNH.forEach(element => {
          if(element.PB_C_VILLAGE !== null)
          element.PB_C_VILLAGE =
          element.PB_C_VILLAGE.charAt(0).toUpperCase() + element.PB_C_VILLAGE.slice(1);
        });
        this.dataSourceNH.sort((a,b) => b.PARK_FREQ - a.PARK_FREQ);


      res[3].forEach(element => {
        if(element.TALUK !== null)
        element.TALUK =
        element.TALUK.charAt(0).toUpperCase() + element.TALUK.slice(1);
      });
      res[3].sort((a,b) => b.TALUK_FREQ - a.TALUK_FREQ);
      this.dataSource4 = res[3];
      this.length4 = this.dataSource4.length;
      this.displayedCol4 = ['Taluk', 'Frequency'];
    });
  }

  fromDate: { date?: { year: number; month: number; day: number; }; formatted: any; };
  toDate: { date?: { year: number; month: number; day: number; }; formatted: any; };

  getDateRange(){
    var d: Date = new Date();
  //
        this.toDate = {date: {year: d.getFullYear(),
                             month: d.getMonth() + 1,
                             day: d.getDate()},
                            formatted: d.getFullYear()+"-"+('0' + (d.getMonth() + 1)).slice(-2)+"-"+('0' + (d.getDate())).slice(-2)};
        this.fromDate = {date: {year: d.getFullYear(),
                              month: d.getMonth()+1 -2,
                              day: d.getDate()},
                            formatted: d.getFullYear()+"-"+('0' + (d.getMonth()+1 -2 )).slice(-2)+"-"+('0' + (d.getDate())).slice(-2)};

                            if(this.fromDate.date.month === -1 || this.fromDate.date.month === 0){
                              this.fromDate = {date: {year: d.getFullYear()-1,
                                month: d.getMonth() + 11  ,
                                day: d.getDate()},
                              formatted: d.getFullYear()-1+"-"+('0' + (d.getMonth() + 11)).slice(-2)+"-"+('0' + (d.getDate())).slice(-2)};
                             }


                          }

  onSubmit(fDate, tDate){
    this.fromDate=fDate;
    this.toDate=tDate;
    this.getPublicityByRange();
    this.getpublicityvillagefreqdate();
    this.getpublicityvillagefadate();
   // this.mapPubVillagesByDate();
  }

  barChart1: any ;
  barChart2: any ;
  barChart3: any ;
  data1: any;
  data2:any;
  data3:any;

  getPublicityByRange(){
    if (this.fromDate !== undefined && this.toDate !== undefined) {
    this.record = this.wildService.getPublicityByDate(this.fromDate.formatted, this.toDate.formatted);
    this.record.subscribe(res => {

      let data = res;
      this.data1 = res[0];
      this.data2 = res[1];
      this.data3 = res[2];
     // let data4 = res[3];

   //
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



      if(this.barChart1 !== undefined){
        this.barChart1.destroy();
      }

      Chart.Legend.prototype.afterFit = function() {
        this.height = this.height + 40;
      };

      this.barChart1 = new Chart('village', {
        type: 'bar',
        data: {
          labels: [],
          datasets: [
            {
              data: [],
            //borderColor: "purple",
            backgroundColor: "#FFBF00",
              label: 'Village Freq',
              borderWidth:1,
              "fill" : false
            }
          ]
        },
        options: {
          responsive: true, maintainAspectRatio: false,
          title: {
            text: "Frequency of Villages Visited[" + this.fromDate.formatted + " to " + this.toDate.formatted + "]",
            display: true
          },
          legend : {
           display: false,
           },
         scales: {
          xAxes: [
            {
              gridLines: {
              display: false
            },
            ticks: {
              autoSkip: false
            }
          }
          ],
          yAxes: [
            {
              ticks: {
                beginAtZero: true,
                stepSize: 1
              }
            }
          ]
        },
      plugins: {
        datalabels: {
          anchor: 'end',
          align: 'top',
          formatter: Math.round,
          font: {
            weight: 'bold'
          }
        }
      }
        }
      });
      villageFreq.forEach(element => {
        element.VILLAGE_NAME =
        element.VILLAGE_NAME.charAt(0).toUpperCase() + element.VILLAGE_NAME.slice(1);
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


      if(this.barChart2 !== undefined){
        this.barChart2.destroy();
      }
      this.barChart2 = new Chart('park', {
        type: 'bar',
        data: {
          labels: [],
          datasets: [
            {
              data: [],
              backgroundColor: "#ffbf00",
              label: 'Park Freq',
              borderWidth: 1
            }
          ]
        },
        options: {
          responsive: true, maintainAspectRatio: false,
          title: {
            text: "Frequency of Villages Visited By Park[" + this.fromDate.formatted + " to " + this.toDate.formatted + "]",
            display: true
          },
          legend : {
           display: false,

          //  position: "right",

         },
         scales: {
          xAxes: [
            {
              gridLines: {
              display: false
            },
            ticks: {
              autoSkip: false
            }
          }
          ],
          yAxes: [
            {
              ticks: {
                beginAtZero: true
              }
            }
          ]
        },
      plugins: {
        datalabels: {
          anchor: 'end',
          align: 'top',
          formatter: Math.round,
          font: {
            weight: 'bold'
          }
        }
      }
        }
      });

      parkFreq.forEach(element => {
        element.PARK =
        element.PARK.charAt(0).toUpperCase() + element.PARK.slice(1);
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


if(this.barChart3 !== undefined){
  this.barChart3.destroy();
}
      this.barChart3 = new Chart('taluk', {
        type: 'bar',
        data: {
          labels: [],
          datasets: [
            {
              data: [],
              label: 'Taluk Freq',
              backgroundColor:'#2ec4b6',
              borderWidth:1
            }
          ]
        },
        options: {
          responsive: true, maintainAspectRatio: false,
          title: {
            text: "Frequency of Villages Visited By Taluk[" + this.fromDate.formatted + " to " + this.toDate.formatted + "]",
            display: true
          },
          legend : {
           display: false,

          //  position: "right",

         },
         scales: {
          xAxes: [
            {
              gridLines: {
              display: false
            },
            ticks: {
              autoSkip: false
            }
          }
          ],
          yAxes: [
            {
              ticks: {
                beginAtZero: true
              }
            }
          ]
        },
      plugins: {
        datalabels: {
          anchor: 'end',
          align: 'top',
          formatter: Math.round,
          font: {
            weight: 'bold'
          }
        }
      }
        }
      });

      talukFreq.forEach(element => {
        element.TALUK =
        element.TALUK.charAt(0).toUpperCase() + element.TALUK.slice(1);
         if (element.TALUK === "Hdkote")
        {
         element.TALUK = this.change();
      //   var str1 = "Hdkote";
      //   var newStr = [str1.slice(0, 2), str1.slice(2)].join(' ');
      //
      //   element.TALUK = newStr;
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
        this.barChart3.data.labels.push(element.TALUK);
        this.barChart3.data.datasets[0].data.push(element.TALUK_FREQ);
        });
        this.barChart3.update();

        Chart.pluginService.register({
          afterDraw: function (chart) {
                          if (chart.data.datasets[0].data.length === 0) {
                              // No data is present
                              var ctx = chart.chart.ctx;
                              var width = chart.chart.width;
                              var height = chart.chart.height
                              chart.clear();

                              ctx.save();
                              ctx.textAlign = 'center';
                              ctx.textBaseline = 'middle';
                              ctx.font = "20px normal 'Helvetica Nueue'";
                              ctx.fillText('No Data to display', width / 2, height / 2);
                              ctx.restore();
                          }

                      }
          });


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

// map:any;


//




}
