import { Component, OnInit, ViewChild } from '@angular/core';
import { Chart } from 'chart.js';
import { MatTableDataSource, MatPaginator } from '@angular/material';


import * as $ from 'jquery';
import { saveAs } from 'file-saver';
import { zingchart } from 'zingchart';


import {IMyDpOptions, IMyDate} from 'mydatepicker';
import { ConnectorService } from '../../services/connector.service';
import { ExcelService } from "../../services/excel.service";
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {



  public toDate;
  public fromDate;


  chartType = 'both';

  public myDatePickerOptions: IMyDpOptions = {
    // other options...
    dateFormat: 'yyyy-mm-dd',
};


  title: string = 'My first AGM project';
  lat: number = 51.678418;
  lng: number = 7.809007;

  constructor(private wildService: ConnectorService, private excelService: ExcelService,) {

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
                                month:  d.getMonth() + 11,
                                day: d.getDate()},
                              formatted: d.getFullYear()-1+"-"+('0' + (d.getMonth() + 11)).slice(-2)+"-"+('0' + (d.getDate())).slice(-2)};
                             }

                          }
  yearArr:any = [];
  projYearArr: any = [];

selected: any;
selected1: any;
selected2: any;
selected3: any;
selected4: any;
selected5: any;
selected6: any;
selected7: any;
selected8: any;
selected9: any;
selected10: any;
selected11: any;
selected12: any;
selected13: any;
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

     for(let i=2015;i<=year.getFullYear();i++){
           this.yearArr.push(i);
       }
       this.selected = this.yearArr[this.yearArr.length-1];
       this.selected1 = this.yearArr[this.yearArr.length-1];
       this.selected2 = this.yearArr[this.yearArr.length-1];
       this.selected3 = this.yearArr[this.yearArr.length-1];
       this.selected4 = this.projYearArr[this.projYearArr.length-1];
       this.selected5 = this.projYearArr[this.projYearArr.length-1];
       this.selected6 = this.projYearArr[this.projYearArr.length-1];
       this.selected7 = this.projYearArr[this.projYearArr.length-1];
       this.selected8 = this.projYearArr[this.projYearArr.length-1];
       this.selected9 = this.projYearArr[this.projYearArr.length-1];
      this.selected10 = this.projYearArr[this.projYearArr.length-1];
      this.selected11 = this.projYearArr[this.projYearArr.length-1];
      this.selected12 = this.projYearArr[this.projYearArr.length-1];
      this.selected13 = this.projYearArr[this.projYearArr.length-1];
  }

  ngOnInit() {
  //  this.barGraph();
  //  this.barGraph2();



    this.getDateRange();
    this.callYearWise();

     this.categoryByYear(this.selected1);
    this.casesByYearByMonth(this.selected2);
  this.parkByMonthYear(this.selected3);
  this.projectYearByCatByPark(this.selected4);
     this.casesByProjYear();
    this.topVillages();
     this.parkYearWise();
  this.topVillagesByCat();
    //  this.parkYearWiseByCat();
   this.casesCatByYear();
  this.casesByRangeByYear(this.selected);
   this.projectYearByPark();
   this.projectYearByCat();
    this.prevDayBpNh();
    this.block1Graph();
   this.getallCompensation();
this.getCompensationbyProjectYearbyCategry(this.selected7);
 this.getCompensationbyCategoryprojectYr(this.selected8);
this.getCompensationByprojectYearbySheet(this.selected6);
this.getCompensationbyprojectyear(this.selected5);
this.getCompbyProjYearByCatInSheet(this.selected9);
this.getTimeBtwHwcFd(this.selected11);
this.getTotalAvgTimeBtwHWCDateFDDate(this.selected12);
this.getAvgTimeBtwHwcFd(this.selected10);
 this.getCatProjYearByMonthByPark(this.selected13);
 this.getCompFilterAll();
//   this.boxplotgraph();
  //   this.topVillages();
  //   this.casesByYear();
  //    this.parkYearWise();
  //  this.categoryByYear();
  // this.topVillagesByCat();
  //    this.parkYearWiseByCat();
  // this.casesCatByYear();
  // this.casesByRangeByYear();
//  this.casesByYear(this.selected2);
  // this.projectYearByPark();
  // this.projectYearByCat();
  //  this.projectYearByCatByPark();
  // this.allBpNhByDate();
  // this.prevDayBpNh();
//   this.allBpNhByDate();
   // this.yearByMonthByPark();
  //   this.lineGraph(this.fromDate, this.toDate);
  // this.lineGraph2(this.fromDate, this.toDate);
  // this.lineGraph3(this.fromDate,this.toDate);
  // this.lineGraph4(this.fromDate,this.toDate);
//  this.getTable1();
}


showByMonth: boolean = false;
showByCat: boolean = false;
showByCatMonth: boolean = false;

