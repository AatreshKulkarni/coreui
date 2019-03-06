import { Component, OnInit, ViewChild, ViewEncapsulation } from "@angular/core";
import * as jsPDF from 'jspdf'
import * as html2canvas from 'html2canvas'
import * as $ from 'jquery';
//import saveAs from 'file-saver'
import { saveAs } from 'file-saver'


import { MatTableDataSource, MatPaginator } from "@angular/material";
import { Ng4LoadingSpinnerService } from "ng4-loading-spinner";

import { ConnectorService } from "../../services/connector.service";
import { ExcelService } from "../../services/excel.service";

import {

  IChartDataset,
  IHwcBlockA,
  IBarChartDataSet,
  IGetblock2TtotalCasesByYearMonth,
  IBblock2Top20CasesByCat,
  IBblock2Top50CasesByWsid,
  IBlock3TopCases,
  IFADateFreq,
  IHwcDateFreq,
  IGeoJson,
  ICoordinates
} from "../../models/hwc.model";
import * as GeoJSON from "geojson";
import * as tokml from "tokml";
import * as FileSaver from "file-saver";
import { from } from "rxjs";
import { groupBy, mergeMap, toArray } from "rxjs/operators";
import { Chart } from "chart.js";
import "chartjs-plugin-datalabels";

@Component({
  selector: "app-hwc",
  templateUrl: "./hwc.component.html",
  styleUrls: ["./hwc.component.scss"],
  providers: [ConnectorService]
})
export class HwcComponent implements OnInit {
  geoJsonData = [
    // { name: 'Location A', category: 'Store', street: 'Market', lat: 39.984, lng: -75.343 },
    // { name: 'Location B', category: 'House', street: 'Broad', lat: 39.284, lng: -75.833 },
    // { name: 'Location C', category: 'Office', street: 'South', lat: 39.123, lng: -74.534 },
    // { name: 'Location D', category: 'home', street: 'East', lat: 12.9716, lng: 77.5946 }
  ];
  obj;
  record: any;
  record1: any;
  dataSource: any;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  totalPost;
  postPerPage = 10;
  pageSizeOptions = [5, 10, 20, 50, 100];
  public fromDate: any;
  public toDate: any;
  public toShow: boolean = false;



  _arr: Array<IGeoJson> = [];
  animalChartByHwc: any;
  block3TopCasesData: any = [];

  constructor(
    private wildService: ConnectorService,
    private excelService: ExcelService,
    private spinnerService: Ng4LoadingSpinnerService
  ) {}

  // displayedCol = [
  //   'HWC_METAINSTANCE_ID',
  //   'HWC_METASUBMISSION_DATE',
  //   'HWC_FULL_NAME',
  //   'HWC_NEWPHONE_NUMBER',
  //   'HWC_PARK_NAME',
  //   'HWC_TALUK_NAME',
  //   'HWC_VILLAGE_NAME',
  //   'HWC_ANIMAL'
  // ];

  public myDatePickerOptions: any = {
    // other options...
    dateFormat: 'yyyy-mm-dd',
};


  displayedCol = [];
  ngOnInit() {
    this.spinnerService.show();
    // this.record = this.wildService.getHWC();
    // this.record.subscribe(res => {
    //   if (!res) {
    //     this.spinnerService.hide();
    //     return;
    //   }
    //   this.totalPost = res.length;
    //   this.dataSource = new MatTableDataSource(res.response);
    //   this.dataSource.paginator = this.paginator;

    // });

//Uncomment this file

    this.getDateRange();
    this.block1Graph();

   this.getBlock2TotalCasesByYearMonthGraph();
   this.getBblock2Top20CasesByCatGraph();
    this.getBblock2Top50CasesByWsidGraph();
   this.getBlock3TopCasesGraph();
    this.getincidentsalltablebycat();
    this.getincidentsallwsid();
    this.getvillageincidents();
    this.getrangeincidents();
    this.getblock2allcasesprojectyear();
    this.getallvillageincidentsbycat();
    this.getallrangeincidentsbycat();

    this.getblock2ByFaDateFreq();
    this.getBlock2ByHwcDateFreq();

// End


    this.spinnerService.hide();
  }


  downloadImage(data, myImage) {
  /* save as image */
  var link = document.createElement('a');
//  link.href = this.bar.toBase64Image();
  link.href = data.toBase64Image();
  link.download = myImage +'.png';
  link.click();
  }

 resultvillage = this.wildService.getincidentsallvillage();
 resultrange = this.wildService.getincidentsallrange();
 result5 = this.wildService.getblock2totalcasesbyprojectyear();

  getDateRange() {
    var d: Date = new Date();
    this.toDate = {
      date: {
        year: d.getFullYear(),
        month: d.getMonth() + 1,
        day: d.getDate()
      },
      formatted:
        d.getFullYear() +
        "-" +
        ("0" + (d.getMonth() + 1)).slice(-2) +
        "-" +
        ("0" + d.getDate()).slice(-2)
    };
    this.fromDate = {
      date: {
        year: d.getFullYear(),
        month: d.getMonth()+1 - 2,
        day: d.getDate()
      },
      formatted:
        d.getFullYear() +
        "-" +
        ("0" + (d.getMonth()+1 - 2)).slice(-2) +
        "-" +
        ("0" + d.getDate()).slice(-2)
    };
    if(this.fromDate.date.month === -1 || this.fromDate.date.month === 0){
      this.fromDate = {date: {year: d.getFullYear()-1,
        month:  d.getMonth() + 11 ,
        day: d.getDate()},
      formatted: d.getFullYear()-1+"-"+('0' + (d.getMonth() + 11)).slice(-2)+"-"+('0' + (d.getDate())).slice(-2)};
     }
  }

  private saveAsKmlFile(buffer: any, fileName: string): void {
    const data: Blob = new Blob([buffer]);
    FileSaver.saveAs(data, fileName + "_export.kml");
  }

