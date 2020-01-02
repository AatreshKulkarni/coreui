import { Component, OnInit, ViewChild, ViewEncapsulation } from "@angular/core";
import * as jsPDF from 'jspdf'
import * as html2canvas from 'html2canvas'
import * as $ from 'jquery';
//import saveAs from 'file-saver'
import { saveAs } from 'file-saver'
import { changeDpiDataUrl} from 'changedpi';


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
  ) {
    Chart.defaults.global.plugins.datalabels.anchor = "end";
      Chart.defaults.global.defaultFontStyle = 'Bold'
      Chart.defaults.global.plugins.datalabels.align = "end";
  }

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

selected11: any;
selected31: any;
projYearArr: any = [];
callYearWise(){
  let year = new Date();
  let projYear = new Date();
  //   year.setFullYear(2020);
  //   let curYear = year.getFullYear();
  let curYear = projYear.getFullYear();
  if(projYear.getMonth() >= 6)
  projYear.setFullYear(curYear+1);
  for(let i=2015;i<projYear.getFullYear();i++){
    this.projYearArr.push(i + '-' + (i+1));
}

    this.selected11 = this.projYearArr[this.projYearArr.length-1];
}


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
this.callYearWise();
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
     this.getFAbyDatebyCategory();
     this.getAvgsubByFa(this.selected11);

 // this.getTimeBtwHwcFd(this.selected11);

// End


    this.spinnerService.hide();
  }


