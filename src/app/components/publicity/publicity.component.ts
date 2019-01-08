import { Component, OnInit, ViewChild } from '@angular/core';

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
    this.getDateRange();
   // this.record = this.wildService.getPublicity();
    this.getTotalPublicity();
    this.getAllPublicity();
  //  this.getPublicityByRange();
    this.getallpublicityvillagefreq();
    this.getallpublicityvillagefa();
  //  this.getpublicityvillagefreqdate();
  //  this.getpublicityvillagefadate();
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
      this.getPublicityByRange();

      this.getpublicityvillagefreqdate();
      this.getpublicityvillagefadate();
    }
     else{
      this.buttonName = "By Date";
      this.getallpublicityvillagefreq();
      this.getallpublicityvillagefa();
     }

  }

   xlsxReport(data, name) {
    this.excelService.exportAsExcelFile(data, name);
    return "success";
  }

  // xlsxReport() {
  //   this.excelService.exportAsExcelFile(this.dataSource.data,  'Publicity');
  //   return 'success';
  // }

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
      //console.log(this.dataSource1);
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
 console.log(res);
 Chart.Legend.prototype.afterFit = function() {
  this.height = this.height + 40;
};
 //this.dataPubFreq = JSON.parse(res.data);
 this.dataPubFreqByDate = res;
 console.log(this.dataPubFreqByDate);
//  this.dataAnimal = res[1];
     // var canvas = $('#wsidin').get(0) as HTMLCanvasElement;
    //  console.log(canvas)
      this.pubfreqdatechart = new Chart('pubfreqdate', {
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

      this.dataPubFreqByDate.forEach(element => {
        element.Village =
        element.Village.charAt(0).toUpperCase() + element.Village.slice(1);
        this.pubfreqdatechart.data.labels.push(element.Village);
        this.pubfreqdatechart.data.datasets[0].data.push(element.Visits);
      });
      // console.log(this.animalChart.data.labels);
      // console.log(this.animalChart.data.datasets[0].data);
      this.pubfreqdatechart.update();
//       var backgroundColor = 'white';
//    Chart.plugins.register({
//     beforeDraw: function(c) {
//         var ctx = c.chart.ctx;
//         ctx.fillStyle = backgroundColor;
//         ctx.fillRect(0, 0, c.chart.width, c.chart.height);
//     }
// });
// $('#save').click(function() {
//     canvas.toBlob(function(blob) {
//         saveAs(blob, "pretty image.png");
//     });
// });
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
 console.log(res);
 Chart.Legend.prototype.afterFit = function() {
  this.height = this.height + 40;
};
 //this.dataPubFreq = JSON.parse(res.data);
 this.dataPubFaByDate = res;
 console.log(this.dataPubFaByDate);
//  this.dataAnimal = res[1];
     // var canvas = $('#wsidin').get(0) as HTMLCanvasElement;
    //  console.log(canvas)
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
            text: "All Publicity Villages FA By date",
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
      // console.log(this.animalChart.data.labels);
      // console.log(this.animalChart.data.datasets[0].data);
      this.pubfadatechart.update();
//       var backgroundColor = 'white';
//    Chart.plugins.register({
//     beforeDraw: function(c) {
//         var ctx = c.chart.ctx;
//         ctx.fillStyle = backgroundColor;
//         ctx.fillRect(0, 0, c.chart.width, c.chart.height);
//     }
// });
// $('#save').click(function() {
//     canvas.toBlob(function(blob) {
//         saveAs(blob, "pretty image.png");
//     });
// });
  });
//

    }
  }

  // publicity villages by frequency

private getallpublicityvillagefreq(){
  let record = this.wildService.getpublicityvillagefreq();
  record.subscribe(res =>
  {
 console.log(res);
 //this.dataPubFreq = JSON.parse(res.data);
 //this.dataPubFreq = res;
// console.log(this.dataCat = res[0])
//  this.dataAnimal = res[1];
for(let i=0;i<30;i++){
  this.dataPubFreq.push(res[i]);
}
console.log(this.dataPubFreq);
Chart.Legend.prototype.afterFit = function() {
  this.height = this.height + 40;
};
     // var canvas = $('#wsidin').get(0) as HTMLCanvasElement;
    //  console.log(canvas)
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
      // console.log(this.animalChart.data.labels);
      // console.log(this.animalChart.data.datasets[0].data);
      this.pubfreqchart.update();
//       var backgroundColor = 'white';
//    Chart.plugins.register({
//     beforeDraw: function(c) {
//         var ctx = c.chart.ctx;
//         ctx.fillStyle = backgroundColor;
//         ctx.fillRect(0, 0, c.chart.width, c.chart.height);
//     }
// });
// $('#save').click(function() {
//     canvas.toBlob(function(blob) {
//         saveAs(blob, "pretty image.png");
//     });
// });
  });
//
}

// Publicity villages By Field Assistant
dataPubFa : any[];
pubfachart;