  xlsxReport(data, name) {
    this.excelService.exportAsExcelFile(data, name);
    return "success";
  }
  kmlReport() {
    var kmlData = {};
    for (let i = 0; i < this.dataSource.data.length; i++) {
      kmlData = {
        Name: this.dataSource.data[i].HWC_TALUK_NAME,
        Park: this.dataSource.data[i].HWC_PARK_NAME,
        lat: this.dataSource.data[i].HWC_LATITUDE,
        lng: this.dataSource.data[i].HWC_LONGITUDE
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

  showMainContent: boolean = false;

  buttonName: any = "Date Range"

  showHideButton() {
    if(this.showMainContent = !this.showMainContent){
      this.buttonName = "All Cases";
      this.block1ByHwcDate();
      this.block1HwcCasesByFDSubDateGraph();
    }
     else{
      this.buttonName = "Date Range";
       this.block1Graph();
       this.getincidentsallwsid();
       this.getvillageincidents();
       this.getrangeincidents();
       this.getblock2allcasesprojectyear();
     }

  }

  onSubmit(fDate, tDate) {
    this.fromDate = fDate;
    this.toDate = tDate;
    //   this.toShow = true;
    this.block1ByHwcDate();
    //  this.block1HwcCasesByDateGraph();
    this.block1HwcCasesByFDSubDateGraph();
    this.getblock2ByFaDateFreq();
    this.getBlock2ByHwcDateFreq();
  }

  // chartType = 'Category';
  // chartType1 = 'Taluk';

  categoryArr: any = [];
  dataCat: any = [];
  dataAnimal: any = [];
  dataPark: any = [];
  dataTaluk: any = [];
  dataRange: any = [];
  dataVillage: any = [];

  dataCatBydate: any = [];
  dataAnimalBydate: any = [];
  dataParkBydate: any = [];
  dataTalukBydate: any = [];
  dataRangeBydate: any = [];
  dataVillageBydate: any = [];

  dataCatByFd: any = [];
  dataAnimalByFd: any = [];
  dataParkByFd: any = [];
  dataTalukByFd: any = [];
  dataRangeByFd: any = [];
  dataVillageByFd: any = [];

  dataWSID: any = [];
  dataWsid: any[];

  catChart;
  animalChart;
  wsidchart;
  parkChart;
  talukChart;
  rangeChart;
  villageChart;

  cat: number = 0;


  // First Graph

  private block1Graph() {
    this.record = this.wildService.getHwcGetBlock1();

    Chart.pluginService.register({
      beforeDraw: function(chart) {
        if (chart.data.datasets[0].data.length === 0  ) {
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

      },
      afterDraw: function (chart) {

                      if (chart.data.datasets[0].data.length === 0  ) {
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


    this.record.subscribe(res => {
      this.dataCat = res[0];
      console.log(this.dataCat[0]);
      Chart.defaults.global.plugins.datalabels.anchor = "end";
      Chart.defaults.global.plugins.datalabels.align = "end";

      this.catChart = new Chart("category", {
        type: "bar",
        data: {
          labels: ["Crop Loss", "Crop & Property Loss", "Property Loss", "Livestock Predation", "Human Injury", "Human Death"],
          datasets: [
            {
              backgroundColor: "#e71d36",
              label: "frequency",
              data: [this.dataCat[0].CAT_FREQ,this.dataCat[1].CAT_FREQ,this.dataCat[5].CAT_FREQ,this.dataCat[4].CAT_FREQ,this.dataCat[3].CAT_FREQ, this.dataCat[2].CAT_FREQ]
            }
          ]
        },
        options: {
          title: {
            text: "Frequency of Human-Wildlife Conflict Incidents by HWC category",
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
          }
        }
      });

      // this.dataCat.forEach(element => {
      //   element.CATEGORY =
      //   element.CATEGORY.charAt(0).toUpperCase() + element.CATEGORY.slice(1);
      //   this.catChart.data.labels.push(element.CATEGORY);
      //   this.catChart.data.datasets[0].data.push(element.CAT_FREQ);
      // });
      // console.log(this.catChart.data.labels);
      // console.log(this.catChart.data.datasets[0].data);
      this.catChart.update();

      this.dataAnimal = res[1];
      this.animalChart = new Chart("animal", {
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
            text: "Frequency of Human-Wildlife Conflict Incidents by Animal",
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
          }
        }
      });

      this.dataAnimal.forEach(element => {
        element.ANIMAL =
        element.ANIMAL.charAt(0).toUpperCase() + element.ANIMAL.slice(1);
        this.animalChart.data.labels.push(element.ANIMAL);
        this.animalChart.data.datasets[0].data.push(element.ANIMAL_FREQ);
      });
      // console.log(this.animalChart.data.labels);
      // console.log(this.animalChart.data.datasets[0].data);
      this.animalChart.update();

      this.dataPark = res[2];
      this.parkChart = new Chart("park", {
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
            text: "Frequency of Human-Wildlife Conflict Incidents by Park",
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
          }
        }
      });

      this.dataPark.forEach(element => {
        element.PARK =
        element.PARK.charAt(0).toUpperCase() + element.PARK.slice(1);
        this.parkChart.data.labels.push(element.PARK);
        this.parkChart.data.datasets[0].data.push(element.PARK_FREQ);
      });
      // console.log(this.parkChart.data.labels);
      // console.log(this.parkChart.data.datasets[0].data);
      this.parkChart.update();

      this.dataTaluk = res[3];
      this.talukChart = new Chart("taluk", {
        type: "bar",
        data: {
          labels: [],
          datasets: [
            {
              backgroundColor: "#566573",
              label: "frequency",
              data: []
            }
          ]
        },
        options: {
          title: {
            text: "Frequency of Human-Wildlife Conflict Incidents by Taluk",
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
          }
        }
      });
      this.dataTaluk.forEach(element => {
       // console.log(this.dataTaluk)
       // console.log(this.dataTaluk[1].value)
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
        console.log(element.TALUK);
        this.talukChart.data.labels.push(element.TALUK);
        this.talukChart.data.datasets[0].data.push(element.TALUK_FREQ);

      });
      //console.log(this.talukChart.data.labels[2]);
      this.talukChart.update();

      this.dataRange = res[4];
      this.rangeChart = new Chart("range", {
        type: "bar",
        data: {
          labels: [],
          datasets: [
            {
              backgroundColor: "#8e44ad",
              label: "frequency",
              data: []
            }
          ]
        },
        options: {
          title: {
            text: "Frequency of Human-Wildlife Conflict Incidents by Range",
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
          }
        }
      });

      this.dataRange.forEach(element => {
        element.HWC_RANGE =
        element.HWC_RANGE.charAt(0).toUpperCase() + element.HWC_RANGE.slice(1);
        if (element.HWC_RANGE === "Hdkote")
        {
         element.HWC_RANGE = this.change();
      //   var str1 = "Hdkote";
      //   var newStr = [str1.slice(0, 2), str1.slice(2)].join(' ');
      //   console.log(newStr)
      //   element.TALUK = newStr;
      }

      if (element.HWC_RANGE === "Gsbetta")
        {
        element.HWC_RANGE = this.changegb();
      }
      if (element.HWC_RANGE === "Dbkuppe")
        {
        element.HWC_RANGE = this.changedb();
      }
      if (element.HWC_RANGE === "Nbeguru")
        {
        element.HWC_RANGE = this.changenb();
      }
        this.rangeChart.data.labels.push(element.HWC_RANGE);
        this.rangeChart.data.datasets[0].data.push(element.RANGE_FREQ);
      });
      this.rangeChart.update();

      let resVillage: any = [];

      this.dataVillage = res[5];
      this.result = this.dataVillage;
      this.result
          .sort(function(a, b) {
            return a.VILLAGE_FREQ - b.VILLAGE_FREQ;
          })
          .reverse();
        console.log(this.result);
        for (let i = 0; i < 20; i++) {
          resVillage.push(this.result[i]);
        }

      this.villageChart = new Chart("village", {
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
            text: "Frequency of Human-Wildlife Conflict Incidents by Village",
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
          }
        }
      });

      resVillage.forEach(element => {
        element.VILLAGE =
        element.VILLAGE.charAt(0).toUpperCase() + element.VILLAGE.slice(1);
        this.villageChart.data.labels.push(element.VILLAGE);
        this.villageChart.data.datasets[0].data.push(element.VILLAGE_FREQ);
      });
      // console.log(this.villageChart.data.labels);
      // console.log(this.villageChart.data.datasets[0].data);
      this.villageChart.update();
    });
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




  categoryArrByHwcDate: any = [];
  result;
  catChartByHwc;
  parkChartByHwc;
  talukChartByHwc;
  rangeChartByHwc;
  villageChartByHwc;
 result1;







  // Second Graph

  private block1ByHwcDate() {
    this.record = this.wildService.getHwcCasesByHwcDate(
      this.fromDate.formatted,
      this.toDate.formatted
    );

    this.record.subscribe(res => {
      this.dataCat = res[0];
      console.log(this.dataCat);
      this.result1 = this.dataCat
        .reduce(
          function(res, obj) {
            if (!(obj.CATEGORY in res)) {
              res.__array.push((res[obj.CATEGORY] = obj));
              res;
            } else {
              res[obj.CATEGORY].CAT_FREQ += obj.CAT_FREQ;
              // res[obj.category].bytes += obj.bytes;
            }
            return res;
          },
          { __array: [] }
        )
        .__array.sort(function(a, b) {
          return b.bytes - a.bytes;
        });

        console.log(this.result1);

      if (this.catChartByHwc !== undefined) {
        this.catChartByHwc.destroy();
      }

      this.catChartByHwc = new Chart("categorybyhwc", {
        type: "bar",
        data: {
          labels: [],
          datasets: [
            {
              backgroundColor: "#e71d36",
              label: "frequency",
              data: []
            }
          ]
        },
        options: {
          title: {
            text: "Frequency of cases by HWC category(HWC Date) [" + this.fromDate.formatted + " to " + this.toDate.formatted + "]",
            display: true
          },
          legend: {
            display: false
          },
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            yAxes: [
              {
                ticks: {
                  beginAtZero: true
                }
              }
            ],
            xAxes: [
              {
                gridLines: {
                display: false
              },
              ticks: {
                autoSkip: false
              }
            }
            ]
          }
        }
      });
      // console.log(this.result1);
      this.result1.forEach(element => {
        element.CATEGORY =
        element.CATEGORY.charAt(0).toUpperCase() + element.CATEGORY.slice(1);
        this.catChartByHwc.data.labels.push(element.CATEGORY);
        this.catChartByHwc.data.datasets[0].data.push(element.CAT_FREQ);
      });
      // console.log(this.catChartByHwc.data.labels);
      // console.log(this.catChartByHwc.data.datasets[0].data);

      this.catChartByHwc.update();

      // Animal

      this.dataAnimal = res[1];
      this.result = this.dataAnimal
        .reduce(
          function(res, obj) {
            if (!(obj.ANIMAL in res)) {
              res.__array.push((res[obj.ANIMAL] = obj));
              res;
            } else {
              res[obj.ANIMAL].ANIMAL_FREQ += obj.ANIMAL_FREQ;
              // res[obj.category].bytes += obj.bytes;
            }
            return res;
          },
          { __array: [] }
        )
        .__array.sort(function(a, b) {
          return b.bytes - a.bytes;
        });

      if (this.animalChartByHwc !== undefined) {
        this.animalChartByHwc.destroy();
      }

      this.animalChartByHwc = new Chart("animalbyhwc", {
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
            text: "Frequency of cases by Animal(HWC Date) [" + this.fromDate.formatted + " to " + this.toDate.formatted + "]",
            display: true
          },
          legend: {
            display: false
          },
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            yAxes: [
              {
                ticks: {
                  beginAtZero: true
                }
              }
            ],
            xAxes: [
              {
                gridLines: {
                display: false
              },
              ticks: {
                autoSkip: false
              }
            }
            ]
          }
        }
      });
      //  console.log(this.result);
      this.result.forEach(element => {
        element.ANIMAL =
        element.ANIMAL.charAt(0).toUpperCase() + element.ANIMAL.slice(1);
        this.animalChartByHwc.data.labels.push(element.ANIMAL);
        this.animalChartByHwc.data.datasets[0].data.push(element.ANIMAL_FREQ);
      });
      //  console.log(this.animalChartByHwc.data.labels);
      //  console.log(this.animalChartByHwc.data.datasets[0].data);
      this.animalChartByHwc.update();

      // Park

      this.dataPark = res[2];
      this.result = this.dataPark
        .reduce(
          function(res, obj) {
            if (!(obj.PARK in res)) {
              res.__array.push((res[obj.PARK] = obj));
              res;
            } else {
              res[obj.PARK].PARK_FREQ += obj.PARK_FREQ;
              // res[obj.category].bytes += obj.bytes;
            }
            return res;
          },
          { __array: [] }
        )
        .__array.sort(function(a, b) {
          return b.bytes - a.bytes;
        });

      if (this.parkChartByHwc !== undefined) {
        this.parkChartByHwc.destroy();
      }

      this.parkChartByHwc = new Chart("parkbyhwc", {
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
            text: "Frequency of cases by Park(HWC Date) [" + this.fromDate.formatted + " to " + this.toDate.formatted + "]",
            display: true
          },
          legend: {
           display:false
          },
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            yAxes: [
              {
                ticks: {
                  beginAtZero: true
                }
              }
            ],
            xAxes: [
              {
                gridLines: {
                display: false
              },
              ticks: {
                autoSkip: false
              }
            }
            ]
          }
        }
      });

      this.result.forEach(element => {
        element.PARK =
        element.PARK.charAt(0).toUpperCase() + element.PARK.slice(1);
        this.parkChartByHwc.data.labels.push(element.PARK);
        this.parkChartByHwc.data.datasets[0].data.push(element.PARK_FREQ);
      });
      //  console.log(this.parkChartByHwc.data.labels);
      //  console.log(this.parkChartByHwc.data.datasets[0].data);
      this.parkChartByHwc.update();

      // Taluk

      this.dataTaluk = res[3];
      this.result = this.dataTaluk
        .reduce(
          function(res, obj) {
            if (!(obj.TALUK in res)) {
              res.__array.push((res[obj.TALUK] = obj));
              res;
            } else {
              res[obj.TALUK].TALUK_FREQ += obj.TALUK_FREQ;
              // res[obj.category].bytes += obj.bytes;
            }
            return res;
          },
          { __array: [] }
        )
        .__array.sort(function(a, b) {
          return b.bytes - a.bytes;
        });

      if (this.talukChartByHwc !== undefined) {
        this.talukChartByHwc.destroy();
      }

      this.talukChartByHwc = new Chart("talukbyhwc", {
        type: "bar",
        data: {
          labels: [],
          datasets: [
            {
              backgroundColor: "#566573",
              label: "frequency",
              data: []
            }
          ]
        },
        options: {
          title: {
            text: "Frequency of cases by Taluk(HWC Date)[" + this.fromDate.formatted + " to " + this.toDate.formatted + "]",
            display: true
          },
          legend: {
            display: false
          },
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            yAxes: [
              {
                ticks: {
                  beginAtZero: true
                }
              }
            ],
            xAxes: [
              {
                gridLines: {
                display: false
              },
              ticks: {
                autoSkip: false
              }
            }
            ]
          }
        }
      });

      this.result.forEach(element => {
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
        this.talukChartByHwc.data.labels.push(element.TALUK);
        this.talukChartByHwc.data.datasets[0].data.push(element.TALUK_FREQ);
      });
      //    console.log(this.talukChartByHwc.data.labels);
      //  console.log(this.talukChartByHwc.data.datasets[0].data);
      this.talukChartByHwc.update();

      // Range

                this.dataRange = res[4];
      this.result = this.dataRange
        .reduce(
          function(res, obj) {
            if (!(obj.HWC_RANGE in res)) {
              res.__array.push((res[obj.HWC_RANGE] = obj));
              res;
            } else {
              res[obj.HWC_RANGE].RANGE_FREQ += obj.RANGE_FREQ;
              // res[obj.category].bytes += obj.bytes;
            }
            return res;
          },
          { __array: [] }
        )
        .__array.sort(function(a, b) {
          return b.bytes - a.bytes;
        });

      if (this.rangeChartByHwc !== undefined) {
        this.rangeChartByHwc.destroy();
      }

      this.rangeChartByHwc = new Chart("rangebyhwc", {
        type: "bar",
        data: {
          labels: [],
          datasets: [
            {
              backgroundColor: "#8e44ad",
              label: "frequency",
              data: []
            }
          ]
        },
        options: {
          title: {
            text: "Frequency of cases by Range(HWC Date) [" + this.fromDate.formatted + " to " + this.toDate.formatted + "]",
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
          }
        }
      });

      this.result.forEach(element => {
        element.HWC_RANGE =
        element.HWC_RANGE.charAt(0).toUpperCase() + element.HWC_RANGE.slice(1);
        this.rangeChartByHwc.data.labels.push(element.HWC_RANGE);
        this.rangeChartByHwc.data.datasets[0].data.push(element.RANGE_FREQ);
      });
      // console.log(this.rangeChartByHwc.data.labels);
      // console.log(this.rangeChartByHwc.data.datasets[0].data);
      this.rangeChartByHwc.update();

      //      Village
      let resVillageByHWC: any = [];

      this.dataVillage = res[5];
      this.result = this.dataVillage
        .reduce(
          function(res, obj) {
            if (!(obj.VILLAGE in res)) {
              res.__array.push((res[obj.VILLAGE] = obj));
              res;
            } else {
              res[obj.VILLAGE].VILLAGE_FREQ += obj.VILLAGE_FREQ;
              // res[obj.category].bytes += obj.bytes;
            }
            return res;
          },
          { __array: [] }
        )
        .__array.sort(function(a, b) {
          return b.bytes - a.bytes;
        });

      this.result
        .sort(function(a, b) {
          return a.VILLAGE_FREQ - b.VILLAGE_FREQ;
        })
        .reverse();

      for (let i = 0; i < 20 ; i++) {
        resVillageByHWC.push(this.result[i]);
      }
      console.log(resVillageByHWC);

      if (this.villageChartByHwc !== undefined) {
        this.villageChartByHwc.destroy();
      }

      this.villageChartByHwc = new Chart("villagebyhwc", {
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
            text: "Frequency of cases by Village(HWC Date) [" + this.fromDate.formatted + " to " + this.toDate.formatted + "]",
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
                  //  maxRotation: 90,
                  //  minRotation: 90
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

      resVillageByHWC.forEach(element => {
        if(element !== undefined){
        console.log(element);
        element.VILLAGE =
          element.VILLAGE.charAt(0).toUpperCase() + element.VILLAGE.slice(1);
        this.villageChartByHwc.data.labels.push(element.VILLAGE);
        this.villageChartByHwc.data.datasets[0].data.push(element.VILLAGE_FREQ);
      }
      });
      //  console.log(this.villageChartByHwc.data.labels);
      //  console.log(this.villageChartByHwc.data.datasets[0].data);
      this.villageChartByHwc.update();
    });
  }