dataurl:any;
  downloadImage(data, myImage) {
  /* save as image */
  var link = document.createElement('a');
//  link.href = this.bar.toBase64Image();
  //link.href = data.toBase64Image();
  this.dataurl = data.toBase64Image('image/jpeg');
  // var urldata = this.dataurl.getImageData(0,0,data.width,data.height);
  // var data1 = urldata.data;
  link.href = changeDpiDataUrl(this.dataurl,600);
  // for(var i=0;i<data1.length; i+=4){
  //   alert("for")
  //   if(data1[i+3]<255){
  //     data1[i] = 255;
  //     data1[i+1] = 255;
  //     data1[i+2] = 255;
  //     data1[i+3] = 255;
  //   }
  // }
  link.download = myImage +'.jpeg';
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
    if( data != undefined){
      if(data.length != 0){
this.excelService.exportAsExcelFile(data, name);
     return "success";
  }
  }
    }

  exportdata(){

    this.xlsxReport(this.dataCat, 'Frequency_of_Human-Wildlife_Conflict_Incidents_By_catergory');
    this.xlsxReport(this.dataAnimal, 'Frequency_of_Human-Wildlife_Conflict_Incidents_By_Animal');
    this.xlsxReport(this.dataPark, 'Frequency_of_Human-Wildlife_Conflict_Incidents_By_Park');
    this.xlsxReport(this.dataTaluk, 'Frequency_of_Human-Wildlife_Conflict_Incidents_By_Taluk');
    this.xlsxReport(this.dataRange, 'Frequency_of_Human-Wildlife_Conflict_Incidents_By_Range');
    this.xlsxReport(this.dataVillage, 'Frequency_of_Human-Wildlife_Conflict_Incidents_By_Village' );
    this.xlsxReport(this.dataWsid,'WSID_For_All_Incidents');
    this.xlsxReport(this.data33[6],'Villages_For_All_Incidents');
    this.xlsxReport(this.data34[6],'Ranges_For_All_Incidents');
    this.xlsxReport(this.col2, 'Top_50_Cases_By_Year_Month(HWC)');
    this.xlsxReport(this.col1, 'Top_20_Cases_By_Category(HWC)');
    this.xlsxReport(this.col2, 'Top_50_Cases_By_HWC_ID(HWC)');
    this.xlsxReport(this.col31[0], 'ALL_INCIDENTS_By_CATEGORY(HWC)');
    this.xlsxReport(this.col31[1], 'ALL_INCIDENTS_By_CATEGORY(HWC)');
    this.xlsxReport(this.col31[2], 'ALL_INCIDENTS_By_CATEGORY(HWC)');
    this.xlsxReport(this.col31[3], 'ALL_INCIDENTS_By_CATEGORY(HWC)');
    this.xlsxReport(this.col31[4], 'ALL_INCIDENTS_By_CATEGORY(HWC)');
    this.xlsxReport(this.col31[5], 'ALL_INCIDENTS_By_CATEGORY(HWC)');

    this.xlsxReport(this.col3, 'Top_Cases_Crop(HWC)');
    this.xlsxReport(this.col4, 'Top_Cases_Property(HWC)');
    this.xlsxReport(this.col5, 'Top_Cases_Livestock(HWC)');
    this.xlsxReport(this.col6, 'Top_Cases_Village(HWC)');

    this.xlsxReport(this.data33[6], 'Top_30_Cases_FOR_VILLAGES');
    this.xlsxReport(this.data33[0],'ALL_30_VILAGES_INCIDENTS');
    this.xlsxReport(this.data33[1], 'ALL_INCIDENTS_By_CATEGORY(HWC)');
    this.xlsxReport(this.data33[2], 'ALL_INCIDENTS_By_CATEGORY(HWC)');
    this.xlsxReport(this.data33[3], 'ALL_INCIDENTS_By_CATEGORY(HWC)');
    this.xlsxReport(this.data33[4], 'ALL_INCIDENTS_By_CATEGORY(HWC)');
    this.xlsxReport(this.data33[5], 'ALL_INCIDENTS_By_CATEGORY(HWC)');

    this.xlsxReport(this.data34[6], 'Top_30_Cases_FOR_ALL_RANGES');
    this.xlsxReport(this.data34[0], 'Top_30_Cases_FOR_ALL_RANGES');
    this.xlsxReport(this.data34[1], 'Top_30_Cases_FOR_ALL_RANGES');
    this.xlsxReport(this.data34[2], 'Top_30_Cases_FOR_ALL_RANGES');
    this.xlsxReport(this.data34[3], 'Top_30_Cases_FOR_ALL_RANGES');
    this.xlsxReport(this.data34[4], 'Top_30_Cases_FOR_ALL_RANGES');
    this.xlsxReport(this.data34[5], 'Top_30_Cases_FOR_ALL_RANGES');

    this.xlsxReport(this.monthwiseDatahwc[0], 'HWC Total Processed Days In July By_Category' +
'('+this.selected11+')');
this.xlsxReport(this.monthwiseDatahwc[1], 'HWC Total Processed Days In August By_Category' +
'('+this.selected11+')');
this.xlsxReport(this.monthwiseDatahwc[2], 'HWC Total Processed Days In September By_Category' +
'('+this.selected11+')');
this.xlsxReport(this.monthwiseDatahwc[3], 'HWC Total Processed Days In October By_Category' +
'('+this.selected11+')');
this.xlsxReport(this.monthwiseDatahwc[4], 'HWC Total Processed Days In November By_Category' +
'('+this.selected11+')');
this.xlsxReport(this.monthwiseDatahwc[5], 'HWC Total Processed Days In December By_Category' +
'('+this.selected11+')');
this.xlsxReport(this.monthwiseDatahwc[6], 'HWC Total Processed Days In January By_Category' +
'('+this.selected11+')');
this.xlsxReport(this.monthwiseDatahwc[7], 'HWC Total Processed Days In February By_Category' +
'('+this.selected11+')');
this.xlsxReport(this.monthwiseDatahwc[8], 'HWC Total Processed Days In March By_Category' +
'('+this.selected11+')');
this.xlsxReport(this.monthwiseDatahwc[9], 'HWC Total Processed Days In April By_Category' +
'('+this.selected11+')');
this.xlsxReport(this.monthwiseDatahwc[10], 'HWC Total Processed Days In May By_Category' +
'('+this.selected11+')');
this.xlsxReport(this.monthwiseDatahwc[11], 'HWC Total Processed Days In June By_Category' +
'('+this.selected11+')');


  }

  exportdatadaterang(){
    this.xlsxReport(this.dataCatBydate, 'Frequency_of_Human-Wildlife_Conflict_Incidents_By_date_Occurance_By_Category');
    this.xlsxReport(this.dataAnimalBydate, 'Frequency_of_Human-Wildlife_Conflict_Incidents_By_date_Occurance_By_Animal');
    this.xlsxReport(this.dataParkBydate, 'Frequency_of_Human-Wildlife_Conflict_Incidents_By_date_Occurance_By_Park');
    this.xlsxReport(this.dataTalukBydate, 'Frequency_of_Human-Wildlife_Conflict_Incidents_By_date_Occurance_By_Taluk');
    this.xlsxReport(this.dataRangeBydate, 'Frequency_of_Human-Wildlife_Conflict_Incidents_By_date_Occurance_By_Range');
    this.xlsxReport(this.dataVillageBydate, 'Frequency_of_Human-Wildlife_Conflict_Incidents_By_date_Occurance_By_Village');

    this.xlsxReport(this.dataCatByFd, 'Frequency_of_Human-Wildlife_Conflict_Incidents_By_date_Date_Of_case_Submission_By_category');
    this.xlsxReport(this.dataAnimalByFd, 'Frequency_of_Human-Wildlife_Conflict_Incidents_By_date_Date_Of_case_Submission_By_Animal');
    this.xlsxReport(this.dataParkByFd, 'Frequency_of_Human-Wildlife_Conflict_Incidents_By_date_Date_Of_case_Submission_By_Park');
    this.xlsxReport(this.dataTalukByFd, 'Frequency_of_Human-Wildlife_Conflict_Incidents_By_date_Date_Of_case_Submission_By_Taluk');
    this.xlsxReport(this.dataRangeByFd, 'Frequency_of_Human-Wildlife_Conflict_Incidents_By_date_Occurance_By_Range');
    this.xlsxReport(this.villageChartFd,'Cases by Village by case submission');
    this.xlsxReport(this.col7, 'HWC_Date_Freq(HWC)');
    this.xlsxReport(this.col8, 'FA_Date_Freq(HWC)');
    this.xlsxReport(this.dataFA[0], 'FA Cases By Date(CropLoss)');
     this.xlsxReport(this.dataFA[1], 'FA Cases By Date(CropLoss & Property Loss)');
      this.xlsxReport(this.dataFA[2], 'FA Cases By Date(Property Loss)');
       this.xlsxReport(this.dataFA[3], 'FA Cases By Date(Livestock Predation)');
        this.xlsxReport(this.dataFA[4], 'FA Cases By Date(Human Injury)');
         this.xlsxReport(this.dataFA[5], 'FA Cases By Date(Human Death)');
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
    this.getblock2ByFaDateFreq();
    this.getBlock2ByHwcDateFreq();
    this.getFAbyDatebyCategory();
    this.getFAByHWCCases();
    }
     else{
      this.buttonName = "Date Range";
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
        this.getFAbyDatebyCategory();
        this.getAvgsubByFa(this.selected11);
      // this.getAvgsubByFa(this.selected31);
     }

  }

  onSubmit(fDate, tDate) {
    this.fromDate = fDate;
    this.toDate = tDate;
    //   this.toShow = true;

    this.block1ByHwcDate();
    this.block1HwcCasesByFDSubDateGraph();
    this.getblock2ByFaDateFreq();
    this.getBlock2ByHwcDateFreq();
    this.getFAbyDatebyCategory();
    this.getFAByHWCCases();
   // this.getAvgsubByFa(this.selected31);
   // this.block1HwcCasesByDateGraph();

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
    let record = this.wildService.getHwcGetBlock1();

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


    record.subscribe(res => {
      this.dataCat = res[0];


      this.dataCat = this.dataCat.reduce(function(r, a) {
        r[a.CATEGORY] = r[a.CATEGORY] || [];
        r[a.CATEGORY].push(a);
        return r;
    }, Object.create(null));

    //console.log(this.dataCat);
    let data : any = Object.values(this.dataCat);
    let labels: any = Object.keys(this.dataCat);
    console.log(this.dataCat);


    // labels.map(res => {
    //   switch (res) {
    //     case 'CR':
    //       labels[0] = "Crop Loss"
    //       break;
    //       case 'CRPD':
    //       labels[1] = "Crop & Property Loss"
    //       break;
    //       case 'PD':
    //       labels[2] = "Property Loss"
    //       break;
    //       case 'LP':
    //       labels[3] = "Livestock"
    //       break;
    //       case 'HI':
    //       labels[4] = "Human Injury"
    //       break;
    //       case 'HD':
    //       labels[5] = "Human Death"
    //       break;
    //       case null:
    //         labels[6] = "null"
    //         break;
    //     default:
    //       break;
    //   }
    // })
      let colors = ['#009A21','#E75F1D', '#FFBF00', '#1D42E7', '#E71D36', '#9A3200'];
      this.catChart = new Chart("category", {
        type: "bar",
        data: {
          labels: labels,
          datasets: [
            // {
            //   backgroundColor: colors,
            //   label: "frequency",
            //   data: [this.dataCat[0].CAT_FREQ,this.dataCat[1].CAT_FREQ,this.dataCat[2].CAT_FREQ,this.dataCat[3].CAT_FREQ,this.dataCat[4].CAT_FREQ, this.dataCat[5].CAT_FREQ]
            // }
            {
              data: [],
              backgroundColor: "#ffbf00",
              "borderWidth":1,
              label: 'Bandipur',
              file: false
            },
            {
              data: [],
              backgroundColor: "#e71d36",
              "borderWidth":1,
              label: 'Nagarahole',
              file: false
            },
            {
              data: [],
              backgroundColor: "#226688",
              "borderWidth":1,
              label: 'Null',
              file: false
            }
          ]
        },
        options: {
          title: {
            text: "Frequency of Human-Wildlife Conflict Incidents by HWC category",
            display: true
          },
          legend: {

            onClick: null
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
    for(let i=0; i< data.length; i++){
      data[i].forEach(element => {
        if(element.PARK === "bandipur")
       this.catChart.data.datasets[0].data[i]=element.CAT_FREQ;
       else if(element.PARK === "nagarahole")
       this.catChart.data.datasets[1].data[i]=element.CAT_FREQ;
       else{
         this.catChart.data.datasets[2].data[i] = element.CAT_FREQ;
       }
      });
    }
      //
      //
      this.catChart.update();

      this.dataAnimal = res[1];

      this.dataAnimal = this.dataAnimal.filter(res => res.ANIMAL!==null);
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
        element.ANIMAL !== null ? element.ANIMAL.charAt(0).toUpperCase() + element.ANIMAL.slice(1): element.ANIMAL;
        this.animalChart.data.labels.push(element.ANIMAL);
        this.animalChart.data.datasets[0].data.push(element.ANIMAL_FREQ);
      });
      //
      //
      this.animalChart.update();

      this.dataPark = res[2];

      this.dataPark = this.dataPark.filter(res=>res.PARK!==null);
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
        element.PARK !== null ? element.PARK.charAt(0).toUpperCase() + element.PARK.slice(1):  element.PARK;
        this.parkChart.data.labels.push(element.PARK);
        this.parkChart.data.datasets[0].data.push(element.PARK_FREQ);
      });
      //
      //
      this.parkChart.update();

      this.dataTaluk = res[3];
      this.dataTaluk = this.dataTaluk.filter(res => res.TALUK!==null);
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
       //
       //
        element.TALUK =
        element.TALUK !== null ? element.TALUK.charAt(0).toUpperCase() + element.TALUK.slice(1): element.TALUK;
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

        this.talukChart.data.labels.push(element.TALUK);
        this.talukChart.data.datasets[0].data.push(element.TALUK_FREQ);

      });
      //
      this.talukChart.update();

      this.dataRange = res[4];
      this.dataRange = this.dataRange.filter(res => res.HWC_RANGE);
      this.rangeChart = new Chart("range", {
        type: "bar",
        data: {
          labels: [],
          datasets: [
            {
              backgroundColor: "#E71D36",
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
        element.HWC_RANGE !== null ? element.HWC_RANGE.charAt(0).toUpperCase() + element.HWC_RANGE.slice(1):element.HWC_RANGE;
        if (element.HWC_RANGE === "Hdkote")
        {
         element.HWC_RANGE = this.change();
      //   var str1 = "Hdkote";
      //   var newStr = [str1.slice(0, 2), str1.slice(2)].join(' ');
      //
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
      this.dataVillage = this.dataVillage.filter(res=> res.VILLAGE!==null);
      this.result
          .sort(function(a, b) {
            return a.VILLAGE_FREQ - b.VILLAGE_FREQ;
          })
          .reverse();

        for (let i = 0; i < 20; i++) {
          resVillage.push(this.result[i]);
        }

      this.villageChart = new Chart("village", {
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
        element.VILLAGE !== null ? element.VILLAGE.charAt(0).toUpperCase() + element.VILLAGE.slice(1):element.VILLAGE;
        this.villageChart.data.labels.push(element.VILLAGE);
        this.villageChart.data.datasets[0].data.push(element.VILLAGE_FREQ);
      });
      //
      //
      this.villageChart.update();
    });
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




  categoryArrByHwcDate: any = [];
  result;
  catChartByHwc;
  parkChartByHwc;
  talukChartByHwc;
  rangeChartByHwc;
  villageChartByHwc;
 result1;


 dataCatBydate: any = [];
  dataAnimalBydate: any = [];
  dataParkBydate: any = [];
  dataTalukBydate: any = [];
  dataRangeBydate: any = [];
  dataVillageBydate: any = [];


  // Second Graph

  private block1ByHwcDate() {
    let record = this.wildService.getHwcCasesByHwcDate(
      this.fromDate.formatted,
      this.toDate.formatted
    );

    record.subscribe(res => {
      let dataCatBydate = res[0];
      this.dataCatBydate = res[1];

      let colors = ['#009A21','#E75F1D', '#FFBF00', '#1D42E7', '#E71D36', '#9A3200'];
this.result1 = dataCatBydate;


      if (this.catChartByHwc !== undefined) {
        this.catChartByHwc.destroy();
      }

      this.catChartByHwc = new Chart("categorybyhwc", {
        type: "bar",
        data: {
          labels: [],
          datasets: [
            {
              backgroundColor: colors,
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
      //
      this.result1.forEach(element => {
        element.CATEGORY =
        element.CATEGORY.charAt(0).toUpperCase() + element.CATEGORY.slice(1);
        this.catChartByHwc.data.labels.push(element.CATEGORY);
        this.catChartByHwc.data.datasets[0].data.push(element.CAT_FREQ);
      });
      //
      //

      this.catChartByHwc.update();

      // Animal

      this.dataAnimalBydate = res[2];
      this.result = this.dataAnimalBydate
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
      //
      this.result.forEach(element => {
        element.ANIMAL =
        element.ANIMAL.charAt(0).toUpperCase() + element.ANIMAL.slice(1);
        this.animalChartByHwc.data.labels.push(element.ANIMAL);
        this.animalChartByHwc.data.datasets[0].data.push(element.ANIMAL_FREQ);
      });
      //
      //
      this.animalChartByHwc.update();

      // Park

      this.dataParkBydate = res[3];
      this.result = this.dataParkBydate
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
      //
      //
      this.parkChartByHwc.update();

      // Taluk

      this.dataTalukBydate = res[4];
      this.result = this.dataTalukBydate
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
        this.talukChartByHwc.data.labels.push(element.TALUK);
        this.talukChartByHwc.data.datasets[0].data.push(element.TALUK_FREQ);
      });
      //
      //
      this.talukChartByHwc.update();

      // Range

                this.dataRangeBydate = res[5];
      this.result = this.dataRangeBydate
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
              backgroundColor: "#E71D36",
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
      //
      //
      this.rangeChartByHwc.update();

      //      Village
      let resVillageByHWC: any = [];

      this.dataVillageBydate = res[6];
      this.result = this.dataVillageBydate
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


      if (this.villageChartByHwc !== undefined) {
        this.villageChartByHwc.destroy();
      }

      this.villageChartByHwc = new Chart("villagebyhwc", {
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

        element.VILLAGE =
          element.VILLAGE.charAt(0).toUpperCase() + element.VILLAGE.slice(1);
        this.villageChartByHwc.data.labels.push(element.VILLAGE);
        this.villageChartByHwc.data.datasets[0].data.push(element.VILLAGE_FREQ);
      }
      });
      //
      //
      this.villageChartByHwc.update();
    });
  }
// For All Incidents by WSID

private getincidentsallwsid(){
  let record = this.wildService.getincidentsall();
  record.subscribe(res =>
  {

 this.dataWsid = res[0];
//
//  this.dataAnimal = res[1];
     // var canvas = $('#wsidin').get(0) as HTMLCanvasElement;
    //
      this.wsidchart = new Chart('wsidin', {
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
      //
      //
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

faByHWCCases: any = [];
dispColByFA: any;
getFAByHWCCases(){
  let record = this.wildService.getFAByHWCCaseFrequency(this.fromDate.formatted, this.toDate.formatted);
  record.subscribe(res => {
    console.log(res);
    if(res.length > 0){
    this.faByHWCCases = res;
    this.faByHWCCases.forEach(element => {
      element.FA_NAME =
         element.FA_NAME.charAt(0).toUpperCase() + element.FA_NAME.slice(1);});
  }
    this.dispColByFA = ["Field Assistant", "Frequency"];
  });
}

// downloadImage(idt){
// var canvas =  $(idt).get(0) as HTMLCanvasElement;
//
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

    let _data = res[1];

    this.data33[6] = _data;
    this.displayedCol35 = ["VILLAGE NAME", "INCIDENT"]
    this.allVill= new Chart("inVil" , {
    type: 'bar',
    data:{
      labels: labelNames,
      datasets: [
        {
          data: [],
          backgroundColor: "#FFBF00",
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

    let _data = res[2];

    this.data34[6] = _data;
    this.displayedCol36 = ["HWC_RANGE", "INCIDENT"]
    this.allRange= new Chart("inRange" , {
    type: 'bar',
    data:{
      labels: labelNames,
      datasets: [
        {
          data: [],
          backgroundColor: "#E71D36",
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
    element.HWC_RANGE !==null? element.HWC_RANGE.charAt(0).toUpperCase() + element.HWC_RANGE.slice(1):element.HWC_RANGE;
     if (element.HWC_RANGE === "Hdkote")
        {
         element.HWC_RANGE = this.change();
      //   var str1 = "Hdkote";
      //   var newStr = [str1.slice(0, 2), str1.slice(2)].join(' ');
      //
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
data6:any;

private getblock2allcasesprojectyear(){
    let record: any = [];
  let labelNames: any = []
  this.result5.subscribe(res => {

//  let  data6 = res.data;
  this.data6 = JSON.parse(res.data);

  let i = 0;
  this.data6.forEach(element => {

     record[i++] = element.reduce((sum, item) => sum + item.TOTAL_CASES, 0);
     labelNames.push("Project Year"  + "(20" + (15+(i-1)) + ("-"+ (15+ i)+")"));
    //
    });

//this.record = record;

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
      text: "All Cases By Project Year",
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
//
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
    let record = this.wildService.getHwcCasesByFDSubDate(
        this.fromDate.formatted,
        this.toDate.formatted
      );
    record.subscribe(res => {

        this.dataCatByFd = res[1];
        let colors = ['#009A21','#E75F1D', '#FFBF00', '#1D42E7', '#E71D36', '#9A3200'];
      let dataCat = res[0];
    let resultCat = dataCat;

        if (this.catChartFd !== undefined) {
          this.catChartFd.destroy();
        }

        this.catChartFd = new Chart("catfd", {
          type: "bar",
          data: {
            labels: [],
            datasets: [
              {
                backgroundColor: colors,
                label: "frequency",
                data: []
              }
            ]
          },
          options: {
            title: {
              text: "Frequency of cases by HWC category(FDSubDate) [" + this.fromDate.formatted + " to " + this.toDate.formatted + "]",
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
        //
        resultCat.forEach(element => {
          element.CATEGORY =
          element.CATEGORY.charAt(0).toUpperCase() + element.CATEGORY.slice(1);
          this.catChartFd.data.labels.push(element.CATEGORY);
          this.catChartFd.data.datasets[0].data.push(element.CAT_FREQ);
        });
        //
        //

        this.catChartFd.update();

        // Animal

        this.dataAnimalByFd = res[2];
        let resultAnimal = this.dataAnimalByFd
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
        //
        resultAnimal.forEach(element => {
          element.ANIMAL =
          element.ANIMAL.charAt(0).toUpperCase() + element.ANIMAL.slice(1);
          this.animalChartFd.data.labels.push(element.ANIMAL);
          this.animalChartFd.data.datasets[0].data.push(element.ANIMAL_FREQ);
        });
        //
        //
        this.animalChartFd.update();

        // Park

        this.dataParkByFd = res[3];
        let resultPark = this.dataParkByFd
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

        resultPark.forEach(element => {
          element.PARK =
          element.PARK.charAt(0).toUpperCase() + element.PARK.slice(1);
          this.parkChartFd.data.labels.push(element.PARK);
          this.parkChartFd.data.datasets[0].data.push(element.PARK_FREQ);
        });
        //
        //
        this.parkChartFd.update();

        // Taluk

        this.dataTalukByFd = res[4];
      let  resultTaluk = this.dataTalukByFd
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

        resultTaluk.forEach(element => {
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
          this.talukChartFd.data.labels.push(element.TALUK);
          this.talukChartFd.data.datasets[0].data.push(element.TALUK_FREQ);
        });
        //
        //
        this.talukChartFd.update();

        // Range

                  this.dataRangeByFd = res[5];
        let resultRange = this.dataRangeByFd
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
                backgroundColor: "#E71D36",
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

        resultRange.forEach(element => {
          element.HWC_RANGE =
          element.HWC_RANGE.charAt(0).toUpperCase() + element.HWC_RANGE.slice(1);
          this.rangeChartFd.data.labels.push(element.HWC_RANGE);
          this.rangeChartFd.data.datasets[0].data.push(element.RANGE_FREQ);
        });
        //
        //
        this.rangeChartFd.update();

        //      Village
        let resVillageByFD: any = [];

        this.dataVillageByFd = res[6];
        let resultVillage = this.dataVillageByFd
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

        //
        resultVillage
          .sort(function(a, b) {
            return a.VILLAGE_FREQ - b.VILLAGE_FREQ;
          })
          .reverse();

        for (let i = 0; i < 20; i++) {
          resVillageByFD.push(resultVillage[i]);
        }


        if (this.villageChartFd !== undefined) {
          this.villageChartFd.destroy();
        }

        this.villageChartFd = new Chart("villagefd", {
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
        //
        //
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
    let record = this.wildService.getBlock2TotalCasesByYearMonth();
    record.subscribe(res => {
      this.data = res;

      this.data.sort();

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
    let record = this.wildService.getBlock2Top20CasesBycat();
    record.subscribe(res => {
      this.data = res;

      //  this.dataSource1 = this.data;
      this.displayedCol1 = ["HWC WSID", "HWC CASE CATEGORY", "CASES"];
      this.col1 = this.data;
    });
  }


  dataSource2: any;
  displayedCol2: any;
  col2: any;
  private getBblock2Top50CasesByWsidGraph() {
    let record = this.wildService.getBlock2Top50CasesByWsid();
    record.subscribe(res => {
      this.data = res;
      //
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

     let i=0;


     _data.forEach(element => {
       element.forEach(ele => {
        ele.HWC_VILLAGE_NAME =
      ele.HWC_VILLAGE_NAME.charAt(0).toUpperCase() + ele.HWC_VILLAGE_NAME.slice(1);
       });
       this.data33[i++] = element;
     });

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

     let i=0;
     _data1.forEach(element => {
      element.forEach(ele => {
      ele.HWC_RANGE =
      ele.HWC_RANGE !== null ? ele.HWC_RANGE.charAt(0).toUpperCase() + ele.HWC_RANGE.slice(1): ele.HWC_RANGE;
       });
       this.data34[i++] = element;
     });

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
      element.CROP_NAME !== null ? element.CROP_NAME.charAt(0).toUpperCase() + element.CROP_NAME.slice(1):element.CROP_NAME;
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
      element.PROPERTY_NAME ? element.PROPERTY_NAME.charAt(0).toUpperCase() + element.PROPERTY_NAME.slice(1) : element.PROPERTY_NAME;
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
      element.LIVESTOCK_NAME ? element.LIVESTOCK_NAME.charAt(0).toUpperCase() + element.LIVESTOCK_NAME.slice(1): element.LIVESTOCK_NAME;
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
      element.VILLAGE_NAME ? element.VILLAGE_NAME.charAt(0).toUpperCase() + element.VILLAGE_NAME.slice(1):element.VILLAGE_NAME;
    });
    this.col6 = _data;

  }


//Top 30 WSID's for all incidents

  dataSource31: any;
  displayedCol31: any;

  col31: any= [];
  collection31: any[];


  private getincidentsalltablebycat() {
    let rescat: any = [];
    let record = this.wildService.getwsidincidentsbycat();
    record.subscribe(res => {
      //JSON.parse(res.data);
      this.data = JSON.parse(res.data);
      for (let i = 0; i <6; i++) {
          //rescat.push(this.data[i]);

       //
      //this.data = res.data[0];


      //  this.dataSource1 = this.data;

      this.col31[i] = this.data[i];
       }
       this.displayedCol31 = ["HWC WSID", "INCIDENT", "HWC_CASE_CATEGORY"];

  //
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

        // data.forEach(element => {
        //   dataArr.push(element.DATE_FREQ);
        //   dateArr.push(element.HWC_DATE);
        // });
        // this.col7.push(dateArr);
        // this.col7.push(dataArr);
        //
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

        // data.forEach(element => {
        //   dataArr.push(element.DATE_FREQ);
        //   dateArr.push(element.FA_DATE);
        // });
        //
        //

        // this.col8.push(dateArr);
        // this.col8.push(dataArr);
        this.col8 = data;
        this.displayedCol8 = ["FA DATE", "FREQUENCY"];
        //       var months = ['January', 'Febuary', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        //
        //       var date = dateArr1[0];
        // var newdate = date.split("-").reverse().join("-");
        //
        //       //
        //    var newD = new Date(newdate);
        //
      });
    }
  }

  lineChart2: any;
  dataFA : any = [];
  displayedColFA: any = [];
  getFAbyDatebyCategory(){
    let result = this.wildService.getFAbyDatebyCat(this.fromDate.formatted, this.toDate.formatted);
    result.subscribe(res=> {

      let record: any[] = res.reduce(function (r, a) {
        r[a.CATEGORY] = r[a.CATEGORY] || [];
        r[a.CATEGORY].push(a);
        return r;
    },Object.create(null));


    let i = 0;
    Object.values(record).forEach(element => {
      element.forEach(ele => {
       ele.FA_NAME =
     ele.FA_NAME.charAt(0).toUpperCase() + ele.FA_NAME.slice(1);
      });
      this.dataFA[i++] = element;
    });


    this.displayedColFA = ["FA NAME","CATEGORY","CASES"];
  });


}

timeBtwHwcFdhwc: any = [];
monthwiseDatahwc: any = [];
tableHeaderhwc: any = [];
getAvgsubByFa(projYear){
  let data = projYear.split('-');
  let result = this.wildService.getAvgSubByFA(data[0], data[1]);
  result.subscribe(res => {

    this.timeBtwHwcFdhwc = res;
    //
    let result = this.timeBtwHwcFdhwc.reduce(function (r, a) {
      r[a.month_s] = r[a.month_s] || [];
      r[a.month_s].push(a);
      return r;
  }, Object.create(null));

  //
   let i = 0;
  // this.tableHeader = Object.keys(res.data[0])
Object.values(result).forEach(element => {
  this.monthwiseDatahwc[i++]  = element;
});

console.log(this.monthwiseDatahwc);
this.tableHeaderhwc = ['Field Assistant','Month','Year','Total Cases','Total(in days)','Average(in days)', 'Max(in days)', 'Min(in days)', 'Standard Deviation']
  });
}

    timeBtwHwcFd: any = [];
monthwiseData: any = [];
tableHeader: any = [];
getTimeBtwHwcFd(projYear){
  let data = projYear.split('-');
  let result = this.wildService.getTimeBtwHWCFD(data[0], data[1]);
  result.subscribe(res => {

    this.timeBtwHwcFd = res.data;

    let result = this.timeBtwHwcFd.reduce(function (r, a) {
      r[a.Month_s] = r[a.Month_s] || [];
      r[a.Month_s].push(a);
      return r;
  }, Object.create(null));

  //
   let i = 0;
   this.tableHeader = Object.keys(res.data[0])
Object.values(result).forEach(element => {
  this.monthwiseData[i++]  = element;
});

  });
}
}