private getallpublicityvillagefa(){
  let record = this.wildService.getpublicityvillagefa();
  record.subscribe(res =>
  {
 console.log(res);
 //this.dataPubFreq = JSON.parse(res.data);
 this.dataPubFa = res;
 console.log(this.dataPubFa)
 console.log(res)
// console.log(this.dataCat = res[0])
//  this.dataAnimal = res[1];
Chart.Legend.prototype.afterFit = function() {
  this.height = this.height + 40;
};
     // var canvas = $('#wsidin').get(0) as HTMLCanvasElement;
    //  console.log(canvas)
      this.pubfachart = new Chart('pubfa', {
        type: "bar",
        data: {
          labels: [],
          datasets: [
            {
              backgroundColor: "#2ec4b6",
              label: "frequency",
              data: []
            }
          ]
        },
        options: {
          title: {
            text: "All Publicity Villages By Field Assisstant",
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
      // console.log(this.animalChart.data.labels);
      // console.log(this.animalChart.data.datasets[0].data);
      this.pubfachart.update();
//       var backgroundColor = 'white';
//    Chart.plugins.register({
//     beforeDraw: function(c) {
//         var ctx = c.chart.ctx;
//         ctx.fillStyle = backgroundColor;
//         ctx.fillRect(0, 0, c.chart.width, c.chart.height);
//     }
// });
// $('#save').click(function() {
//     canvas.toBlob(function(blob) {
//         saveAs(blob, "pretty image.png");
//     });
// });
  });
//
}

length2: any;
length3: any;
length4: any;

  getAllPublicity(){
    this.record = this.wildService.getPublicityAll();
    this.record.subscribe(res => {

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

      res[2].forEach(element => {
        if(element.TALUK !== null)
        element.TALUK =
        element.TALUK.charAt(0).toUpperCase() + element.TALUK.slice(1);
      });
      res[2].sort((a,b) => b.TALUK_FREQ - a.TALUK_FREQ);
      this.dataSource4 = res[2];
      this.length4 = this.dataSource4.length;
      this.displayedCol4 = ['Taluk', 'Frequency'];
    });
  }

  fromDate: { date?: { year: number; month: number; day: number; }; formatted: any; };
  toDate: { date?: { year: number; month: number; day: number; }; formatted: any; };

  getDateRange(){
    var d: Date = new Date();
  //  console.log(d);
        this.toDate = {date: {year: d.getFullYear(),
                             month: d.getMonth() + 1,
                             day: d.getDate()},
                            formatted: d.getFullYear()+"-"+('0' + (d.getMonth() + 1)).slice(-2)+"-"+('0' + (d.getDate())).slice(-2)};
        this.fromDate = {date: {year: d.getFullYear(),
                              month: d.getMonth() -2,
                              day: d.getDate()},
                            formatted: d.getFullYear()+"-"+('0' + (d.getMonth() -2 )).slice(-2)+"-"+('0' + (d.getDate())).slice(-2)};

                            if(this.fromDate.date.month === -2 || this.fromDate.date.month === -1){
                              this.fromDate = {date: {year: d.getFullYear()-1,
                                month: this.fromDate.date.month === -2 ? d.getMonth() + 11 : d.getMonth() + 12 ,
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
  }

  barChart1: any ;
  barChart2: any ;
  barChart3: any ;

  getPublicityByRange(){
    if (this.fromDate !== undefined && this.toDate !== undefined) {
    this.record = this.wildService.getPublicityByDate(this.fromDate.formatted, this.toDate.formatted);
    this.record.subscribe(res => {
      let data = res;
      let data1 = res[0];
      let data2 = res[1];
      let data3 = res[2];
      let data4 = res[3];
      
      console.log(data1);
      let villageFreq: any = [];
      let talukFreq: any = [];
      let parkFreq: any = [];

      let villageArr: any = [];
      let talukArr: any = [];
      let parkArr: any = [];

      villageFreq = data[0].reduce(function(res, obj) {
        console.log(villageFreq)
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
            backgroundColor: "#e71d36",
              label: 'Village Freq',
              borderWidth:1,
              "fill" : false
            }
          ]
        },
        options: {
          responsive: true, maintainAspectRatio: false,
          title: {
            text: "Frequency of Villages Visited",
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

      console.log(parkFreq);
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
            text: "Frequency of Villages Visited By Park",
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

console.log(talukFreq);
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
            text: "Frequency of Villages Visited By Taluk",
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
      //   console.log(newStr)
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
// editField: string;
// personList: Array<any> = [
//   { id: 1, name: 'Aurelia Vega', age: 30, companyName: 'Deepends', country: 'Spain', city: 'Madrid' },
//   { id: 2, name: 'Guerra Cortez', age: 45, companyName: 'Insectus', country: 'USA', city: 'San Francisco' },
//   { id: 3, name: 'Guadalupe House', age: 26, companyName: 'Isotronic', country: 'Germany', city: 'Frankfurt am Main' },
//   { id: 4, name: 'Aurelia Vega', age: 30, companyName: 'Deepends', country: 'Spain', city: 'Madrid' },
//   { id: 5, name: 'Elisa Gallagher', age: 31, companyName: 'Portica', country: 'United Kingdom', city: 'London' },
// ];

// awaitingPersonList: Array<any> = [
//   { id: 6, name: 'George Vega', age: 28, companyName: 'Classical', country: 'Russia', city: 'Moscow' },
//   { id: 7, name: 'Mike Low', age: 22, companyName: 'Lou', country: 'USA', city: 'Los Angeles' },
//   { id: 8, name: 'John Derp', age: 36, companyName: 'Derping', country: 'USA', city: 'Chicago' },
//   { id: 9, name: 'Anastasia John', age: 21, companyName: 'Ajo', country: 'Brazil', city: 'Rio' },
//   { id: 10, name: 'John Maklowicz', age: 36, companyName: 'Mako', country: 'Poland', city: 'Bialystok' },
// ];

// updateList(id: number, property: string, event: any) {
//   const editField = event.target.textContent;
//   this.personList[id][property] = editField;
// }

// remove(id: any) {
//   this.awaitingPersonList.push(this.personList[id]);
//   this.personList.splice(id, 1);
// }

// add() {
//   if (this.awaitingPersonList.length > 0) {
//     const person = this.awaitingPersonList[0];
//     this.personList.push(person);
//     this.awaitingPersonList.splice(0, 1);
//   }
// }

// changeValue(id: number, property: string, event: any) {
//   this.editField = event.target.textContent;
// }

}