// For All Incidents by WSID

private getincidentsallwsid(){
  let record = this.wildService.getincidentsall();
  record.subscribe(res =>
  {
 console.log(res);
 this.dataWsid = res[0];
// console.log(this.dataCat = res[0])
//  this.dataAnimal = res[1];
     // var canvas = $('#wsidin').get(0) as HTMLCanvasElement;
    //  console.log(canvas)
      this.wsidchart = new Chart('wsidin', {
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
            text: "ALL Incidents By WSID's",
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

      this.dataWsid.forEach(element => {
        // element.ANIMAL =
        // element.ANIMAL.charAt(0).toUpperCase() + element.ANIMAL.slice(1);
        this.wsidchart.data.labels.push(element.HWC_WSID);
        this.wsidchart.data.datasets[0].data.push(element.INCIDENT);
      });
      // console.log(this.animalChart.data.labels);
      // console.log(this.animalChart.data.datasets[0].data);
      this.wsidchart.update();
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

// downloadImage(idt){
// var canvas =  $(idt).get(0) as HTMLCanvasElement;
// console.log(canvas)
// var backgroundColor = 'white';
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

// }
allVill: any;
displayedCol35: any;
//Top 30 villages for all incidents
private getvillageincidents(){
let record: any = [];
  let labelNames: any = []
this.resultvillage.subscribe(res => {
      console.log(res)
    let _data = res[1];
    console.log( _data)
    this.data33[6] = _data;
    this.displayedCol35 = ["VILLAGE NAME", "INCIDENT"]
    this.allVill= new Chart("inVil" , {
    type: 'bar',
    data:{
      labels: labelNames,
      datasets: [
        {
          data: [],
          backgroundColor: "#011627",
          "borderWidth":1,
          label: 'Incidents',
          file: false
        }

      ]
    },

    options: {
      title: {
        text: "Villages for All incidents",
        display: true
      },
      legend: {
        display: false
      },
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        yAxes: [
          {
            ticks: {
              beginAtZero: true
            }
          }
        ],
        xAxes: [
          {
            gridLines: {
            display: false
          },
          ticks: {
            autoSkip: false
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
      },
    }
  });

 _data.forEach(element => {
    element.HWC_VILLAGE_NAME =
     element.HWC_VILLAGE_NAME.charAt(0).toUpperCase() + element.HWC_VILLAGE_NAME.slice(1);
    this.allVill.data.labels.push(element.HWC_VILLAGE_NAME);
    this.allVill.data.datasets[0].data.push(element.INCIDENT);
  });

  this.allVill.update();

});
// document.getElementById('download-pdf').addEventListener("click", downloadPDF);

//donwload pdf from original canvas
// function downloadPDF() {
//   //var canvas = document.querySelector('#inVil');
// 	//creates image
//   let canvas = <HTMLCanvasElement> document.getElementById('inVil');
// 	var canvasImg = canvas.toDataURL("image/jpeg", 1.0);

// 	//creates PDF from img
// 	var doc = new jsPDF('landscape');
// 	doc.setFontSize(20);
//   doc.setFillColor(255, 255,255,0);
//   doc.rect(10, 10, 150, 160, "F");
// 	doc.text(15, 15, "Cool Chart");
// 	doc.addImage(canvasImg, 'JPEG', 10, 10, 280, 150 );
// 	doc.save('canvas.pdf');
// }

}

//Top 30 ranges for all incidents
displayedCol36:any;
allRange: any;
private getrangeincidents(){
  let record: any = [];
  let labelNames: any = []
this.resultrange.subscribe(res => {
      console.log(res)
    let _data = res[2];
    console.log( _data);
    this.data34[6] = _data;
    this.displayedCol36 = ["HWC_RANGE", "INCIDENT"]
    this.allRange= new Chart("inRange" , {
    type: 'bar',
    data:{
      labels: labelNames,
      datasets: [
        {
          data: [],
          backgroundColor: "#e71d36",
          "borderWidth":1,
          label: 'Ranges',
          file: false
        }

      ]
    },

    options: {
      title: {
        text: "Ranges for All incidents",
        display: true
      },
      legend: {
        display: false
      },
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        yAxes: [
          {
            ticks: {
              beginAtZero: true
            }
          }
        ],
        xAxes: [
          {
            gridLines: {
            display: false
          },
          ticks: {
            autoSkip: false
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

 _data.forEach(element => {
    element.HWC_RANGE =
     element.HWC_RANGE.charAt(0).toUpperCase() + element.HWC_RANGE.slice(1);
     if (element.HWC_RANGE === "Hdkote")
        {
         element.HWC_RANGE = this.change();
      //   var str1 = "Hdkote";
      //   var newStr = [str1.slice(0, 2), str1.slice(2)].join(' ');
      //   console.log(newStr)
      //   element.TALUK = newStr;
      }

      if (element.HWC_RANGE === "Gsbetta")
        {
        element.HWC_RANGE = this.changegb();
      }
      if (element.HWC_RANGE === "Dbkuppe")
        {
        element.HWC_RANGE = this.changedb();
      }
      if (element.HWC_RANGE === "Nbeguru")
        {
        element.HWC_RANGE = this.changenb();
      }
    this.allRange.data.labels.push(element.HWC_RANGE);
    this.allRange.data.datasets[0].data.push(element.INCIDENT);
  });

  this.allRange.update();

});

}
//All Block2 totalCases Projectbyyear

baryear: any =[];

private getblock2allcasesprojectyear(){
    let record: any = [];
  let labelNames: any = []
  this.result5.subscribe(res => {
   console.log(res)
//  let  data6 = res.data;
  let data6 = JSON.parse(res.data);
  console.log(data6[0]);
  let i = 0;
  data6.forEach(element => {

     record[i++] = element.reduce((sum, item) => sum + item.TOTAL_CASES, 0);
     labelNames.push("Project Year"  + "(201" + (5+(i-1)) + ("-1"+ (5+ i)+")"));
    // console.log(labelNames.push("projYear" + (i)));
    });
console.log(record);
this.record = record;
console.log(this.record);
Chart.Legend.prototype.afterFit = function() {
  this.height = this.height + 30;
};

this.baryear= new Chart("baryear" , {
  type: 'bar',
  data:{
    labels: labelNames,
    datasets: [
      {
        data: [],
        backgroundColor: "#2ec4b6",
        "borderWidth":1,

        label: 'Cases',
        file: false
      }

    ]
  },

  options: {
    title: {
      text: "Number of cases in each year",
      display: true
    },
    legend: {
      display: false
    },
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      yAxes: [
        {
          ticks: {
            beginAtZero: true
          },
          stacked: false
        }
      ],
      xAxes: [
        {
          gridLines: {
          display: false
        },
        ticks: {
          autoSkip: false
        },

          stacked: false

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

for(let i=0; i<record.length; i++){
//  barChart[i].data.labels.push(element.MONTH);

  this.baryear.data.datasets[0].data.push(record[i]);
}
//console.log(data1);
this.baryear.update();
});

}


  catChartFd;
  animalChartFd;
  parkChartFd;
  talukChartFd;
  rangeChartFd;
  villageChartFd;
  incidentchartFd;

  private block1HwcCasesByFDSubDateGraph() {
    if (this.fromDate !== undefined && this.toDate !== undefined) {
      this.record = this.wildService.getHwcCasesByFDSubDate(
        this.fromDate.formatted,
        this.toDate.formatted
      );
      this.record.subscribe(res => {
        this.dataCatByFd = res[0];

        this.result1 = this.dataCatByFd
          .reduce(
            function(res, obj) {
              if (!(obj.CATEGORY in res)) {
                res.__array.push((res[obj.CATEGORY] = obj));
                res;
              } else {
                res[obj.CATEGORY].CAT_FREQ += obj.CAT_FREQ;
                // res[obj.category].bytes += obj.bytes;
              }
              return res;
            },
            { __array: [] }
          )
          .__array.sort(function(a, b) {
            return b.bytes - a.bytes;
          });

        if (this.catChartFd !== undefined) {
          this.catChartFd.destroy();
        }

        this.catChartFd = new Chart("catfd", {
          type: "bar",
          data: {
            labels: [],
            datasets: [
              {
                backgroundColor: "#e71d36",
                label: "frequency",
                data: []
              }
            ]
          },
          options: {
            title: {
              text: "Frequency of cases by HWC category(FDSubDate[" + this.fromDate.formatted + " to " + this.toDate.formatted + "]",
              display: true
            },
            legend: {
              // labels: {
              //   boxWidth: 10,
              //   fontSize: 8
              // },
              // position: "right"
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
        // console.log(this.result1);
        this.result1.forEach(element => {
          element.CATEGORY =
          element.CATEGORY.charAt(0).toUpperCase() + element.CATEGORY.slice(1);
          this.catChartFd.data.labels.push(element.CATEGORY);
          this.catChartFd.data.datasets[0].data.push(element.CAT_FREQ);
        });
        //  console.log(this.catChartFd.data.labels);
        //  console.log(this.catChartFd.data.datasets[0].data);

        this.catChartFd.update();

        // Animal

        this.dataAnimalByFd = res[1];
        this.result = this.dataAnimalByFd
          .reduce(
            function(res, obj) {
              if (!(obj.ANIMAL in res)) {
                res.__array.push((res[obj.ANIMAL] = obj));
                res;
              } else {
                res[obj.ANIMAL].ANIMAL_FREQ += obj.ANIMAL_FREQ;
                // res[obj.category].bytes += obj.bytes;
              }
              return res;
            },
            { __array: [] }
          )
          .__array.sort(function(a, b) {
            return b.bytes - a.bytes;
          });

        if (this.animalChartFd !== undefined) {
          this.animalChartFd.destroy();
        }

        this.animalChartFd = new Chart("animalfd", {
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
              text: "Frequency of cases by Animal(FDSubDate[" + this.fromDate.formatted + " to " + this.toDate.formatted + "]",
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
        //  console.log(this.result);
        this.result.forEach(element => {
          element.ANIMAL =
          element.ANIMAL.charAt(0).toUpperCase() + element.ANIMAL.slice(1);
          this.animalChartFd.data.labels.push(element.ANIMAL);
          this.animalChartFd.data.datasets[0].data.push(element.ANIMAL_FREQ);
        });
        //  console.log(this.animalChartFd.data.labels);
        //  console.log(this.animalChartFd.data.datasets[0].data);
        this.animalChartFd.update();

        // Park

        this.dataParkByFd = res[2];
        this.result = this.dataParkByFd
          .reduce(
            function(res, obj) {
              if (!(obj.PARK in res)) {
                res.__array.push((res[obj.PARK] = obj));
                res;
              } else {
                res[obj.PARK].PARK_FREQ += obj.PARK_FREQ;
                // res[obj.category].bytes += obj.bytes;
              }
              return res;
            },
            { __array: [] }
          )
          .__array.sort(function(a, b) {
            return b.bytes - a.bytes;
          });

        if (this.parkChartFd !== undefined) {
          this.parkChartFd.destroy();
        }

        this.parkChartFd = new Chart("parkfd", {
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
              text: "Frequency of cases by Park(FDSubDate[" + this.fromDate.formatted + " to " + this.toDate.formatted + "]",
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

        this.result.forEach(element => {
          element.PARK =
          element.PARK.charAt(0).toUpperCase() + element.PARK.slice(1);
          this.parkChartFd.data.labels.push(element.PARK);
          this.parkChartFd.data.datasets[0].data.push(element.PARK_FREQ);
        });
        //  console.log(this.parkChartFd.data.labels);
        //  console.log(this.parkChartFd.data.datasets[0].data);
        this.parkChartFd.update();

        // Taluk

        this.dataTalukByFd = res[3];
        this.result = this.dataTalukByFd
          .reduce(
            function(res, obj) {
              if (!(obj.TALUK in res)) {
                res.__array.push((res[obj.TALUK] = obj));
                res;
              } else {
                res[obj.TALUK].TALUK_FREQ += obj.TALUK_FREQ;
                // res[obj.category].bytes += obj.bytes;
              }
              return res;
            },
            { __array: [] }
          )
          .__array.sort(function(a, b) {
            return b.bytes - a.bytes;
          });

        if (this.talukChartFd !== undefined) {
          this.talukChartFd.destroy();
        }

        this.talukChartFd = new Chart("talukfd", {
          type: "bar",
          data: {
            labels: [],
            datasets: [
              {
                backgroundColor: "#566573",
                label: "frequency",
                data: []
              }
            ]
          },
          options: {
            title: {
              text: "Frequency of cases by Taluk(FDSubDate[" + this.fromDate.formatted + " to " + this.toDate.formatted + "]",
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

        this.result.forEach(element => {
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
          this.talukChartFd.data.labels.push(element.TALUK);
          this.talukChartFd.data.datasets[0].data.push(element.TALUK_FREQ);
        });
        //    console.log(this.talukChartFd.data.labels);
        //  console.log(this.talukChartFd.data.datasets[0].data);
        this.talukChartFd.update();

        // Range

                  this.dataRange = res[4];
        this.result = this.dataRange
        //         this.dataRangeByFd = res[4];
        // this.result = this.dataRangeByFd
          .reduce(
            function(res, obj) {
              if (!(obj.HWC_RANGE in res)) {
                res.__array.push((res[obj.HWC_RANGE] = obj));
                res;
              } else {
                res[obj.HWC_RANGE].RANGE_FREQ += obj.RANGE_FREQ;
                // res[obj.category].bytes += obj.bytes;
              }
              return res;
            },
            { __array: [] }
          )
          .__array.sort(function(a, b) {
            return b.bytes - a.bytes;
          });

        if (this.rangeChartFd !== undefined) {
          this.rangeChartFd.destroy();
        }

        this.rangeChartFd = new Chart("rangefd", {
          type: "bar",
          data: {
            labels: [],
            datasets: [
              {
                backgroundColor: "#8e44ad",
                label: "frequency",
                data: []
              }
            ]
          },
          options: {
            title: {
              text: "Frequency of cases by Range(FDSubDate[" + this.fromDate.formatted + " to " + this.toDate.formatted + "]",
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

        this.result.forEach(element => {
          element.HWC_RANGE =
          element.HWC_RANGE.charAt(0).toUpperCase() + element.HWC_RANGE.slice(1);
          this.rangeChartFd.data.labels.push(element.HWC_RANGE);
          this.rangeChartFd.data.datasets[0].data.push(element.RANGE_FREQ);
        });
        // console.log(this.rangeChartFd.data.labels);
        // console.log(this.rangeChartFd.data.datasets[0].data);
        this.rangeChartFd.update();

        //      Village
        let resVillageByFD: any = [];

        this.dataVillageByFd = res[5];
        this.result = this.dataVillageByFd
          .reduce(
            function(res, obj) {
              if (!(obj.VILLAGE in res)) {
                res.__array.push((res[obj.VILLAGE] = obj));
                res;
              } else {
                res[obj.VILLAGE].VILLAGE_FREQ += obj.VILLAGE_FREQ;
                // res[obj.category].bytes += obj.bytes;
              }
              return res;
            },
            { __array: [] }
          )
          .__array.sort(function(a, b) {
            return b.bytes - a.bytes;
          });

        //      console.log(this.result);
        this.result
          .sort(function(a, b) {
            return a.VILLAGE_FREQ - b.VILLAGE_FREQ;
          })
          .reverse();
        console.log(this.result);
        for (let i = 0; i < 20; i++) {
          resVillageByFD.push(this.result[i]);
        }
        console.log(resVillageByFD);

        if (this.villageChartFd !== undefined) {
          this.villageChartFd.destroy();
        }

        this.villageChartFd = new Chart("villagefd", {
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
              text: "Frequency of cases by Village(FDSubDate[" + this.fromDate.formatted + " to " + this.toDate.formatted + "]",
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

        resVillageByFD.forEach(element => {
          element.VILLAGE =
          element.VILLAGE.charAt(0).toUpperCase() + element.VILLAGE.slice(1);
          this.villageChartFd.data.labels.push(element.VILLAGE);
          this.villageChartFd.data.datasets[0].data.push(element.VILLAGE_FREQ);
        });
        //  console.log(this.villageChartFd.data.labels);
        //  console.log(this.villageChartFd.data.datasets[0].data);
        this.villageChartFd.update();
      });
    }
  }

  data: any;
  totalCasesChart;
  dataSource0: any;
  displayedCol0: any;
  col0: any[];

  // First Table

  private getBlock2TotalCasesByYearMonthGraph() {
    this.record = this.wildService.getBlock2TotalCasesByYearMonth();
    this.record.subscribe(res => {
      this.data = res;
      console.log(this.data);
      this.data.sort();
      console.log(this.data);
      //this.dataSource0 = this.data;
      this.displayedCol0 = ["YEAR", "MONTH", "TOTAL CASES"];
      this.col0 = this.data;
    });
  }
  dataSource1: any;
  displayedCol1: any;

  col1: any[];
  collection: any[];

  private getBblock2Top20CasesByCatGraph() {
    this.record = this.wildService.getBlock2Top20CasesBycat();
    this.record.subscribe(res => {
      this.data = res;
      //   console.log(this.data);
      //  this.dataSource1 = this.data;
      this.displayedCol1 = ["HWC WSID", "HWC CASE CATEGORY", "CASES"];
      this.col1 = this.data;
    });
  }


  dataSource2: any;
  displayedCol2: any;
  col2: any;
  private getBblock2Top50CasesByWsidGraph() {
    this.record = this.wildService.getBlock2Top50CasesByWsid();
    this.record.subscribe(res => {
      this.data = res;
      //    console.log(this.data);
      //   this.dataSource2 = this.data;
      this.displayedCol2 = ["HWC WSID", "HWC CASES"];
      this.col2 = this.data;
    });
  }

//Top 30 villages for all incidents


  displayedCol33: any=[];
  data33: any=[];
  private getallvillageincidentsbycat() {

   let record = this.wildService.getvillageincidentsbycat();
   record.subscribe(res => {
     let _data = JSON.parse(res.data);
     console.log(_data)
     let i=0;


     _data.forEach(element => {
       element.forEach(ele => {
        ele.HWC_VILLAGE_NAME =
      ele.HWC_VILLAGE_NAME.charAt(0).toUpperCase() + ele.HWC_VILLAGE_NAME.slice(1);
       });
       this.data33[i++] = element;
     });
     console.log(this.data33[0]);
});
this.displayedCol33 = ["VILLAGE NAME","INCIDENT","HWC CATEGORY"];

  }

// Top 30 Ranges all Incidents
displayedCol34: any=[];
data34: any=[];
//private getallrangeincidentsbycat(){

  private getallrangeincidentsbycat() {

    let record = this.wildService.getrangeincidentsbycat();
    record.subscribe(res => {
     let _data1 = JSON.parse(res.data);
     console.log(_data1)
     let i=0;
     _data1.forEach(element => {
      element.forEach(ele => {
        ele.HWC_RANGE =
      ele.HWC_RANGE.charAt(0).toUpperCase() + ele.HWC_RANGE.slice(1);
       });
       this.data34[i++] = element;
     });
     console.log(this.data34[0]);
});
this.displayedCol34 = ["RANGE NAME","INCIDENT","HWC CATEGORY"];
  }


//}


  private getBlock3TopCasesGraph() {
    let _record = this.wildService.getBlock3TopCases();
    _record.subscribe(res => {
      if (res.length > 0) {
        this.block3TopCasesData.byCrop = res[0];
        this.block3TopCasesData.byProperty = res[1];
        this.block3TopCasesData.byLiveStock = res[2];
        this.block3TopCasesData.byVillage = res[3];

        // By Crop
        this.block3ByCropGraphs(this.block3TopCasesData.byCrop);
        // By Property
        this.block3ByPropertyGraphs(this.block3TopCasesData.byProperty);
        // By Livestock
        this.block3ByLiveStockGraphs(this.block3TopCasesData.byLiveStock);
        // By Village
        this.block3ByVillageGraphs(this.block3TopCasesData.byVillage);
      }
    });
  }
  dataSource3: any;
  displayedCol3: any;
  col3: any;
  private block3ByCropGraphs(_data) {
    //  this.dataSource3 = _data;
    this.displayedCol3 = ["CROP NAME", "CROP FREQ"];
    _data.forEach(element => {
      if(element.CROP_NAME !== null)
      element.CROP_NAME =
      element.CROP_NAME.charAt(0).toUpperCase() + element.CROP_NAME.slice(1);
    });

    this.col3 = _data;
  }
  dataSource4: any;
  displayedCol4: any;
  col4: any;
  private block3ByPropertyGraphs(_data) {
    // this.dataSource4 = _data;
    this.displayedCol4 = ["PROPERTY NAME", "PROPERTY FREQ"];
    _data.forEach(element => {
      if(element.PROPERTY_NAME !== null)
      element.PROPERTY_NAME =
      element.PROPERTY_NAME.charAt(0).toUpperCase() + element.PROPERTY_NAME.slice(1);
    });
    this.col4 = _data;
  }
  dataSource5: any;
  displayedCol5: any;
  col5: any;
  private block3ByLiveStockGraphs(_data) {
    // this.dataSource5 = _data;
    this.displayedCol5 = ["LIVESTOCK NAME", "LIVESTOKE FREQ"];
    _data.forEach(element => {
      if(element.CROP_NAME !== null)
      element.LIVESTOCK_NAME =
      element.LIVESTOCK_NAME.charAt(0).toUpperCase() + element.LIVESTOCK_NAME.slice(1);
    });
    this.col5 = _data;
  }
  dataSource6: any;
  displayedCol6: any;
  col6: any;
  private block3ByVillageGraphs(_data) {
    this.dataSource6 = _data;
    this.displayedCol6 = ["VILLAGE NAME", "VILLAGE FREQ"];
    _data.forEach(element => {
      if(element.CROP_NAME !== null)
      element.VILLAGE_NAME =
      element.VILLAGE_NAME.charAt(0).toUpperCase() + element.VILLAGE_NAME.slice(1);
    });
    this.col6 = _data;
    console.log(this.col6);
  }


//Top 30 WSID's for all incidents

  dataSource31: any;
  displayedCol31: any;

  col31: any= [];
  collection31: any[];


  private getincidentsalltablebycat() {
    let rescat: any = [];
    this.record = this.wildService.getwsidincidentsbycat();
    this.record.subscribe(res => {
      //JSON.parse(res.data);
      this.data = JSON.parse(res.data);
      for (let i = 0; i <6; i++) {
          //rescat.push(this.data[i]);

       // console.log(rescat[0]);
      //this.data = res.data[0];
       console.log(this.data[i]);

      //  this.dataSource1 = this.data;

      this.col31[i] = this.data[i];
       }
       this.displayedCol31 = ["HWC WSID", "INCIDENT", "HWC_CASE_CATEGORY"];

  //     console.log(this.col31[0]);
    });
  }

  lineChart1: any;
  displayedCol7: any = [];
  displayedCol8: any = [];
  col7: any = [];
  col8: any = [];

  private getBlock2ByHwcDateFreq() {
    if (this.fromDate !== undefined && this.toDate !== undefined) {
      let _record = this.wildService.getBlock2ByHwcDateFreq(
        this.fromDate.formatted,
        this.toDate.formatted
      );
      let dataArr: any = [];
      let dateArr: any = [];
      _record.subscribe(res => {
        let data = res;
        console.log(data);
        // data.forEach(element => {
        //   dataArr.push(element.DATE_FREQ);
        //   dateArr.push(element.HWC_DATE);
        // });
        // this.col7.push(dateArr);
        // this.col7.push(dataArr);
        // console.log(this.col7);
        this.col7 = data;
        this.displayedCol7 = ["HWC DATE", "FREQUENCY"];
      });
    }
  }

  private getblock2ByFaDateFreq() {
    if (this.fromDate !== undefined && this.toDate !== undefined) {
      let _record = this.wildService.getBlock2ByFaDateFreq(
        this.fromDate.formatted,
        this.toDate.formatted
      );
      let dataArr: any = [];
      let dateArr: any = [];
      _record.subscribe(res => {
        let data = res;
        console.log(data);
        // data.forEach(element => {
        //   dataArr.push(element.DATE_FREQ);
        //   dateArr.push(element.FA_DATE);
        // });
        // console.log(dataArr);
        // console.log(dateArr);

        // this.col8.push(dateArr);
        // this.col8.push(dataArr);
        this.col8 = data;
        this.displayedCol8 = ["FA DATE", "FREQUENCY"];
        //       var months = ['January', 'Febuary', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        //       console.log(dateArr1[0]);
        //       var date = dateArr1[0];
        // var newdate = date.split("-").reverse().join("-");
        //        console.log(newdate);
        //       // console.log(dataArr1);
        //    var newD = new Date(newdate);
        //     console.log(months[newD.getMonth()]);
      });
    }
  }

  lineChart2: any;
}