showMainContent: boolean = false;

  buttonName: any = "Date Range"

  showHideButton() {
    if(this.showMainContent = !this.showMainContent){
      this.buttonName = "All Cases";
      this.allBpNhByDate();
      this.getCompensationbyDate();
      this.getcompensationbycategory();
      this.getcompensationprocesseddays();
      this.getcompensationtotalprocessedays();
      this.getCompensationtotalProcesseddaysbycategory();
      this.getCasesDCvsHwc();
      this.getCasesDCvsHwcByCat();
    }
     else{
      this.buttonName = "Date Range";
      this.categoryByYear(this.selected1);
      this.casesByYearByMonth(this.selected2);
    this.parkByMonthYear(this.selected3);
    this.projectYearByCatByPark(this.selected4);
       this.casesByProjYear();
      this.topVillages();
       this.parkYearWise();
    this.topVillagesByCat();
  //      this.parkYearWiseByCat();
     this.casesCatByYear();
    this.casesByRangeByYear(this.selected);
     this.projectYearByPark();
     this.projectYearByCat();
     this.block1Graph();
      this.prevDayBpNh();
     this.getallCompensation();
  this.getCompensationbyProjectYearbyCategry(this.selected7);
   this.getCompensationbyCategoryprojectYr(this.selected8);
  this.getCompensationByprojectYearbySheet(this.selected6);
  this.getCompensationbyprojectyear(this.selected5);
  this.getCompbyProjYearByCatInSheet(this.selected9);
  this.getTimeBtwHwcFd(this.selected11);
  this.getAvgTimeBtwHwcFd(this.selected10);
  this.getTotalAvgTimeBtwHWCDateFDDate(this.selected12);
   this.getCatProjYearByMonthByPark(this.selected13);
   this.getCompFilterAll();
  //this.getAvgTimeBtwHwcFd(this.selected10);
     }

  }

  onSubmit(fDate, tDate){
    this.fromDate=fDate;
    this.toDate=tDate;

    this.allBpNhByDate();
    this.getCompensationbyDate();
    this.getcompensationbycategory();
    this.getcompensationprocesseddays();
    this.getcompensationtotalprocessedays();
    this.getCompensationtotalProcesseddaysbycategory();
    this.getCasesDCvsHwc();
    this.getCasesDCvsHwcByCat();
    // this.lineGraph(this.fromDate, this.toDate);
    // this.lineGraph2(this.fromDate,this.toDate);
    // this.lineGraph3(this.fromDate,this.toDate);
    // this.lineGraph4(this.fromDate,this.toDate);
  }

  dataSet: any;
  lineChart = [];
  barChart = [];
  record: any;


   result1 = this.wildService.getTotalCasesByProject();
  //  result2 = this.wildService.getCasesByYear();
   result3 = this.wildService.getTopVillages();
   result4 = this.wildService.getParkYearwise();
   result5 = this.wildService.getTopVillagesByCat();
   result6 = this.wildService.getParkCatByProject();
   result7 = this.wildService.getparkCatYearwise();

   result9 = this.wildService.getBpNhProjectYear();
  result10 = this.wildService.getCatProjectYear();

  // result12 = this.wildService.getParkByMonthYear();
  result14 = this.wildService.getPrevDayBpNh();

  result13: any;

  barYearChartByPark: any ;
  dataByPark: any;
  parkByMonthYear(data){
   let  result15 = this.wildService.getParkByMonthYear(data);
    result15.subscribe(res => {

      this.dataByPark = res.data;
    //   let result = res.data.reduce(function (r, a) {
    //     r[a.Year_s] = r[a.Year_s] || [];
    //     r[a.Year_s].push(a);
    //     return r;
    // }, Object.create(null));
    // let labelArr: any[] = [];
    // let data: any = [];
    // let barChart: any = [];
    //
    // //
    // let len = Object.keys(result).length

    // for(let i=0; i < len; i++){
      // data[i] = Object.values(result)[i];

        //
  let labelsArr = []
 // labelArr = labelArr.filter((el, i, a) => i === a.indexOf(el))
  // uniq = Array.from(new Set(labelsArr));
//
      if(this.barYearChartByPark !=undefined ){
        this.barYearChartByPark.destroy();
      }

      this.barYearChartByPark= new Chart("barYearChartByPark" , {
        type: 'bar',
        data:{
          labels: [],
          datasets: [
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
            }

          ]
        },

        options: {
          title: {
            text: "Monthly Frequency of Human-Wildlife Conflict Incidents by Year by Park(" + this.selected3 + ")",
            display: true
          },
          legend: {

            onClick: null
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

      this.dataByPark.forEach(element => {

      //  labelArr[i].push(element.Month_s);
        //   if(!this.barYearChartByPark[i].data.labels.contains(element.Month_s)){
        //   this.barYearChartByPark[i].data.labels.push(element.Month_s);
        // }
        if (this.barYearChartByPark.data.labels.includes(element.MONTH) === false) this.barYearChartByPark.data.labels.push(element.MONTH);
        if(element.HWC_PARK_NAME === "bandipur")
        this.barYearChartByPark.data.datasets[0].data.push(element.NO_OF_CASES);
        else if(element.HWC_PARK_NAME === "nagarahole")
        this.barYearChartByPark.data.datasets[1].data.push(element.NO_OF_CASES);

      });
      // setTimeout(() => {
      //   barChart2015.update();
      // }, 2000);
    //  barChart[i].update();
  //
   // labelArr  = this.barYearChartByPark[i].data.labels;
  //  labelArr = labelArr.filter((el, i, a) => i === a.indexOf(el));
  //
    this.barYearChartByPark.update();
  // }
  //
  //  labelArr  = this.barYearChartByPark[0].data.labels;
  //
  // labelArr = labelArr.filter((el, i, a) => i === a.indexOf(el))
  //

    });
  }

  categoryArr: any = [];
  dataCat: any = [];
  dataAnimal: any = [];
  dataPark: any = [];
  dataTaluk: any = [];
  dataRange: any = [];
  dataVillage: any = [];

  dataCatAll: any = [];
  dataAnimalAll: any = [];
  dataParkAll: any = [];
  dataTalukAll: any = [];
  dataRangeAll: any = [];
  dataVillageAll: any = [];



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

   resVillageBP: any = [];
   resVillageNH: any = [];
   resVillageAll: any = [];

   resVillage: any = [];

   dataRangeNH: any = [];
   dataRangeBP: any = [];
   dataTalukNH: any = [];
   dataTalukBP: any = [];
   dataAnimalNH: any = [];
   dataAnimalBP: any = [];
   dataCatNH: any = [];
   dataCatBP: any = [];

    recordBP: any;
    recordNH: any;

    selectedVillage: any;
    selectedRange: any;
    selectedTaluk: any;
    selectedAnimal: any;
    selectedCat: any;
    parkFilter: any = [];

    parkName: any;


   block1Graph() {
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
      this.parkFilter = ['All', 'Bandipur', 'Nagarahole']
      this.dataCat = res[0];
      this.dataCatAll = res[1];

      this.dataCatAll  = this.dataCatAll.filter(res => {
       return res.CATEGORY !== null;
     });

      this.dataCat  = this.dataCat.filter(res => {
        return res.CATEGORY !== null;
      });


    this.dataCat = this.dataCat.reduce(function(r, a) {
      r[a.PARK] = r[a.PARK] || [];
      r[a.PARK].push(a);
      return r;
  }, Object.create(null));
  this.dataCatBP = this.dataCat.bandipur;
  this.dataCatNH = this.dataCat.nagarahole;
this.selectedCat = this.parkFilter[0];
this.dataCat = this.dataCatAll;

this.filterData(this.selectedCat,'Cat');





      // Animal
       this.dataAnimal = res[2];
       this.dataAnimalAll = res[3];
       this.dataAnimalAll  = this.dataAnimalAll.filter(res => {
        return res.ANIMAL !== null;
      });
       this.dataAnimal  = this.dataAnimal.filter(res => {
        return res.ANIMAL !== null;
      });


    this.dataAnimal = this.dataAnimal.reduce(function(r, a) {
      r[a.PARK] = r[a.PARK] || [];
      r[a.PARK].push(a);
      return r;
  }, Object.create(null));
  this.dataAnimalBP = this.dataAnimal.bandipur;
  this.dataAnimalNH = this.dataAnimal.nagarahole;
this.selectedAnimal = this.parkFilter[0];
this.dataAnimal = this.dataAnimalAll;

this.filterData(this.selectedAnimal,'Animal');







      this.dataPark = res[4];
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



      // Taluk
      this.dataTaluk = res[6];
      this.dataTalukAll = res[7];
      this.dataTalukAll  = this.dataTalukAll.filter(res => {
        return res.TALUK !== null;
      });

      this.dataTaluk  = this.dataTaluk.filter(res => {
        return res.TALUK !== null;
      });


    this.dataTaluk = this.dataTaluk.reduce(function(r, a) {
      r[a.PARK] = r[a.PARK] || [];
      r[a.PARK].push(a);
      return r;
  }, Object.create(null));
  this.dataTalukBP = this.dataTaluk.bandipur;
  this.dataTalukNH = this.dataTaluk.nagarahole;
this.selectedTaluk = this.parkFilter[0];
this.dataTaluk = this.dataTalukAll;

this.filterData(this.selectedTaluk,'Taluk');




  //Range
      this.dataRange = res[8];
      this.dataRangeAll = res[9];
      this.dataRangeAll  = this.dataRangeAll.filter(res => {
        return res.HWC_RANGE !== null;
      });
      this.dataRange  = this.dataRange.filter(res => {
        return res.HWC_RANGE !== null;
      });
      this.dataRange = this.dataRange.reduce(function(r, a) {
        r[a.PARK] = r[a.PARK] || [];
        r[a.PARK].push(a);
        return r;
    }, Object.create(null));

    this.dataRangeBP = this.dataRange.bandipur;
    this.dataRangeNH = this.dataRange.nagarahole;
this.selectedRange = this.parkFilter[0];
  this.dataRange = this.dataRangeAll;

  this.filterData(this.selectedRange,'Range');


     // Village

      this.dataVillageAll = res[10];
      this.dataVillageAll = this.dataVillageAll.filter(res => res.VILLAGE !== null);
      this.dataVillage = res[11];
      this.dataVillage = this.dataVillage.filter(res => res.VILLAGE !== null);
      this.result = this.dataVillage;

      let record= this.result.reduce(function(r, a) {
        r[a.PARK] = r[a.PARK] || [];
        r[a.PARK].push(a);
        return r;
    }, Object.create(null));

      console.log(this.parkFilter);

      this.selectedVillage = this.parkFilter[0];

      let recordVilAll = this.dataVillageAll.sort(function(a, b) {
        return a.VILLAGE_FREQ - b.VILLAGE_FREQ;
      })
      .reverse();
      for (let i = 0; i < 20; i++) {
        this.resVillageAll.push(recordVilAll[i]);
      }


      this.resVillage = Object.values(record)[0];
      if(record.bandipur){
        this.recordBP = record.bandipur.sort(function(a, b) {
            return a.VILLAGE_FREQ - b.VILLAGE_FREQ;
          })
          .reverse();
          for (let i = 0; i < 20; i++) {
            this.resVillageBP.push(this.recordBP[i]);
          }
      }
      if(record.nagarahole){
       // console.log(record.nagarahole);
        this.recordNH = record.nagarahole.sort(function(a, b) {
          return a.VILLAGE_FREQ - b.VILLAGE_FREQ;
        })
        .reverse();
        for (let i = 0; i < 20; i++) {
          this.resVillageNH.push(this.recordNH[i]);
        }
      }

       this.filterData(this.selectedVillage,'Village');


    });
  }

  color: any;
  filterData(name, value){
    if(value==="Cat"){
      if(name === "All"){
        if (this.catChart !== undefined) {
          this.catChart.destroy();
        }

        this.dataCat = this.dataCatAll;
        this.parkName = "Both";
        this.color = "#ffbf00";
      }

      if(name === "Bandipur"){

       if (this.catChart !== undefined) {
        this.catChart.destroy();
      }
      this.dataCat = this.dataCatBP;
      this.parkName = "Bandipur";
      this.color = "#ffbf00";
      }
      if(name === "Nagarahole"){

  if (this.catChart !== undefined) {
    this.catChart.destroy();
  }
  this.dataCat = this.dataCatNH;
  this.parkName = "Nagarahole";
  this.color = "#e71d36";
      }
    this.catChart = new Chart("category", {
      type: "bar",
      data: {
        labels: [],
        datasets: [

          {
            data: [],
            backgroundColor: this.color,
            "borderWidth":1,

            file: false
          }

        ]
      },
      options: {
        title: {
          text: "Frequency of Human-Wildlife Conflict Incidents by HWC category(" + this.parkName + ")",
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



    this.dataCat.forEach(element => {

     element.CATEGORY =
     element.CATEGORY !== null ? element.CATEGORY.charAt(0).toUpperCase() + element.CATEGORY.slice(1): element.CATEGORY;
     this.catChart.data.labels.push(element.CATEGORY);
     this.catChart.data.datasets[0].data.push(element.CAT_FREQ);
    });
    this.catChart.update();
  }
    if(value === "Village"){
    if(name === "All"){
      if (this.villageChart !== undefined) {
        this.villageChart.destroy();
      }

      this.resVillage = this.resVillageAll;
      this.parkName = "Both";
      this.color = "#ffbf00";
    }

    if(name === "Bandipur"){

     if (this.villageChart !== undefined) {
      this.villageChart.destroy();
    }
    this.resVillage = this.resVillageBP;
    this.parkName = "Bandipur";
    this.color = "#ffbf00";
    }
    if(name === "Nagarahole"){

if (this.villageChart !== undefined) {
  this.villageChart.destroy();
}
this.resVillage = this.resVillageNH;
this.parkName = "Nagarahole";
this.color = "#e71d36";

    }


    this.villageChart = new Chart("village", {
      type: "bar",
      data: {
        labels: [],
        datasets: [
          {
            backgroundColor: this.color,
            label: "frequency",
            data: []
          }
        ]
      },
      options: {
        title: {
          text: "Frequency of Human-Wildlife Conflict Incidents by Village(" + this.parkName + ")",
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

    console.log(this.resVillage);
    this.resVillage.forEach(element => {
      element.VILLAGE =
      element.VILLAGE !== null ? element.VILLAGE.charAt(0).toUpperCase() + element.VILLAGE.slice(1):element.VILLAGE;
      this.villageChart.data.labels.push(element.VILLAGE);
      this.villageChart.data.datasets[0].data.push(element.VILLAGE_FREQ);
    });
    //
    this.villageChart.update();
  }

  if(value === "Range"){
    if(name === "All"){
      if (this.rangeChart !== undefined) {
        this.rangeChart.destroy();
      }

      this.dataRange = this.dataRangeAll;
      this.parkName = "Both";
      this.color = "#ffbf00";
    }

    if(name === "Bandipur"){

     if (this.rangeChart !== undefined) {
      this.rangeChart.destroy();
    }
    this.dataRange = this.dataRangeBP;
    this.parkName = "Bandipur";
    this.color = "#ffbf00";

    }
    if(name === "Nagarahole"){

if (this.rangeChart !== undefined) {
  this.rangeChart.destroy();
}
this.dataRange = this.dataRangeNH;
this.parkName = "Nagarahole";
this.color = "#e71d36";

    }

    this.rangeChart = new Chart("range", {
      type: "bar",
      data: {
        labels: [],
        datasets: [
          {
            data: [],
            backgroundColor: this.color,
            "borderWidth":1,

            file: false
          },


        ]
      },
      options: {
        title: {
          text: "Frequency of Human-Wildlife Conflict Incidents by Range(" + this.parkName + ")",
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
      element.HWC_RANGE !== null ? element.HWC_RANGE.charAt(0).toUpperCase() + element.HWC_RANGE.slice(1):element.VILLAGE;
      this.rangeChart.data.labels.push(element.HWC_RANGE);


    this.rangeChart.data.datasets[0].data.push(element.RANGE_FREQ);




    });

    this.rangeChart.update();
  }

  if(value === "Taluk"){
      if(name === "All"){
      if (this.talukChart !== undefined) {
        this.talukChart.destroy();
      }

      this.dataTaluk = this.dataTalukAll;
      this.parkName = "Both";
      this.color = "#ffbf00";
    }

    if(name === "Bandipur"){

     if (this.talukChart !== undefined) {
      this.talukChart.destroy();
    }
    this.dataTaluk = this.dataTalukBP;
    this.parkName = "Bandipur";
    this.color = "#ffbf00";

    }
    if(name === "Nagarahole"){

if (this.talukChart !== undefined) {
  this.talukChart.destroy();
}
this.dataTaluk = this.dataTalukNH;
this.parkName = "Nagarahole";
this.color = "#e71d36";

    }
    this.talukChart = new Chart("taluk", {
      type: "bar",
      data: {
        labels: [],
        datasets: [
          {
            data: [],
            backgroundColor: this.color,
            "borderWidth":1,

            file: false
          }
        ]
      },
      options: {
        title: {
          text: "Frequency of Human-Wildlife Conflict Incidents by Taluk(" + this.parkName + ")",
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
    element.TALUK =
    element.TALUK !== null ? element.TALUK.charAt(0).toUpperCase() + element.TALUK.slice(1):element.VILLAGE;
    this.talukChart.data.labels.push(element.TALUK);


  this.talukChart.data.datasets[0].data.push(element.TALUK_FREQ);




  });
    //
    this.talukChart.update();

  }
  if(value === "Animal"){

    if(name === "All"){
      if (this.animalChart !== undefined) {
        this.animalChart.destroy();
      }

      this.dataAnimal = this.dataAnimalAll;
      this.parkName = "Both";
      this.color = "#ffbf00";
    }

    if(name === "Bandipur"){

     if (this.animalChart !== undefined) {
      this.animalChart.destroy();
    }
    this.dataAnimal = this.dataAnimalBP;
    this.parkName = "Bandipur";
    this.color = "#ffbf00";
    }
    if(name === "Nagarahole"){

if (this.animalChart !== undefined) {
  this.animalChart.destroy();
}
this.dataAnimal = this.dataAnimalNH;
this.parkName = "Nagarahole";
this.color = "#e71d36";
    }


  this.animalChart = new Chart("animal", {
    type: "bar",
    data: {
      labels: [],
      datasets: [
        {
          data: [],
          backgroundColor: this.color,
          "borderWidth":1,

          file: false
        }
      ]
    },
    options: {
      title: {
        text: "Frequency of Human-Wildlife Conflict Incidents by Animal(" + this.parkName + ")",
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
//   console.log(dataAni[i]);
//   labelAnimal.push(dataAni[i].ANIMAL =
//      dataAni[i].ANIMAL.charAt(0).toUpperCase() + dataAni[i].PARK.slice(1));

  //
  //
  this.animalChart.update();
}
  }


  prevDayBpNhAll:any;
  prevDayBpNhCat: any;
  result: any;
  val: any = [];
  displayedCol5: any;
  length5: any;

 dataBpNh: any = [];
 _dataBpNh: any;
 dataBpNhCat: any = [];
  prevDayBpNh(){
    this.result14.subscribe(res => {
    //

      let dataBpNh = res.data[0];

    if (dataBpNh.length !== 0){
       this.dataBpNh = res.data[0];
   //

      this.prevDayBpNhAll = new Chart('prevDayBpNhAll',{
        type: 'bar',
      data:{
        labels: ["Bandipur","Nagarahole","Total"],
        datasets: [
          {
            data: [this.dataBpNh[0].Bandipur, this.dataBpNh[0].Nagarahole, this.dataBpNh[0].CASES_BPNH],
            backgroundColor: '#ffbf00',
            "borderWidth":1,
            label: 'Cases',
            file: false
          }

        ]
      },

      options: {
        title: {
          text: "Number of cases attended in Bandipur and Nagarahole (BPNH)  previous day [" + this.dataBpNh[0].dc_case_date.slice(0,10) +"]",
          display: true
        },
        tooltips: {
          mode: 'index',
          intersect: false
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
           //   stacked: true
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
          //  stacked: true
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

      this.prevDayBpNhAll.update();
    }

     let dataBpNhCat = res.data[1];
     this.dataBpNhCat = dataBpNhCat;
 //
     if (dataBpNhCat[0].TOTAL!== null ){

      this.prevDayBpNhCat = new Chart('prevDayBpNhCat',{
        type: 'bar',
      data:{
        labels: ["Crop Loss","Crop & Property Loss","Property Loss", "Livestock Predation", "Human Injury", "Human Death" , "Total"],
        datasets: [
          {
            data: [dataBpNhCat[0].CR, dataBpNhCat[0].CRPD, dataBpNhCat[0].PD,dataBpNhCat[0].LP,dataBpNhCat[0].HI,dataBpNhCat[0].HD, dataBpNhCat[0].TOTAL],
            backgroundColor: '#e71d36',
            "borderWidth":1,
            label: 'Cases',
            file: false
          }

        ]
      },

      options: {
        title: {
          text: "Number of cases attended in BPNH by HWC Category  previous day [" + this.dataBpNh[0].dc_case_date.slice(0,10) +"]" ,
          display: true
        },
        tooltips: {
          mode: 'index',
          intersect: false
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
           //   stacked: true
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
          //  stacked: true
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
      this.prevDayBpNhCat.update();
    }
    });
  }

  barBpNhByDate: any ;
  barBpByDate: any ;
  barNhByDate: any ;
  _dataNh:any=[];
  _dataBp:any=[];
  allBpNhByDate(){

    Chart.pluginService.register({
      // beforeDraw: function(chart) {
      //   if (chart.data.datasets[0].data.length === 0  ) {
      //     // No data is present

      //     var ctx = chart.chart.ctx;
      //     var width = chart.chart.width;
      //     var height = chart.chart.height
      //     chart.clear();

      //     ctx.save();
      //     ctx.textAlign = 'center';
      //     ctx.textBaseline = 'middle';
      //     ctx.font = "20px normal 'Helvetica Nueue'";
      //     ctx.fillText('No Data to display', width / 2, height / 2);
      //     ctx.restore();
      // }

      // },
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
                          ctx.font = "20px normal 'Avion'";
                          ctx.fillText('No Data to display', width / 2, height / 2);
                          ctx.restore();
                      }

                  }
      });
      this.result13 = this.wildService.getBpNhByDateAll(this.fromDate.formatted,this.toDate.formatted);
    this.result13.subscribe(res => {


      this._dataBpNh = res.data[0];

      if (this.barBpNhByDate !== undefined) {
            this.barBpNhByDate.destroy();
          }
          let colors = ['#009A21','#E75F1D', '#FFBF00', '#1D42E7', '#E71D36', '#9A3200'];

      this.barBpNhByDate = new Chart('barBpNhByDate',{
        type: 'bar',
      data:{
        labels: [],
        datasets: [
          {
            data: [],
            backgroundColor: colors,
            "borderWidth":1,
            label: 'Cases',
            file: false
          }

        ]
      },

      options: {
        title: {
          text: "Total number of cases by HWC Category(BP+NH) [" + this.fromDate.formatted + " to " + this.toDate.formatted + "]" ,
          display: true
        },
        tooltips: {
          mode: 'index',
          intersect: false
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
           //   stacked: true
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
          //  stacked: true
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
      this._dataBpNh.forEach(element => {
        this.barBpNhByDate.data.labels.push(element.HWC_CASE_CATEGORY);
        this.barBpNhByDate.data.datasets[0].data.push(element.No_of_cases);
      });
      this.barBpNhByDate.update();
      // if( this.barBpNhByDate.data.datasets[0].data.length !== 0){
      //   if (this.barBpNhByDate !== null) {
      //     this.barBpNhByDate.destroy();
      //   }
      // }


       this._dataNh = res.data[1];
      if (this.barNhByDate !== undefined) {
        this.barNhByDate.destroy();
      }

      this.barNhByDate = new Chart('barNhByDate',{
        type: 'bar',
      data:{
        labels: [],
        datasets: [
          {
            data: [],
            backgroundColor: colors,
            "borderWidth":1,
            label: 'Cases',
            file: false
          }

        ]
      },

      options: {
        title: {
          text: "Total number of cases by HWC Category(NH)[" + this.fromDate.formatted + " to " + this.toDate.formatted + "]" ,
          display: true
        },
        tooltips: {
          mode: 'index',
          intersect: false
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
           //   stacked: true
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
          //  stacked: true
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
      this._dataNh.forEach(element => {
        this.barNhByDate.data.labels.push(element.HWC_CASE_CATEGORY);
        this.barNhByDate.data.datasets[0].data.push(element.No_of_cases);
      });
      this.barNhByDate.update();


      this._dataBp = res.data[2];
      if (this.barBpByDate !== undefined) {
        this.barBpByDate.destroy();
      }
      this.barBpByDate = new Chart('barBpByDate',{
        type: 'bar',
      data:{
        labels: [],
        datasets: [
          {
            data: [],
            backgroundColor: colors,
            "borderWidth":1,
            label: 'Cases',
            file: false
          }

        ]
      },

      options: {
        title: {
          text: "Total number of cases by HWC Category(BP) [" + this.fromDate.formatted + " to " + this.toDate.formatted + "]" ,
          display: true
        },
        tooltips: {
          mode: 'index',
          intersect: false
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
           //   stacked: true
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
          //  stacked: true
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
      this._dataBp.forEach(element => {
        this.barBpByDate.data.labels.push(element.HWC_CASE_CATEGORY);
        this.barBpByDate.data.datasets[0].data.push(element.No_of_cases);
      });
      this.barBpByDate.update();

    });
  }


  barCatProj: any;
  dataproj:any;
  projectYearByCatByPark(projYear){
    let yearData = projYear.split("-");
   let result11 = this.wildService.getCatBpNhProjectYear(yearData[0],yearData[1]);
    result11.subscribe(res => {
      this.dataproj = JSON.parse(res.data);

      // for(let j=0; j<data.length;j++){
      let result = this.dataproj.reduce(function (r, a) {
        r[a.BPNH] = r[a.BPNH] || [];
        r[a.BPNH].push(a);
        return r;
    }, Object.create(null));

    let cats: any[] = Object.keys(result);
    if(this.barCatProj != undefined){
      this.barCatProj.destroy();
    }
    this.barCatProj= new Chart("barCatProj", {
      type: 'bar',
      data:{
        labels: cats,
        datasets: [
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
          }

        ]
      },

      options: {
        title: {
          text: "Total number of cases by HWC Category in each year of project Project Year [BP, NH]"  + "(" + yearData[0] + "-" + yearData[1] +")",
          display: true
        },
        tooltips: {
          mode: 'index',
          intersect: false
        },
        legend: {

         onClick: null
        },
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          yAxes: [
            {
              ticks: {
                beginAtZero: true
              },
           //   stacked: true
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
          //  stacked: true
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
  let rec: any;

    for(let i = 0; i<cats.length; i++){
      rec = Object.values(result)[i];
     rec.forEach(element => {
       if(element.hwc_park_name === "bandipur")
       this.barCatProj.data.datasets[0].data[i] = element.cases_july2june;
       else if(element.hwc_park_name === "nagarahole")
       this.barCatProj.data.datasets[1].data[i] = element.cases_july2june;
     });
   }


   this.barCatProj.update();
  // }
  //
    });
  }




  barCatParkProj: any = [];
  projectYearByCat(){
    this.result10.subscribe(res => {


       let data = JSON.parse(res.data);


      //  data[0].forEach(element => {
      //
      //  });
      let dataArr: any = [];
    let  labelNames: any = [];
    Chart.Legend.prototype.afterFit = function() {
      this.height = this.height + 40;
    };

       this.barCatParkProj= new Chart("barCatParkProj" , {
        type: 'bar',
        data:{
          labels: labelNames,
          datasets: [
            {
              data: [],
              backgroundColor: "#009A21",
              "borderWidth":1,
              label: 'Crop Loss',
              file: false
            },
            {
              data: [],
              backgroundColor: "#E75F1D",
              "borderWidth":1,
              label: 'Crop & Property Loss',
              file: false
            },
            {
              data: [],
              backgroundColor: "#FFBF00",
              "borderWidth":1,
              label: 'Property Loss',
              file: false
            },
            {
              data: [],
              backgroundColor: "#1D42E7",
              "borderWidth":1,
              label: 'Livestock Predation',
              file: false
            },
            {
              data: [],
              "backgroundColor": "#E71D36",
              "borderWidth":1,
              label: 'Human Injury',
              file: false
            },
            {
              data: [],
              "backgroundColor": "#9A3200",
              "borderWidth":1,
              label: 'Human Death',
              file: false
            }
          ]
        },

        options: {
          title: {
            text: "Total number of cases by HWC Category in each year of project [BP + NH] (July-June)",
            display: true
          },
          legend: {
            labels: {
               boxWidth: 10,
              // fontSize: 8
            },
          //  position: "right",
            onClick: null
          },
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            yAxes: [
              {
                ticks: {
                  beginAtZero: true
                },
            //    stacked: true
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
            //  stacked: true
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
      // barChart.data.labels.push(2015);

      for(let i = 0; i<data.length; i++){

      data[i].forEach(element => {
        if(element.BPNH === "CR")
        this.barCatParkProj.data.datasets[0].data[i]=element.cases_july2june;
        else if(element.BPNH === "CRPD")
        this.barCatParkProj.data.datasets[1].data[i]=element.cases_july2june;
        else if(element.BPNH === "PD")
        this.barCatParkProj.data.datasets[2].data[i]=element.cases_july2june;
        else if(element.BPNH === "LP")
        this.barCatParkProj.data.datasets[3].data[i]=element.cases_july2june;
        else if(element.BPNH === "HI")
        this.barCatParkProj.data.datasets[4].data[i]=element.cases_july2june;
        else if(element.BPNH === "HD")
        this.barCatParkProj.data.datasets[5].data[i]=element.cases_july2june;
      });
      labelNames.push("Project Year"  + "(20" + (15+(i)) + ("-"+ (15+ (i+1))+")"));
    }

    //
    this.barCatParkProj.update();
    });
  }


   barParkProj: any;
projectYearByPark(){
  this.result9.subscribe(res => {


    let data = JSON.parse(res.data);

    let labelNames: any =[];
    this.barParkProj= new Chart("barParkProj" , {
      type: 'bar',
      data:{
        labels: labelNames,
        datasets: [
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
          }

        ]
      },

      options: {
        title: {
          text: "Total number of cases in each year of project [BP,NH] (July-June)",
          display: true
        },
        tooltips: {
          mode: 'index',
          intersect: false
        },
        legend: {
          display: true
        },
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          yAxes: [
            {
              ticks: {
                beginAtZero: true
              },
           //   stacked: true
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
          //  stacked: true
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
    for(let i =0 ; i< data.length; i++){
     data[i].forEach(element => {
       if(element.HWC_PARK_NAME === "bandipur")
       this.barParkProj.data.datasets[0].data[i]=element.cases_july2june;
       else if(element.HWC_PARK_NAME === "nagarahole")
       this.barParkProj.data.datasets[1].data[i]=element.cases_july2june;
     });
     labelNames.push("Project Year"  + "(20" + (15+(i)) + ("-"+ (15+ (i+1))+")"));
    }


   this.barParkProj.update();
  });
}

bar: any

   casesByProjYear(){

  let record: any = [];
  let labelNames: any = []
  this.result1.subscribe(res => {
  //
//  let  data1 = res.data;
  let data1 = JSON.parse(res.data);

  let i = 0;
  data1.forEach(element => {

     record[i++] = element.reduce((sum, item) => sum + item.NO_OF_CASES, 0);
     labelNames.push("Project Year"  + "(20" + (15+(i-1)) + ("-"+ (15+ i)+")"));
    });

Chart.Legend.prototype.afterFit = function() {
  this.height = this.height + 40;
};

this.bar= new Chart("bar" , {
  type: 'bar',
  data:{
    labels: labelNames,
    datasets: [
      {
        data: [],
        backgroundColor: "#ffbf00",
        "borderWidth":1,

        label: 'Cases',
        file: false
      }

    ]
  },

  options: {
    title: {
      text: "Total number of cases in each year of project [BP+NH] (July-June)",
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
          stacked: true
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

          stacked: true

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
  this.bar.data.datasets[0].data.push(record[i]);
}
//
this.bar.update();
});



}

 downloadImage(data, myImage) {
  /* set new title */
  // this.bar.options.title.text = 'New Chart Title';
  // this.bar.update({
  //    duration: 0
  // });
  // or, use
  // chart_variable.update(0);

  /* save as image */
  var link = document.createElement('a');
//  link.href = this.bar.toBase64Image();
  link.href = data.toBase64Image();
  link.download = myImage +'.png';
  link.click();

  /* rollback to old title */
  // this.bar.options.title.text = 'Chart Title';
  // this.bar.update({
  //    duration: 0
  // });
  // or, use
  // chart_variable.update(0);
}

barParkYearByCat: any = [];
rescr:any = [];
rescrpd:any = [];
respd:any = [];
reslp:any = [];
reshi:any = [];
reshd:any= [];
casesCatByYear(){
  this.result7.subscribe(res => {

    let result: any[] = res.data.reduce(function (r, a) {
      r[a.HWC_CATEGORY] = r[a.HWC_CATEGORY] || [];
      r[a.HWC_CATEGORY].push(a);
      return r;
  }, Object.create(null));

   if(result['CR']!=undefined){
        this.rescr = result['CR'];
      }
      if(result['CRPD'] !=undefined){
        this.rescrpd = result['CRPD']
      }
      if(result['PD'] !=undefined){
        this.respd = result['PD']
      }
      if(result['LP'] !=undefined){
        this.reslp = result['LP']
      }
      if(result['HI'] !=undefined){
        this.reshi = result['HI']
      }
      if(result['HD'] !=undefined){
        this.reshd = result['HD']
      }
  // Object.values(result)[0]

let j = 0, k = 0;
let cat = ["Crop Loss", "Crop & Property Loss", "Human Death", "Human Injury", "Livestock Predation","Property Loss"   ];
for(let i = 0; i < 6; i++){
  let resultY = Object.values(result)[i].reduce(function (r, a) {
    r[a.YEAR] = r[a.YEAR] || [];
    r[a.YEAR].push(a);
    return r;
}, Object.create(null));

 let years: any[] = Object.keys(resultY);

 this.barParkYearByCat[k]= new Chart("barParkYearByCat" + i , {
  type: 'bar',
  data:{
    labels: years,
    datasets: [
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
      }

    ]
  },

  options: {
    title: {
      text: "Frequency of Human-Wildlife Conflict Incidents by Year by Park("+ cat[j++] +")",
      display: true
    },
    tooltips: {
      mode: 'index',
      intersect: false
    },
    legend: {

    },
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      yAxes: [
        {
          ticks: {
            beginAtZero: true
          },
       //   stacked: true
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
      //  stacked: true
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
let data: any;

for(let i = 0; i<years.length; i++){
  data = Object.values(resultY)[i];
 data.forEach(element => {
   if(element.PARK === "bandipur")
   this.barParkYearByCat[k].data.datasets[0].data[i]=element.NO_OF_CASES;
   else if(element.PARK === "nagarahole")
   this.barParkYearByCat[k].data.datasets[1].data[i]=element.NO_OF_CASES;
 });
}


this.barParkYearByCat[k++].update();
}
  });
}

barYear: any;
casesByYear(data){
  let record: any = [];
  let labelNames: any = [];
  let result2 = this.wildService.getCasesByYear(data);

  result2.subscribe(res => {

    let  _data = res.data[0];


   this.barYear= new Chart("barYear" , {
    type: 'bar',
    data:{
      labels: labelNames,
      datasets: [
        {
          data: [],
          backgroundColor: "#e71d36",
          "borderWidth":1,
          label: 'Frequency',
          file: false
        }

      ]
    },

    options: {
      title: {
        text: "Frequency of Human-Wildlife Conflict Incidents by Year",
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
    // element.VILLAGE =
    // element.VILLAGE.charAt(0).toUpperCase() + element.VILLAGE.slice(1);
    this.barYear.data.labels.push(element.YEAR);
    this.barYear.data.datasets[0].data.push(element.NO_OF_CASES);
  });
  // //
  this.barYear.update();
  });
}

barYearChart: any ;
dataByMonth:any;
  // by month
casesByYearByMonth(data){

  let colors = ['#011627', '#e71d36', '#ffbf00', '#2ec4b6'];
  let result = this.wildService.getCasesByYear(data);
  result.subscribe(res => {


  this.dataByMonth = res.data[1];



let data: any = [];
let barChart: any = [];
//
// let len = Object.keys(result).length
// for(let i=0; i < len; i++){
  // data[i] = Object.values(result)[i];
//

if(this.barYearChart != undefined){
  this.barYearChart.destroy();
}

   this.barYearChart= new Chart("bar1" , {
    type: 'bar',
    data:{
      labels: [],
      datasets: [
        {
          data: [],
          backgroundColor: '#011627',
          "borderWidth":1,

          label: 'Cases',
          file: false
        }

      ]
    },

    options: {
      title: {
        text: "Monthly Frequency of Human-Wildlife Conflict Incidents by Year (" + this.selected2+ ")",
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

  this.dataByMonth.forEach(element => {
    this.barYearChart.data.labels.push(element.MONTH);
    this.barYearChart.data.datasets[0].data.push(element.NO_OF_CASES);
  });
  // setTimeout(() => {
  //   barChart2015.update();
  // }, 2000);
//  barChart[i].update();
this.barYearChart.update();
//
// }

  });

}

barVil: any;
_data: any;
topVillages(){

  let record: any = [];
  let labelNames: any = []

  this.result3.subscribe(res => {

    this._data = res.data;

    this.barVil= new Chart("barVil" , {
    type: 'bar',
    data:{
      labels: [],
      datasets: [
        {
          data: [],
          backgroundColor: "#FFBF00",
          "borderWidth":1,
          label: 'Frequency',
          file: false
        }

      ]
    },

    options: {
      title: {
        text: "Top 10 Villages(All Cases)",
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


  this._data.forEach(element => {
    element.VILLAGE =
    element.VILLAGE.charAt(0).toUpperCase() + element.VILLAGE.slice(1);
    this.barVil.data.labels.push(element.VILLAGE);
    this.barVil.data.datasets[0].data.push(element.FREQS);
  });
  // //
  this.barVil.update();
  });
}

// topVillagesArr: any = [];
// displayedCol1: any;
barVilCat: any=[];

rescrcat:any = [];
rescrpdcat:any = [];
respdcat:any = [];
reslpcat:any = [];
reshicat:any = [];
reshdcat:any= [];
topVillagesByCat(){
  this.result5.subscribe(res => {
    let _data = JSON.parse(res.data);

        this.rescrcat = _data[0];
        this.rescrpdcat = _data[1];
        this.respdcat = _data[2];
        this.reslpcat = _data[3];
        this.reshicat = _data[4];
        this.reshdcat = _data[5];

  let i=0,j=0,k=0;

  let colors = ['#009A21','#E75F1D', '#FFBF00', '#1D42E7', '#E71D36', '#9A3200'];
  let cat = ["Crop Loss", "Crop & Property Loss", "Property Loss", "Livestock Predation", "Human Injury", "Human Death"]
    _data.forEach(category => {
      this.barVilCat[k]= new Chart("cat"+(++i) , {
    type: 'bar',
    data:{
      labels: [],
      datasets: [
        {
          data: [],
          backgroundColor: '#FFBF00',
          "borderWidth":1,
          label: 'Frequency',
          file: false
        }

      ]
    },

    options: {
      title: {
        text: "Top 10 Villages("+ cat[j++] +")",
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


  category.forEach(element => {
    element.VILLAGE =
    element.VILLAGE.charAt(0).toUpperCase() + element.VILLAGE.slice(1);
    this.barVilCat[k].data.labels.push(element.VILLAGE);
    this.barVilCat[k].data.datasets[0].data.push(element.FREQS);
  });
  // //
   this.barVilCat[k++].update();

    });

  });
}

xlsxReport(data, name) {

   if( data != undefined){
    let d = new Date();
    if(data.length != 0){
        name = name+'_'+d.getDate()+'/'+(d.getMonth()+1 )+'/'+d.getFullYear();
        console.log(name);
  this.excelService.exportAsExcelFile(data, name);
  return "success";
      }
   }
}

exportdata(){
  this.xlsxReport(this.datapark,'Frequency_of_Human-Wildlife_Conflict_Incidents_By_catergory');
  this.xlsxReport(this.dataproj, 'Total_number_of_cases_by_HWC_Category_in_each_year_of_project_[BP, NH]_(July-June)'+
'('+this.selected4+')');
this.xlsxReport(this.dataByPark, 'Monthly_Frequency_of_Human-Wildlife_Conflict_Incidents_by_Year_by_Park' +
'('+this.selected3+')');
this.xlsxReport(this.dataCatByYear, 'Frequency_of_Human-Wildlife_Conflict_Incidents_By_Year_By_Park' +
'('+this.selected1+')');
this.xlsxReport(this.datacatchart, 'Frequency_of_Human-Wildlife_Conflict_Incidents_By_Year_By_Park' +
'('+this.selected1+')');
this.xlsxReport(this.rescr, 'Frequency_of_Human-Wildlife_Conflict_Incidents_By_catergory');
this.xlsxReport(this.rescrpd, 'Frequency_of_Human-Wildlife_Conflict_Incidents_By_catergory');
this.xlsxReport(this.respd, 'Frequency_of_Human-Wildlife_Conflict_Incidents_By_catergory');
this.xlsxReport(this.reslp, 'Frequency_of_Human-Wildlife_Conflict_Incidents_By_catergory');
this.xlsxReport(this.reshi, 'Frequency_of_Human-Wildlife_Conflict_Incidents_By_catergory');
this.xlsxReport(this.reshd, 'Frequency_of_Human-Wildlife_Conflict_Incidents_By_catergory');
this.xlsxReport(this._data, 'All Villages(All Cases)');
this.xlsxReport(this.rescrcat, 'Top 10 Villages(Crop Loss)');
this.xlsxReport(this.rescrpdcat, 'Top 10 Villages(Crop & Property Loss)');
this.xlsxReport(this.respdcat, 'Top 10 Villages(Property Loss)');
this.xlsxReport(this.reslpcat, 'Top 10 Villages(Livestock Predation)');
this.xlsxReport(this.reshicat, 'Top_10_Villages_By_Human_Injury');
this.xlsxReport(this.reshdcat, 'Top_10_Villages_By_Human_Death');
this.xlsxReport(this.resrange, 'Top_10_Villages_By_range' +
'('+this.selected+')');
this.xlsxReport(this.allcompomdata, 'Total_Compensation');
this.xlsxReport(this.compomdatabyprojsheet, 'Total_Compensation('+this.selected5+')');
this.xlsxReport(this.allcompomdatabyprojsheet, 'Compensation_ByProjectYear_BYSheet('+this.selected6+')');
this.xlsxReport(this.compByProjByCat, 'Compensation_ByProjectYear_BYSheet('+this.selected7+')');
this.xlsxReport(this.compByCatByProjYear, 'Compensation_ByProjectYear_BYSheet('+this.selected8+')');
this.xlsxReport(this.crcolproj, 'Compensation  By Project Year By Crop Loss In OM Sheet('+this.selected9+')');
this.xlsxReport(this.crpdcolproj, 'Compensation  By Project Year By Crop Loss & Property Loss In OM Sheet('+this.selected9+')');
this.xlsxReport(this.pdcolproj, 'Compensation  By Project Year By Property Loss In OM Sheet('+this.selected9+')');
this.xlsxReport(this.lpcolproj, 'Compensation  By Project Year By Livestock Predation In OM Sheet('+this.selected9+')');
this.xlsxReport(this.hicolproj, 'Compensation  By Project Year By Human injury In OM Sheet('+this.selected9+')');
this.xlsxReport(this.hdcolproj, 'Compensation  By Project Year By Human Death In OM Sheet('+this.selected9+')');


this.xlsxReport(this.monthwiseData[0], 'Compensation Total Processed Days Of July By Category' +
'('+this.selected11+')');
this.xlsxReport(this.monthwiseData[1], 'Compensation Total Processed Days Of August By Category' +
'('+this.selected11+')');
this.xlsxReport(this.monthwiseData[2], 'Compensation Total Processed Days Of September By Category' +
'('+this.selected11+')');
this.xlsxReport(this.monthwiseData[3], 'Compensation Total Processed Days Of October By Category' +
'('+this.selected11+')');
this.xlsxReport(this.monthwiseData[4], 'Compensation Total Processed Days Of November By Category' +
'('+this.selected11+')');
this.xlsxReport(this.monthwiseData[5], 'Compensation Total Processed Days Of December By Category' +
'('+this.selected11+')');
this.xlsxReport(this.monthwiseData[6], 'Compensation Total Processed Days Of January By Category' +
'('+this.selected11+')');
this.xlsxReport(this.monthwiseData[7], 'Compensation Total Processed Days Of February By Category' +
'('+this.selected11+')');
this.xlsxReport(this.monthwiseData[8], 'Compensation Total Processed Days Of March By Category' +
'('+this.selected11+')');
this.xlsxReport(this.monthwiseData[9], 'Compensation Total Processed Days Of April By Category' +
'('+this.selected11+')');
this.xlsxReport(this.monthwiseData[10], 'Compensation Total Processed Days Of May By Category' +
'('+this.selected11+')');
this.xlsxReport(this.monthwiseData[11], 'Compensation Total Processed Days Of June By Category' +
'('+this.selected11+')');
this.xlsxReport(this.dataSourceAvgTime, 'Average time taken between HWC Date and FD Submission (in days) for each Field Assistant.' +
'('+this.selected10+')');
this.xlsxReport(this.totalDataSourceAvgTime, 'Time taken between HWC Date and FD Submission (in days)('+this.selected12+')');

this.xlsxReport(this.dataCatAll, 'Frequency_of_Human-Wildlife_Conflict_Incidents_By_category');
this.xlsxReport(this.dataAnimalAll, 'Frequency_of_Human-Wildlife_Conflict_Incidents_By_Animal');
this.xlsxReport(this.dataParkAll, 'Frequency_of_Human-Wildlife_Conflict_Incidents_By_Park');
this.xlsxReport(this.dataTalukAll, 'Frequency_of_Human-Wildlife_Conflict_Incidents_By_Taluk');
this.xlsxReport(this.dataRangeAll, 'Frequency_of_Human-Wildlife_Conflict_Incidents_By_Range');
this.xlsxReport(this.dataVillageAll, 'Frequency_of_Human-Wildlife_Conflict_Incidents_By_Village' );

this.xlsxReport(this.dataCatBP, 'Frequency_of_Human-Wildlife_Conflict_Incidents_By_category(BP)');
this.xlsxReport(this.dataAnimalBP, 'Frequency_of_Human-Wildlife_Conflict_Incidents_By_Animal(BP)');
// this.xlsxReport(this.dataPark, 'Frequency_of_Human-Wildlife_Conflict_Incidents_By_Park');
this.xlsxReport(this.dataTalukBP, 'Frequency_of_Human-Wildlife_Conflict_Incidents_By_Taluk(BP)');
this.xlsxReport(this.dataRangeBP, 'Frequency_of_Human-Wildlife_Conflict_Incidents_By_Range(BP)');
this.xlsxReport(this.resVillageBP, 'Frequency_of_Human-Wildlife_Conflict_Incidents_By_Village(BP)' );

this.xlsxReport(this.dataCatNH, 'Frequency_of_Human-Wildlife_Conflict_Incidents_By_category(NH)');
this.xlsxReport(this.dataAnimalNH, 'Frequency_of_Human-Wildlife_Conflict_Incidents_By_Animal(NH)');
//this.xlsxReport(this.dataParkNH, 'Frequency_of_Human-Wildlife_Conflict_Incidents_By_Park');
this.xlsxReport(this.dataTalukNH, 'Frequency_of_Human-Wildlife_Conflict_Incidents_By_Taluk(NH)');
this.xlsxReport(this.dataRangeNH, 'Frequency_of_Human-Wildlife_Conflict_Incidents_By_Range(NH)');
this.xlsxReport(this.resVillageNH, 'Frequency_of_Human-Wildlife_Conflict_Incidents_By_Village(NH)' );

}

exportdatadaterang(){
  this.xlsxReport(this._dataBpNh, 'Total number of cases by HWC Category(BP+NH)');
  this.xlsxReport(this._dataBp, 'Total number of cases by HWC Category(BP)');
  this.xlsxReport(this._dataNh, 'Total number of cases by HWC Category(NH)');
  this.xlsxReport(this.allcompomdatabydate, 'Total_Compensation_By_Date');
  this.xlsxReport(this.allcompomdatabycat, 'Total_Compensation_By_Category');
  this.xlsxReport(this.allcompomdatabydays, 'Total_Compensation_By_Processed_Days');
  this.xlsxReport(this.allcompomdatabyalldays, 'Compensation_By_Total_Processed_Days');
  this.xlsxReport(this.crprocesscol, 'Compensation Total Processed Days By Crop Loss');
  this.xlsxReport(this.crpdprocesscol, 'Compensation Total Processed Days By Crop Loss & Property loss');
  this.xlsxReport(this.pdprocesscol, 'Compensation Total Processed Days By Property loss');
  this.xlsxReport(this.lpprocesscol, 'Compensation Total Processed Days By Livestock Predation');
  this.xlsxReport(this.hiprocesscol, 'Compensation Total Processed Days By Human Injury');
  this.xlsxReport(this.hdprocesscol, 'Compensation Total Processed Days By Human Death');
  this.xlsxReport(this.datasourcedcvshwc, 'Dc_Cases_Vs_HWC_cases(Dashboard)');
  this.xlsxReport(this.datasourcedcvshwccat, 'Dc_Cases_Vs_HWC_cases_by_Category(dashboard)');

}

barParkYear: any;
datapark:any;
parkYearWise(){
  let record: any = [];
  let labelNames: any = []

  this.result4.subscribe(res => {
  //
    this.datapark = res.data;

    let result: any = this.datapark.reduce(function (r, a) {
      r[a.YEAR] = r[a.YEAR] || [];
      r[a.YEAR].push(a);
      return r;
  }, Object.create(null));


  let years: any[] = Object.keys(result);
  this.barParkYear= new Chart("barParkYear" , {
    type: 'bar',
    data:{
      labels: years,
      datasets: [
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
        }

      ]
    },

    options: {
      title: {
        text: "Number of Cases in Each Year By Park",
        display: true
      },
      tooltips: {
        mode: 'index',
        intersect: false
      },
      legend: {
          onClick: null
      },
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        yAxes: [
          {
            ticks: {
              beginAtZero: true
            },
         //   stacked: true
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
        //  stacked: true
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
let data: any;

  for(let i = 0; i<years.length; i++){
    data = Object.values(result)[i];
   data.forEach(element => {
     if(element.PARK === "bandipur")
     this.barParkYear.data.datasets[0].data[i]=element.NO_OF_CASES;
     else if(element.PARK === "nagarahole")
     this.barParkYear.data.datasets[1].data[i]=element.NO_OF_CASES;
   });
 }


 this.barParkYear.update();
  });
}

// parkYearWiseByCat(){
// //   this.result6.subscribe(res => {
// //
// //      let  _data = JSON.parse(res.data) ;
// //
// //       let result: any[] = _data[0].reduce(function (r, a) {
// //         r[a.CATEGORY] = r[a.CATEGORY] || [];
// //         r[a.CATEGORY].push(a);
// //         return r;
// //     }, Object.create(null));
// //
// //   let record: any = [];
// //   let j = 0;
// //       Object.values(result).forEach(element => {
// //        record[j++] =   element.reduce(function (r, a) {
// //           r[a.PARK] = r[a.PARK] || [];
// //           r[a.PARK].push(a);
// //           return r;
// //       }, Object.create(null));
// //     });
// //
// //   // let record: any[]
// //    let i = 0;
// //    let output: any=[];
// //   //
// //   let k = 0;
// //   record.forEach(ele => {
// //     Object.values(ele).forEach(element => {
// //       let rec: any = element;
// //
// //         output[i++] =rec.reduce((sum, item) => sum + item.NO_OF_CASES, 0);
// //      //   labelNames.push("Project Year" + (i));
// //      });
// //   });

// //
// //     //   let result: any = _data.reduce(function (r, a) {
// //     //     r[a.YEAR] = r[a.YEAR] || [];
// //     //     r[a.YEAR].push(a);
// //     //     return r;
// //     // }, Object.create(null));

// //     //
// //     // let years: any[] = Object.keys(result);
// //     let barChart= new Chart("barParkYearByC" , {
// //       type: 'bar',
// //       data:{
// //         labels: ["CR", "CRPD", "PD", "LP","HI","HD"],
// //         datasets: [
// //           {
// //             data: [output[0],output[2],output[8],output[6],output[5],output[4]],
// //             backgroundColor: "#ffbf00",
// //             "borderWidth":1,
// //             label: 'Bandipur',
// //             file: false
// //           },
// //           {
// //             data: [output[1],output[3],output[9],output[7]],
// //             backgroundColor: "#e71d36",
// //             "borderWidth":1,
// //             label: 'Nagarahole',
// //             file: false
// //           }

// //         ]
// //       },

// //       options: {
// //         title: {
// //           text: "Number of Cases in Each Year By Park",
// //           display: true
// //         },
// //         tooltips: {
// //           mode: 'index',
// //           intersect: false
// //         },
// //         legend: {
// //           display: false
// //         },
// //         responsive: true,
// //         maintainAspectRatio: false,
// //         scales: {
// //           yAxes: [
// //             {
// //               ticks: {
// //                 beginAtZero: true
// //               },
// //            //   stacked: true
// //             }
// //           ],
// //           xAxes: [
// //             {
// //               gridLines: {
// //               display: false
// //             },
// //             ticks: {
// //               autoSkip: false
// //             },
// //           //  stacked: true
// //           }
// //           ]
// //         },
// //         plugins: {
// //           datalabels: {
// //             anchor: 'end',
// //             align: 'top',
// //             formatter: Math.round,
// //             font: {
// //               weight: 'bold'
// //             }
// //           }
// //         }
// //       }
// //     });
// //   // let data: any;

// //   //   for(let i = 0; i<years.length; i++){
// //   //     data = Object.values(result)[i];
// //   //    data.forEach(element => {
// //   //      if(element.PARK === "bandipur")
// //   //      barChart.data.datasets[0].data.push(element.NO_OF_CASES);
// //   //      else if(element.PARK === "nagarahole")
// //   //      barChart.data.datasets[1].data.push(element.NO_OF_CASES);
// //   //    });
// //   //  }


// //   //   barChart.update();
// //     });

//   }

  b: any;
  barCatChart: any ;
  dataCatByYear: any;
  catResByYear: any;
  datacatchart:any;
categoryByYear(data){
  this.catResByYear = this.wildService.getCatByYear(data);
  this.catResByYear.subscribe(res => {
     this.dataCatByYear = res.data[0];
  //
  //   let result: any = _data.reduce(function (r, a) {
  //     r[a.YEAR] = r[a.YEAR] || [];
  //     r[a.YEAR].push(a);
  //     return r;
  // }, Object.create(null));


  //
  // let barChart: any;
  // let data: any;
//  let data: any = Object.values(result)[0]
//  let years: any[] = Object.keys(result)
//
  Chart.Legend.prototype.afterFit = function() {
    this.height = this.height + 40;
  };
  let colors = ['#009A21','#E75F1D', '#FFBF00', '#1D42E7', '#E71D36', '#9A3200'];
  if(this.b != undefined){
    this.b.destroy()
  }

  this.b= new Chart("b" , {
    type: 'bar',
    data:{
      labels: [],
      datasets: [
        {
          data: [],
          backgroundColor: colors,
          "borderWidth":1,
          label: 'Crop Loss',
          file: false
        },

      ]
    },

    options: {
      title: {
        text: "Frequency of Human-Wildlife Conflict Incidents by HWC Category",
        display: true
      },
      legend: {
       display : false,
      },
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        yAxes: [
          {
            ticks: {
              beginAtZero: true
            },
        //    stacked: true
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
        //  stacked: true
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
  // barChart.data.labels.push(2015);
this.dataCatByYear.forEach(element => {

    this.b.data.labels.push(element.HWC_CASE_CATEGORY);
    this.b.data.datasets[0].data.push(element.NO_OF_CASES);
});
//   for(let i = 0; i<years.length; i++){
//    data = Object.values(result)[i];
//   data.forEach(element => {
//     if(element.HWC_CASE_CATEGORY === "CR")
//     this.b.data.datasets[0].data[i] = element.NO_OF_CASES;
//     else if(element.HWC_CASE_CATEGORY === "CRPD")
//     this.b.data.datasets[1].data[i] = element.NO_OF_CASES;
//     else if(element.HWC_CASE_CATEGORY === "PD")
//     this.b.data.datasets[2].data[i] = element.NO_OF_CASES;
//     else if(element.HWC_CASE_CATEGORY === "LP")
//     this.b.data.datasets[3].data[i] = element.NO_OF_CASES;
//     else if(element.HWC_CASE_CATEGORY === "HI")
//     this.b.data.datasets[4].data[i] = element.NO_OF_CASES;
//     else if(element.HWC_CASE_CATEGORY === "HD")
//     this.b.data.datasets[5].data[i] = element.NO_OF_CASES;
//   });
// }

//
this.b.update();


  this.datacatchart = res.data[1];

//   let result1: any = _data1.reduce(function (r, a) {
//     r[a.YEAR] = r[a.YEAR] || [];
//     r[a.YEAR].push(a);
//     return r;
// }, Object.create(null));

let key: any;
let _res;

  //
let barChart1: any = [];
let data1: any = [];
//  let data: any = Object.values(result)[0]
let j = 0;

//for(let i = 0; i<years.length; i++){
  // key = Object.values(result1)[i];
  _res = this.datacatchart.reduce(function (r, a) {
    r[a.MONTH] = r[a.MONTH] || [];
    r[a.MONTH].push(a);
    return r;
  }, Object.create(null));

  let months: any[] = Object.keys(_res);


if(this.barCatChart != undefined){
  this.barCatChart.destroy()
}

this.barCatChart= new Chart("b1" , {
  type: 'bar',
  data:{
    labels: months,
    datasets: [
      {
        data: [],
        backgroundColor: "#009A21",
        "borderWidth":1,
        label: 'Crop Loss',
        file: false
      },
      {
        data: [],
        backgroundColor: "#E75F1D",
        "borderWidth":1,
        label: 'Crop & Property Loss',
        file: false
      },
      {
        data: [],
        backgroundColor: "#FFBF00",
        "borderWidth":1,
        label: 'Property Loss',
        file: false
      },
      {
        data: [],
        "backgroundColor": "#1D42E7",
        "borderWidth":1,
        label: 'Livestock Predation',
        file: false
      },
      {
        data: [],
        backgroundColor: "#E71D36",
        "borderWidth":1,
        label: 'Human Injury',
        file: false
      },
      {
        data: [],
        backgroundColor: "#9A3200",
        "borderWidth":1,
        label: 'Human Death',
        file: false
      }
    ]
  },

  options: {
    title: {
      text: "Monthly Frequency of Human-Wildlife Conflict Incidents by HWC Category (" + this.selected1 + ")",
      display: true
    },
    legend: {
        labels: {
          boxWidth: 20,
        //  fontSize: 16
        },
      //  position: "right",
        onClick: null

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
// barChart.data.labels.push(2015);
for(let i =0 ; i<months.length;i++){
data1 =Object.values(_res)[i] ;
data1.forEach(element => {
  if(element.HWC_CASE_CATEGORY === "CR")
  this.barCatChart.data.datasets[0].data[i]=element.NO_OF_CASES;
  else if(element.HWC_CASE_CATEGORY === "CRPD")
  this.barCatChart.data.datasets[1].data[i]=element.NO_OF_CASES;
  else if(element.HWC_CASE_CATEGORY === "PD")
  this.barCatChart.data.datasets[2].data[i]=element.NO_OF_CASES;
  else if(element.HWC_CASE_CATEGORY === "LP")
  this.barCatChart.data.datasets[3].data[i]=element.NO_OF_CASES;
  else if(element.HWC_CASE_CATEGORY === "HI")
  this.barCatChart.data.datasets[4].data[i]=element.NO_OF_CASES;
  else if(element.HWC_CASE_CATEGORY === "HD")
  this.barCatChart.data.datasets[5].data[i]=element.NO_OF_CASES;
});

}
this.barCatChart.update();
//}
// //
// barChart1.update();


  });
}

barRange : any = [];
resrange:any=[];

casesByRangeByYear(data){
  let result: any[] ;
  let j = 0;
  let colors = ['#011627', '#e71d36', '#ffbf00', '#2ec4b6'];
  let result8 = this.wildService.getCasesByRange(data);
  result8.subscribe(res => {

    this.resrange = res.data[0];
  //   let resultY: any[] = Object.values(result).reduce(function (r, a) {
  //     r[a.YEAR] = r[a.YEAR] || [];
  //     r[a.YEAR].push(a);
  //     return r;
  // }, Object.create(null));
//
//
//   let len = Object.keys(resultY).length;
 // for(let i=0;i<len;i++ ){
//  let  output = Object.values(resultY)[i]
//     .sort(function(a, b) {
//       return a.NO_OF_CASES - b.NO_OF_CASES;
//     })
//     .reverse();
//
//   let resRange: any = [];
//   resRange = output;
//   for (let i = 0; i < 10; i++) {
//     resRange.push(output[i]);
//   }
//

   this.barRange = new Chart("barRange" , {
    type: 'bar',
    data:{
      labels: [],
      datasets: [
        {
          data: [],
          backgroundColor: '#E71D36',
          "borderWidth":1,
          label: 'Frequency',
          file: false
        }

      ]
    },

    options: {
      title: {
        text: "Number of cases in each Year by Range("+ this.selected+")",
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


 this.resrange.forEach(element => {
    element.HWC_RANGE =
    element.HWC_RANGE ? element.HWC_RANGE.charAt(0).toUpperCase() + element.HWC_RANGE.slice(1): element.HWC_RANGE;

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
    this.barRange.data.labels.push(element.HWC_RANGE);
    this.barRange.data.datasets[0].data.push(element.NO_OF_CASES);
  });
  // //
  this.barRange.update();
//}

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



 barGraph() {
 this.record = this.wildService.getPreviousBpNhCount();

   this.record.subscribe(res => {
    this.dataSet = res.data;
       let date: any = [];
     let nh_case = [];
     let bp_case = [];
     this.dataSet.forEach(element => {
       date.push(element.CASE_DATE);
       nh_case.push(element.NH_CASES);
       bp_case.push(element.BP_CASE);
     });
     nh_case = ['10'];
     bp_case = ['25'];
     let d = new Date();
     date = [('0' + (d.getDate()-1)).slice(-2)+"-"+('0' + (d.getMonth() + 1)).slice(-2)+"-"+d.getFullYear()];
  this.barChart = new Chart('ctx', {
    type: 'bar',
    data:{
      labels: date,
      datasets: [
        {
          data: nh_case,
          borderColor: "rgba(255, 99, 132)",
          backgroundColor: "rgba(255, 99, 132, 0.2)",
          "borderWidth":1,
          label: 'NH_CASES',
         // file: false
        },
        {
         data: bp_case,
         borderColor: "rgba(0,0,255)",
         backgroundColor: "rgba(0,0,255,0.2)",
         "borderWidth":1,
         label: 'BP_CASES',
        // file: false
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
        // position: "right",

      },
      scales: { yAxes: [{ ticks: { beginAtZero:true } }] }
    }
  });

});
 }

 barGraph2() {
  let crpd_cases = [20, 30, 40, 10, 60];
  let crpd_sum = crpd_cases.reduce((a, b) => a + b, 0);
  //
   let bar_chart = new Chart('ctx2',
    {
      type: 'bar',
      data: {
        labels: ['crpd_cases', 'cr_cases', 'pd_cases', 'lp_cases', 'hi_cases'],
        datasets: [
          {
            label: "Bandipura",
            data: [20, 30, 40, 10, 60],
            backgroundColor: "orange",
            borderColor: "purple",
            borderWidth:1
          },
          {
            label: "Nagarahole",
            data: [120, 50, 70, 90, 110],
            backgroundColor: "yellow",
            borderColor: "blue",
            borderWidth:1
          }
        ]
      },
      options: {
        legend : {
          display: true,
          labels: {
            boxWidth: 10
 ,           fontSize: 8
          },
          position: "right",

        }
      }
    }
  )
}

//Overall Compensation Data
  allcompomdata:any;
  allcompcol:any=[];
  allcompres:any;
  getallCompensation(){
    this.allcompres = this.wildService.getoveralCompensation();
    this.allcompres.subscribe(res => {

      this.allcompomdata = res.data;
      this.allcompcol = ["FREQUENCY","TOTAL","AVERAGE","MAX COMP","MIN COMP"];
    });

  }


//All Compensation By date
allcompomdatabydate:any;
  allcompcolbydate:any=[];
  allcompresbydate:any;
getCompensationbyDate(){
   this.allcompresbydate = this.wildService. getCompensationbyDate(this.fromDate.formatted, this.toDate.formatted);
    this.allcompresbydate.subscribe(res => {

      this.allcompomdatabydate = res.data;
      this.allcompcolbydate = ["FREQUENCY","TOTAL","AVERAGE","MAX COMP","MIN COMP"];
    });

}

//All Compensation By category

allcompomdatabycat:any;
  allcompcolbycat:any=[];
  allcompresbycat:any;
getcompensationbycategory(){
   this.allcompresbycat = this.wildService. getCompensationbyCategory(this.fromDate.formatted, this.toDate.formatted);
    this.allcompresbycat.subscribe(res => {

      this.allcompomdatabycat = res.data;
      this.allcompcolbycat = ["HWC CATEGORY","FREQUENCY","TOTAL","AVERAGE","MAX COMP","MIN COMP"];
    });

}

allcompomdataprocess:any;
  allcompcolprocess:any=[];
  allcompresprocess:any;
  crcoldata=["HWC CATEGORY","OM SHEET","NO OF SHEET","COMPENSATION DAYS","COMPENSATION AVERAGE"];
  crprocesscol:any=[];
  crpdprocesscol:any=[];
  pdprocesscol:any=[];
  lpprocesscol:any=[];
  hiprocesscol:any=[];
  hdprocesscol:any=[];
getCompensationtotalProcesseddaysbycategory(){
   this.allcompresprocess = this.wildService.getCompensationTotalProcessedDaysByCategory(this.fromDate.formatted, this.toDate.formatted);
  this.allcompresprocess.subscribe(res => {

      this.allcompomdataprocess = res.data;
       let compamtomsheetdataprocess = res.data.reduce(function (r, a) {
        r[a.HWC_CATEGORY] = r[a.HWC_CATEGORY] || [];
        r[a.HWC_CATEGORY].push(a);
        return r;
    },Object.create(null));
    let categry1: any[] = Object.keys(compamtomsheetdataprocess);
    //

    this.crprocesscol = compamtomsheetdataprocess["CR"];
    this.crpdprocesscol = compamtomsheetdataprocess["CRPD"];
    this.pdprocesscol = compamtomsheetdataprocess["PD"];
    this.hiprocesscol = compamtomsheetdataprocess["HI"];
    this.lpprocesscol = compamtomsheetdataprocess["LP"];
    this.hdprocesscol = compamtomsheetdataprocess["HD"];

     // this.allcompcolprocess = ["HWC CATEGORY","FREQUENCY","TOTAL","AVERAGE","MAX COMP","MIN COMP"];
    });

}

//Compensation Bydays

allcompomdatabydays:any;
  allcompcolbydays:any=[];
  allcompresbydays:any;
getcompensationprocesseddays(){
   this.allcompresbydays = this.wildService. getCompensationprocessedDays(this.fromDate.formatted, this.toDate.formatted);
    this.allcompresbydays.subscribe(res => {

      this.allcompomdatabydays = res.data;
      this.allcompomdatabydays.forEach(element => {
        element.UPLOADED_DATE =  element.UPLOADED_DATE.slice(0,10);
        element.HWC_DATE = element.HWC_DATE.slice(0,10);
      });
      this.allcompcolbydays = ["OM SHEET","UPLOADED DATE","HWC DATE","COMPENSATION DAYS"];
    });

}


//Total Compensation ByTotaldays

allcompomdatabyalldays:any;
  allcompcolbyalldays:any=[];
  allcompresbyalldays:any;
getcompensationtotalprocessedays(){
   this.allcompresbyalldays = this.wildService. getCompensationtotalprocesseddays(this.fromDate.formatted, this.toDate.formatted);
    this.allcompresbyalldays.subscribe(res => {

      this.allcompomdatabyalldays = res.data;
      this.allcompcolbyalldays = ["OM SHEET","NO OF SHEET","COMPENSATION DAYS","COMPENSATION AVERAGE"];
    });

}

displayedColsheetcat:any=[];
  compamtomsheetdata1:any;
  compamtomsheetcat:any;
  data1:any;
  bcat:any;
  cr=[
    "HWC CATEGORY","FREQ HWC CATEGORY","TOTAL","AVERAGE","MAX COMP","MIN COMP"
  ];
  crcol:any;
  crpdcol:any=[];
  pdcol:any=[];
  lpcol:any=[];
  hdcol:any=[];
  hicol:any=[];

  compByCatByProjYear: any = [];
  compByCatByProjYearHead: any = [];
getCompensationbyCategoryprojectYr(projYear){
  let data = projYear.split('-');
this.compamtomsheetcat = this.wildService.getCompensationByCategoryProjectYear(data[0],data[1]);
     this.compamtomsheetcat.subscribe(res => {

       this.compByCatByProjYear = JSON.parse(res.data);
       this.compByCatByProjYearHead = ["Category", "Frequency", "Total Amount", "Average Amount", "Max Amount", "Min Amount"]
    });

}

crcolproj:any = [];
crpdcolproj:any=[];
pdcolproj:any=[];
lpcolproj:any=[];
hdcolproj:any=[];
hicolproj:any=[];
compByProjYearByCatInSheet: any = [];
compByProjYearByCatInSheetHead: any = [];
getCompbyProjYearByCatInSheet(projYear){
  let data = projYear.split('-');
let compamtomsheetcat = this.wildService.getCompensationbyProjectYearByCatInSheet(data[0],data[1]);
    compamtomsheetcat.subscribe(res => {

       this.compByProjYearByCatInSheet = JSON.parse(res.data);
       let resultY: any[] = this.compByProjYearByCatInSheet.reduce(function (r, a) {
            r[a.HWC_CATEGORY] = r[a.HWC_CATEGORY] || [];
            r[a.HWC_CATEGORY].push(a);
            return r;
        }, Object.create(null));

      if(resultY['CR']!=undefined){
        this.crcolproj = resultY['CR'];
      }
      if(resultY['CRPD'] !=undefined){
        this.crpdcolproj = resultY['CRPD']
      }
      if(resultY['PD'] !=undefined){
        this.pdcolproj = resultY['PD']
      }
      if(resultY['LP'] !=undefined){
        this.lpcolproj = resultY['LP']
      }
      if(resultY['HI'] !=undefined){
        this.hicolproj = resultY['HI']
      }
      if(resultY['HD'] !=undefined){
        this.hdcolproj = resultY['HD']
      }
      this.crcolproj = resultY['CR']
       this.compByProjYearByCatInSheetHead = ["Category", "OM Sheet", "Number Of Sheets", "Compensation Days", "Compensantion Average"]
    });

}


displayedColprojcat:any=[];
  compamtomsprojdata1:any;
  compamtomsprojcat:any;
  data11:any;
  bcatproj:any;
  crproj=[
    "HWC CATEGORY","FREQ HWC CATEGORY","TOTAL","AVERAGE","MAX COMP","MIN COMP"
  ];


  compByProjByCat:any=[];
  compByProjByCatHead: any = [];
getCompensationbyProjectYearbyCategry(projYear){
  let data = projYear.split('-');
  this.compamtomsprojcat = this.wildService.getCompensationByProjectYearbyCategory(data[0], data[1]);
    this.compamtomsprojcat.subscribe(res => {

       this.compByProjByCat = JSON.parse(res.data);
    //
    this.compByProjByCatHead = ["Category", "No of sheets", "Compensation Days", "Compensation Average"]
    });

}

allcompomdatabyprojsheet:any=[];
  allcompcolbyprojsheet:any=[];
  allcompresbyprojsheet:any;
getCompensationByprojectYearbySheet(projYear){
  let data = projYear.split('-');
   this.allcompresbyprojsheet = this.wildService. getCompensationByProjectYearBYSheet(data[0], data[1]);
    this.allcompresbyprojsheet.subscribe(res => {

      this.allcompomdatabyprojsheet = JSON.parse(res.data);

      this.allcompcolbyprojsheet = ["Total Frequency","Total Amount","Average Amount","Max Amount","Min Amount"];
    });

}

compomdatabyprojsheet:any;
compcolbyproj:any=[];
compresbyprojsheet:any;
getCompensationbyprojectyear(projYear){
  let data = projYear.split('-');
  this.compresbyprojsheet = this.wildService.getCompensationbyProjectYear(data[0], data[1]);
    this.compresbyprojsheet.subscribe(res => {

      this.compomdatabyprojsheet = JSON.parse(res.data);
     this.compcolbyproj = ["OM Sheet","Number Of Sheets","Compensation Days","Average Compensation"];
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
    //
    let result = this.timeBtwHwcFd.reduce(function (r, a) {
      r[a.Month_s] = r[a.Month_s] || [];
      r[a.Month_s].push(a);
      return r;
  }, Object.create(null));

   let i = 0;
  // this.tableHeader = Object.keys(res.data[0])
Object.values(result).forEach(element => {
  this.monthwiseData[i++]  = element;
});


this.tableHeader = ['Month','Field Assistant', 'WSID', 'Village', 'Range', 'Taluk', 'Park','Case Date','FD Submission Date','Time Taken To Submit']
  });
}

displayedCol4dchwc: any = [];
datasourcedcvshwc: any =[];
datadcvshwc: any = [];
getCasesDCvsHwc(){
  let result = this.wildService.getCasesDCvsHWC(this.fromDate.formatted,this.toDate.formatted);
  result.subscribe(res => {

    this.datasourcedcvshwc = res.data;
    let i=0;
    this.datasourcedcvshwc.forEach(element =>
    {
     this.datadcvshwc[i++] = element.Cases;
    })
  });

  this.displayedCol4dchwc = ["Daily Count","HWC Cases"];
}

datasourcedcvshwccat: any=[];
datadcvshwccat: any= [];
tableHead: any = [];
dailyCountCases: any;
hwcCases: any;
getCasesDCvsHwcByCat(){
  let result = this.wildService.getCasesDCvsHWCByCat(this.fromDate.formatted,this.toDate.formatted);
  result.subscribe(res => {
    this.datasourcedcvshwccat = res.data;

    this.dailyCountCases = this.datasourcedcvshwccat[0];
    this.hwcCases = this.datasourcedcvshwccat[1];
    // this.datasourcedcvshwccat.forEach(element =>
    // {
    //  this.datadcvshwccat[i++] = element;
    // });
    //
  });
  this.tableHead = ['CR','CRPD', 'PD','LP','HI', 'HD']
}

dataSourceAvgTime: any =[]
tableHeaderAvgTime: any = [];
getAvgTimeBtwHwcFd(projYear){
  let data = projYear.split('-');
  let result = this.wildService.getAvgTimeBtwHWCFD(data[0],data[1]);
  result.subscribe(res => {
    this.dataSourceAvgTime = res.data;
  });
this.tableHeaderAvgTime = ['Field Assistant', 'Total Cases', 'Max Time Taken', 'Min Time Taken', 'Average Time Taken']
}

 displayedCol = [];
 displayedRows = [];

dataSource: any;
@ViewChild(MatPaginator) paginator: MatPaginator;
totalPost = 10;
postPerPage = 10;
pageSizeOptions = [5, 10, 20, 50, 100];

getTable1(){
  this.record = this.wildService.getBpNhYearly();
  this.record.subscribe(res => {

     this.dataSource = res.data ;
    for (let key in this.dataSource[0]){
      this.displayedCol.push(key);

    }
this.displayedCol;
  });

}

totalDataSourceAvgTime: any =[]
totalTableHeaderAvgTime: any = [];
getTotalAvgTimeBtwHWCDateFDDate(projYear){
  let data = projYear.split('-');
  console.log(data);
  let record = this.wildService.getTotalAvgTimeTakenHWCDateFDDate(data[0],data[1]);
  record.subscribe(res => {
    console.log(res);
    if(res.success){
      console.log(res.data[0]);
      this.totalDataSourceAvgTime = res.data;
      this.totalTableHeaderAvgTime = ["Total Cases", "Total Time Taken", "Max Time Taken", "Min Time Taken", "Avg Time Taken"];
    }
  });
}


barCatChartBP: any;
barCatChartNH: any;
resBandipur: any =[];
resNagarahole: any =[];
getCatProjYearByMonthByPark(projYear){
  let data = projYear.split('-');
  let record = this.wildService.getCatProjYearMonthByPark(data[0],data[1]);
  record.subscribe(res => {
    console.log(res);
    let result = res.data;
    let data1 : any = [];
    // console.log(result);

    let _res = result.reduce(function (r, a) {
      r[a.HWC_PARK_NAME] = r[a.HWC_PARK_NAME] || [];
      r[a.HWC_PARK_NAME].push(a);
      return r;
    }, Object.create(null));

    console.log(_res);



     this.resBandipur = _res.bandipur.reduce(function (r, a) {
      r[a.MONTH] = r[a.MONTH] || [];
      r[a.MONTH].push(a);
      return r;
    }, Object.create(null));

    let monthsBP: any[] = Object.keys(this.resBandipur);
 //   console.log(resBandipur);

    this.resNagarahole = _res.nagarahole.reduce(function (r, a) {
      r[a.MONTH] = r[a.MONTH] || [];
      r[a.MONTH].push(a);
      return r;
    }, Object.create(null));

    let monthsNH: any[] = Object.keys(this.resNagarahole);
    console.log(this.resNagarahole);

  if(this.barCatChartBP != undefined){
    this.barCatChartBP.destroy()
  }

  this.barCatChartBP= new Chart("b1BP" , {
    type: 'bar',
    data:{
      labels: monthsBP,
      datasets: [
        {
          data: [],
          backgroundColor: "#009A21",
          "borderWidth":1,
          label: 'Crop Loss',
          file: false
        },
        {
          data: [],
          backgroundColor: "#E75F1D",
          "borderWidth":1,
          label: 'Crop & Property Loss',
          file: false
        },
        {
          data: [],
          backgroundColor: "#FFBF00",
          "borderWidth":1,
          label: 'Property Loss',
          file: false
        },
        {
          data: [],
          "backgroundColor": "#1D42E7",
          "borderWidth":1,
          label: 'Livestock Predation',
          file: false
        },
        {
          data: [],
          backgroundColor: "#E71D36",
          "borderWidth":1,
          label: 'Human Injury',
          file: false
        },
        {
          data: [],
          backgroundColor: "#9A3200",
          "borderWidth":1,
          label: 'Human Death',
          file: false
        }
      ]
    },

    options: {
      title: {
        text: "Monthly Frequency of Human-Wildlife Conflict Incidents by HWC Category In Bandipur(" + this.selected1 + ")",
        display: true
      },
      legend: {
          labels: {
            boxWidth: 20,
          //  fontSize: 16
          },
        //  position: "right",
          onClick: null

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
  // barChart.data.labels.push(2015);
  for(let i =0 ; i<monthsBP.length;i++){
  data1 =Object.values(this.resBandipur)[i] ;
  data1.forEach(element => {
    if(element.HWC_CASE_CATEGORY === "CR")
    this.barCatChartBP.data.datasets[0].data[i]=element.TOTAL_CASES;
    else if(element.HWC_CASE_CATEGORY === "CRPD")
    this.barCatChartBP.data.datasets[1].data[i]=element.TOTAL_CASES;
    else if(element.HWC_CASE_CATEGORY === "PD")
    this.barCatChartBP.data.datasets[2].data[i]=element.TOTAL_CASES;
    else if(element.HWC_CASE_CATEGORY === "LP")
    this.barCatChartBP.data.datasets[3].data[i]=element.TOTAL_CASES;
    else if(element.HWC_CASE_CATEGORY === "HI")
    this.barCatChartBP.data.datasets[4].data[i]=element.TOTAL_CASES;
    else if(element.HWC_CASE_CATEGORY === "HD")
    this.barCatChartBP.data.datasets[5].data[i]=element.TOTAL_CASES;
  });

  }
  this.barCatChartBP.update();

  if(this.barCatChartNH != undefined){
    this.barCatChartNH.destroy()
  }

  this.barCatChartNH= new Chart("b1NH" , {
    type: 'bar',
    data:{
      labels: monthsNH,
      datasets: [
        {
          data: [],
          backgroundColor: "#009A21",
          "borderWidth":1,
          label: 'Crop Loss',
          file: false
        },
        {
          data: [],
          backgroundColor: "#E75F1D",
          "borderWidth":1,
          label: 'Crop & Property Loss',
          file: false
        },
        {
          data: [],
          backgroundColor: "#FFBF00",
          "borderWidth":1,
          label: 'Property Loss',
          file: false
        },
        {
          data: [],
          "backgroundColor": "#1D42E7",
          "borderWidth":1,
          label: 'Livestock Predation',
          file: false
        },
        {
          data: [],
          backgroundColor: "#E71D36",
          "borderWidth":1,
          label: 'Human Injury',
          file: false
        },
        {
          data: [],
          backgroundColor: "#9A3200",
          "borderWidth":1,
          label: 'Human Death',
          file: false
        }
      ]
    },

    options: {
      title: {
        text: "Monthly Frequency of Human-Wildlife Conflict Incidents by HWC Category In Nagarahole (" + this.selected1 + ")",
        display: true
      },
      legend: {
          labels: {
            boxWidth: 20,
          //  fontSize: 16
          },
        //  position: "right",
          onClick: null

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
  // barChart.data.labels.push(2015);
let data2: any = [];
  for(let i = 0 ; i<monthsNH.length;i++){
    console.log(Object.values(this.resNagarahole)[i] );
    data2 =Object.values(this.resNagarahole)[i] ;
    data2.forEach(element => {
    if(element.HWC_CASE_CATEGORY === "CR")
    this.barCatChartNH.data.datasets[0].data[i]=element.TOTAL_CASES;
    else if(element.HWC_CASE_CATEGORY === "CRPD")
    this.barCatChartNH.data.datasets[1].data[i]=element.TOTAL_CASES;
    else if(element.HWC_CASE_CATEGORY === "PD")
    this.barCatChartNH.data.datasets[2].data[i]=element.TOTAL_CASES;
    else if(element.HWC_CASE_CATEGORY === "LP")
    this.barCatChartNH.data.datasets[3].data[i]=element.TOTAL_CASES;
    else if(element.HWC_CASE_CATEGORY === "HI")
    this.barCatChartNH.data.datasets[4].data[i]=element.TOTAL_CASES;
    else if(element.HWC_CASE_CATEGORY === "HD")
    this.barCatChartNH.data.datasets[5].data[i]=element.TOTAL_CASES;
  });

  }
  this.barCatChartNH.update();

  });
}

filterDataComp(id, arr, type){

  switch (type) {

    case "catPark":
      this.catCompData = arr[id];
      break;

    default:
      break;
  }
}


parkComp: any = [];
dispColParkComp: any;

catCompByPark: any = [];
catCompFilter: any =[];
catCompData: any =[];
catActualCompData: any =[];
dispColCatComp: any;
selectedComp:any;
//dispColVillageComp: any;
getCompFilterAll(){
  const record = this.wildService.getCompFilterAll();
  record.subscribe(res => {
    console.log(res);
    this.parkComp = res[1];
    this.dispColParkComp = ["PARK", "FREQUENCY", "TOTAL", "AVERAGE", "COMP MAX", "COMP MIN", "STANDARD DEVIATION"];



    this.catCompData = res[5];
    this.catActualCompData = this.catCompData;
    this.catCompByPark = this.catCompData.reduce(function(r, a) {
      r[a.COM_PARK] = r[a.COM_PARK] || [];
      r[a.COM_PARK].push(a);
      return r;
  }, Object.create(null));
  this.catCompFilter = Object.keys(this.catCompByPark);
  this.catCompData = this.catCompByPark[this.catCompFilter[0]];
  this.selectedComp = this.catCompFilter[0];
  this.dispColCatComp = ['CATEGORY', 'FREQUENCY', 'TOTAL','AVERAGE','COMP MAX', 'COMP MIN', 'STANDARD DEVIATION']
  });
}


}

