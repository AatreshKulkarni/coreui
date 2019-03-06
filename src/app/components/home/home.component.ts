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


//   ozoneData: any[] = [{
//   lower: 1.3,
//   q1: 2.15,
//   median: 2.95,
//   q3: 3.725,
//   upper: 4.7,
//   mean: 2.9,
//   year: '1996'
// },
//  {
//   lower: 3.8,
//   q1: 4.725,
//   median: 5.55,
//   q3: 5.75,
//   upper: 8.7,
//   mean: 5.5,
//   year: '1998'
// }, {
//   lower: 3,
//   q1: 4.375,
//   median: 4.95,
//   q3: 5.85,
//   upper: 8,
//   mean: 5.2,
//   year: '1999'
// }, {
//   lower: 2.5,
//   q1: 3.925,
//   median: 4.15,
//   q3: 4.45,
//   upper: 5.1,
//   mean: 4.1,
//   year: '2000'
// }, {
//   lower: 2.4,
//   q1: 3.725,
//   median: 4.95,
//   q3: 5.85,
//   upper: 7.7,
//   mean: 4.9,
//   year: '2001'
// }, {
//   lower: 1.7,
//   q1: 2.3,
//   median: 3.9,
//   q3: 5,
//   upper: 5.5,
//   mean: 3.7,
//   year: '2002'
// }, {
//   lower: 2.2,
//   q1: 2.5,
//   median: 3.1,
//   q3: 3.975,
//   upper: 4.3,
//   mean: 3.2,
//   year: '2003'
// }, {
//   lower: 1.9,
//   q1: 2.7,
//   median: 3.35,
//   q3: 4.575,
//   upper: 5.7,
//   mean: 3.6,
//   year: '2004'
// }, {
//   lower: 1.7,
//   q1: 2.65,
//   median: 3.3,
//   q3: 4.05,
//   upper: 5,
//   mean: 3.4,
//   year: '2005'
// }, {
//   lower: 1.4,
//   q1: 2.25,
//   median: 3.3,
//   q3: 4.65,
//   upper: 5.7,
//   mean: 3.4,
//   year: '2006'
// }, {
//   lower: 1.9,
//   q1: 2.85,
//   median: 4,
//   q3: 4.45,
//   upper: 6.1,
//   mean: 3.9,
//   year: '2007'
// }];


//   public data: any[] = this.ozoneData;

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
  //  console.log(d);
        this.toDate = {date: {year: d.getFullYear(),
                             month: d.getMonth() + 1,
                             day: d.getDate()},
                            formatted:d.getFullYear()+"-"+('0' + (d.getMonth() + 1)).slice(-2)+"-"+('0' + (d.getDate())).slice(-2)};
        this.fromDate = {date: {year: d.getFullYear(),
                              month: d.getMonth() -2 ,
                              day: d.getDate()},
                            formatted: d.getFullYear()+"-"+('0' + (d.getMonth()-2)).slice(-2)+"-"+('0' + (d.getDate())).slice(-2)};
                            if(this.fromDate.date.month === -2 || this.fromDate.date.month === -1){
                              this.fromDate = {date: {year: d.getFullYear()-1,
                                month:  d.getMonth() + 11,
                                day: d.getDate()},
                              formatted: d.getFullYear()-1+"-"+('0' + (d.getMonth() + 11)).slice(-2)+"-"+('0' + (d.getDate())).slice(-2)};
                             }
console.log(this.fromDate);
                          }

  ngOnInit() {
  //  this.barGraph();
  //  this.barGraph2();
  
  this.getCompensationbyProjectYearbyCategry();
this.getCompensationbyCategoryprojectYr();
this.getCompensationByprojectYearbySheet();

   this.getDateRange();
   
     this.casesByProjYear();
    this.casesByYearByMonth();
    this.topVillages();
    this.casesByYear();
     this.parkYearWise();
   this.categoryByYear();
  this.topVillagesByCat();
      this.parkYearWiseByCat();
   this.casesCatByYear();
   this.casesByRangeByYear();

   this.projectYearByPark();
   this.projectYearByCat();
    this.projectYearByCatByPark();
//  this.allBpNhByDate();
   this.prevDayBpNh();
   this.getallCompensation();

  this.parkByMonthYear();
 //   this.boxplotgraph();
  //   this.topVillages();
  //   this.casesByYear();
  //    this.parkYearWise();
  //  this.categoryByYear();
  // this.topVillagesByCat();
  //    this.parkYearWiseByCat();
  // this.casesCatByYear();
  // this.casesByRangeByYear();

  // this.projectYearByPark();
  // this.projectYearByCat();
  //  this.projectYearByCatByPark();
  // this.allBpNhByDate();
  // this.prevDayBpNh();

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
    }
     else{
      this.buttonName = "Date Range";
    this.casesByProjYear();
    this.casesByYearByMonth();
    this.topVillages();
    this.casesByYear();
     this.parkYearWise();
   this.categoryByYear();
  this.topVillagesByCat();
     this.parkYearWiseByCat();
  this.casesCatByYear();
  this.casesByRangeByYear();
  this.getCompensationbyDate();
  this.getcompensationbycategory();
  this.getcompensationprocesseddays();
  this.getcompensationtotalprocessedays();
  this.getCompensationtotalProcesseddaysbycategory();

  this.projectYearByPark();
  this.projectYearByCat();
   this.projectYearByCatByPark();
   this.prevDayBpNh();
     }

  }

  onSubmit(fDate, tDate){
    this.fromDate=fDate;
    this.toDate=tDate;
    this.result13 = this.wildService.getBpNhByDateAll(this.fromDate.formatted,this.toDate.formatted);
    this.allBpNhByDate();
    this.getCompensationbyDate();
    this.getcompensationbycategory();
    this.getcompensationprocesseddays();
    this.getcompensationtotalprocessedays();
    this.getCompensationtotalProcesseddaysbycategory();
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
   result2 = this.wildService.getCasesByYear();
   result3 = this.wildService.getTopVillages();
   result4 = this.wildService.getParkYearwise();
   result5 = this.wildService.getTopVillagesByCat();
   result6 = this.wildService.getParkCatByProject();
   result7 = this.wildService.getparkCatYearwise();
   result8 = this.wildService.getCasesByRange();
   result9 = this.wildService.getBpNhProjectYear();
  result10 = this.wildService.getCatProjectYear();
  result11 = this.wildService.getCatBpNhProjectYear();
  result12 = this.wildService.getParkByMonthYear();
  result13 = this.wildService.getBpNhByDateAll(this.fromDate,this.toDate);
  result14 = this.wildService.getPrevDayBpNh();
  result15 = this.wildService.getParkByMonthYear();

  barYearChartByPark: any = [];
  parkByMonthYear(){
    this.result15.subscribe(res => {
      console.log(res);
      let result = res.data.reduce(function (r, a) {
        r[a.Year_s] = r[a.Year_s] || [];
        r[a.Year_s].push(a);
        return r;
    }, Object.create(null));
    let labelArr: any[] = [];
    let data: any = [];
    let barChart: any = [];
     console.log(result);
    //  console.log(Object.values(result));
    let len = Object.keys(result).length

    for(let i=0; i < len; i++){
      data[i] = Object.values(result)[i];

        console.log(data[i]);
  let labelsArr = []
 // labelArr = labelArr.filter((el, i, a) => i === a.indexOf(el))
  // uniq = Array.from(new Set(labelsArr));
//      console.log(result);
      this.barYearChartByPark[i]= new Chart("barYearChartByPark"+i , {
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
            text: "Monthly Frequency of Human-Wildlife Conflict Incidents by Year by Park(20" + (15+ i) + ")",
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

      data[i].forEach(element => {

      //  labelArr[i].push(element.Month_s);
        //   if(!this.barYearChartByPark[i].data.labels.contains(element.Month_s)){
        //   this.barYearChartByPark[i].data.labels.push(element.Month_s);
        // }
        if (this.barYearChartByPark[i].data.labels.includes(element.Month_s) === false) this.barYearChartByPark[i].data.labels.push(element.Month_s);
        if(element.HWC_PARK_NAME === "bandipur")
        this.barYearChartByPark[i].data.datasets[0].data.push(element.No_of_cases);
        else if(element.HWC_PARK_NAME === "nagarahole")
        this.barYearChartByPark[i].data.datasets[1].data.push(element.No_of_cases);

      });
      // setTimeout(() => {
      //   barChart2015.update();
      // }, 2000);
    //  barChart[i].update();
  //  console.log(labelArr[i]);
   // labelArr  = this.barYearChartByPark[i].data.labels;
  //  labelArr = labelArr.filter((el, i, a) => i === a.indexOf(el));
  //   console.log(labelArr);
    this.barYearChartByPark[i].update();
  }
  // console.log(this.barYearChartByPark[0].data.labels);
  //  labelArr  = this.barYearChartByPark[0].data.labels;
  // console.log(labelArr);
  // labelArr = labelArr.filter((el, i, a) => i === a.indexOf(el))
  // console.log(labelArr);

    });
  }

  prevDayBpNhAll:any;
  prevDayBpNhCat: any;
  result: any;
  val: any = [];
  displayedCol5: any;
  length5: any;

 dataBpNh: any;
 _dataBpNh: any;
  prevDayBpNh(){
    this.result14.subscribe(res => {
      console.log(res.data);

      let dataBpNh = res.data[0];
      console.log(dataBpNh);
    if (dataBpNh.length !== 0){
       this.dataBpNh = res.data[0];
   //   console.log(dataBpNh[0].Bandipur);

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
 //    console.log(dataBpNhCat[0]);
     if (dataBpNhCat[0].TOTAL!== null ){
       console.log(dataBpNhCat.length);
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

  barBpNhByDate: any = [];
  barBpByDate: any = [];
  barNhByDate: any = [];
  allBpNhByDate(){

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

    this.result13.subscribe(res => {
      console.log(res.data[0]);

      let _dataBpNh = res.data[0];

      if (_dataBpNh.length !==0 || this.barBpNhByDate.length !== 0) {
            this.barBpNhByDate.destroy();
          }
      this._dataBpNh = res.data[0];
      this.barBpNhByDate = new Chart('barBpNhByDate',{
        type: 'bar',
      data:{
        labels: [],
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


      let _dataNh = res.data[1];
      if (_dataNh.length !==0 || this.barNhByDate.length !== 0) {
        this.barNhByDate.destroy();
      }
      this.barNhByDate = new Chart('barNhByDate',{
        type: 'bar',
      data:{
        labels: [],
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
      _dataNh.forEach(element => {
        this.barNhByDate.data.labels.push(element.HWC_CASE_CATEGORY);
        this.barNhByDate.data.datasets[0].data.push(element.No_of_cases);
      });
      this.barNhByDate.update();


      let _dataBp = res.data[2];
      if (_dataBp.length !==0 || this.barBpByDate.length !== 0) {
        this.barBpByDate.destroy();
      }
      this.barBpByDate = new Chart('barBpByDate',{
        type: 'bar',
      data:{
        labels: [],
        datasets: [
          {
            data: [],
            backgroundColor: "#e71d36",
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
      _dataBp.forEach(element => {
        this.barBpByDate.data.labels.push(element.HWC_CASE_CATEGORY);
        this.barBpByDate.data.datasets[0].data.push(element.No_of_cases);
      });
      this.barBpByDate.update();

    });
  }

  barParkByMonthYear: any = [];
  yearByMonthByPark(){
    this.result12.subscribe(res => {
      let data = JSON.parse(res.data);
      console.log(data);
    })
  }

  barCatProj: any= [];
  projectYearByCatByPark(){
    this.result11.subscribe(res => {
      let data = JSON.parse(res.data);
      console.log(data);
      for(let j=0; j<data.length;j++){
      let result = data[j].reduce(function (r, a) {
        r[a.BPNH] = r[a.BPNH] || [];
        r[a.BPNH].push(a);
        return r;
    }, Object.create(null));
    console.log(result);
    let cats: any[] = Object.keys(result);
    this.barCatProj[j]= new Chart("barCatProj" + j, {
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
          text: "Total number of cases by HWC Category in each year of project Project Year [BP, NH]"  + "(20" + (15+(j)) + ("-"+ (15+ (j+1))+")"),
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
       this.barCatProj[j].data.datasets[0].data[i] = element.cases_july2june;
       else if(element.hwc_park_name === "nagarahole")
       this.barCatProj[j].data.datasets[1].data[i] = element.cases_july2june;
     });
   }


   this.barCatProj[j].update();
  }
  console.log(this.barCatProj[0].data.datasets[1].data);
    });
  }

  barCatParkProj: any = [];
  projectYearByCat(){
    this.result10.subscribe(res => {
      console.log(res);

       let data = JSON.parse(res.data);
       console.log(data);

      //  data[0].forEach(element => {
      //    console.log(element);
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
              backgroundColor: "#e71d36",
              "borderWidth":1,
              label: 'Crop Loss',
              file: false
            },
            {
              data: [],
              backgroundColor: "#ffbf00",
              "borderWidth":1,
              label: 'Crop & Property Loss',
              file: false
            },
            {
              data: [],
              backgroundColor: "#011627",
              "borderWidth":1,
              label: 'Property Loss',
              file: false
            },
            {
              data: [],
              backgroundColor: "#2ec4b6",
              "borderWidth":1,
              label: 'Livestock Predation',
              file: false
            },
            {
              data: [],
              "backgroundColor": "grey",
              "borderWidth":1,
              label: 'Human Injury',
              file: false
            },
            {
              data: [],
              "backgroundColor": "chocolate",
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

    //  console.log(barChart.data.datasets[0]);
    this.barCatParkProj.update();
    });
  }


   barParkProj: any;
projectYearByPark(){
  this.result9.subscribe(res => {
    console.log(res);

    let data = JSON.parse(res.data);
    console.log(data);
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
  //  console.log(res)
//  let  data1 = res.data;
  let data1 = JSON.parse(res.data);
  console.log(data1);
  let i = 0;
  data1.forEach(element => {

     record[i++] = element.reduce((sum, item) => sum + item.NO_OF_CASES, 0);
     labelNames.push("Project Year"  + "(20" + (15+(i-1)) + ("-"+ (15+ i)+")"));
    });
console.log(record);
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
      text: "Number of Cases in Each Year of the Project(July to June)",
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
//console.log(data1);
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

casesCatByYear(){
  this.result7.subscribe(res => {
    console.log(res.data);
    let result: any[] = res.data.reduce(function (r, a) {
      r[a.HWC_CATEGORY] = r[a.HWC_CATEGORY] || [];
      r[a.HWC_CATEGORY].push(a);
      return r;
  }, Object.create(null));
  console.log(result);
  console.log(Object.values(result)[0]);
let j = 0, k = 0;
let cat = ["Crop Loss", "Crop & Property Loss", "Human Death", "Human Injury", "Livestock Predation","Property Loss"   ];
for(let i = 0; i < 6; i++){
  let resultY = Object.values(result)[i].reduce(function (r, a) {
    r[a.YEAR] = r[a.YEAR] || [];
    r[a.YEAR].push(a);
    return r;
}, Object.create(null));
console.log(resultY);
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
casesByYear(){
  let record: any = [];
  let labelNames: any = []

  this.result2.subscribe(res => {
      console.log(res)
    let  _data = res.data[0];
    console.log(_data);

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
  // //console.log(data1);
  this.barYear.update();
  });
}

barYearChart: any = [];
dynamicTabs = ['2015','2016','2017','2018','2019'];
  // by month
casesByYearByMonth(){

  let colors = ['#011627', '#e71d36', '#ffbf00', '#2ec4b6'];
  this.result2.subscribe(res => {


  let data2 = res.data;

  console.log(data2);
  let result = data2[1].reduce(function (r, a) {
    r[a.YEAR] = r[a.YEAR] || [];
    r[a.YEAR].push(a);
    return r;
}, Object.create(null));

let data: any = [];
let barChart: any = [];
//  console.log(result);
  console.log(Object.values(result));
let len = Object.keys(result).length
for(let i=0; i < len; i++){
  data[i] = Object.values(result)[i];
// console.log(typeof data15);
   this.barYearChart[i]= new Chart("bar"+i , {
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
        text: "Monthly Frequency of Human-Wildlife Conflict Incidents by Year (20" + (15+ i) + ")",
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

  data[i].forEach(element => {
    this.barYearChart[i].data.labels.push(element.MONTH);
    this.barYearChart[i].data.datasets[0].data.push(element.NO_OF_CASES);
  });
  // setTimeout(() => {
  //   barChart2015.update();
  // }, 2000);
//  barChart[i].update();
this.barYearChart[i].update();
//console.log(barChart[i]);
}

  });

}

barVil: any;
_data: any;
topVillages(){

  let record: any = [];
  let labelNames: any = []

  this.result3.subscribe(res => {
      console.log(res)
    this._data = res.data;

    this.barVil= new Chart("barVil" , {
    type: 'bar',
    data:{
      labels: [],
      datasets: [
        {
          data: [],
          backgroundColor: "#ffbf00",
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
  // //console.log(data1);
  this.barVil.update();
  });
}

topVillagesArr: any = [];
displayedCol1: any;
barVilCat: any=[];

topVillagesByCat(){
  this.result5.subscribe(res => {
    let _data = JSON.parse(res.data);
    console.log(_data);
  let i=0,j=0,k=0;
  let colors = ['#2ec4b6','#011627', '#e71d36', '#ffbf00', '#0F67A8', '#DE902E'];
  let cat = ["Crop Loss", "Crop & Property Loss", "Property Loss", "Livestock Predation", "Human Injury", "Human Death"]
    _data.forEach(category => {
      this.barVilCat[k]= new Chart("cat"+(++i) , {
    type: 'bar',
    data:{
      labels: [],
      datasets: [
        {
          data: [],
          backgroundColor: '#2ec4b6',
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
  // //console.log(data1);
   this.barVilCat[k++].update();

    });

  });
}

xlsxReport(data, name) {
  this.excelService.exportAsExcelFile(data, name);
  return "success";
}

barParkYear: any;
parkYearWise(){
  let record: any = [];
  let labelNames: any = []

  this.result4.subscribe(res => {
  //    console.log(res)
    let  _data = res.data;
    console.log(_data);
    let result: any = _data.reduce(function (r, a) {
      r[a.YEAR] = r[a.YEAR] || [];
      r[a.YEAR].push(a);
      return r;
  }, Object.create(null));

  console.log(result);
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

parkYearWiseByCat(){
//   this.result6.subscribe(res => {
//         console.log(res)
//      let  _data = JSON.parse(res.data) ;
//       console.log(_data);
//       let result: any[] = _data[0].reduce(function (r, a) {
//         r[a.CATEGORY] = r[a.CATEGORY] || [];
//         r[a.CATEGORY].push(a);
//         return r;
//     }, Object.create(null));
//     console.log(result);
//   let record: any = [];
//   let j = 0;
//       Object.values(result).forEach(element => {
//        record[j++] =   element.reduce(function (r, a) {
//           r[a.PARK] = r[a.PARK] || [];
//           r[a.PARK].push(a);
//           return r;
//       }, Object.create(null));
//     });
//   console.log(record);
// //  console.log(record[0]);
//   // let record: any[]
//    let i = 0;
//    let output: any=[];
//   //   console.log(Object.values(result));
//   let k = 0;
//   record.forEach(ele => {
//     Object.values(ele).forEach(element => {
//       let rec: any = element;
//       console.log(rec);
//         output[i++] =rec.reduce((sum, item) => sum + item.NO_OF_CASES, 0);
//      //   labelNames.push("Project Year" + (i));
//      });
//   });

//          console.log(output);
//     //   let result: any = _data.reduce(function (r, a) {
//     //     r[a.YEAR] = r[a.YEAR] || [];
//     //     r[a.YEAR].push(a);
//     //     return r;
//     // }, Object.create(null));

//     // console.log(result);
//     // let years: any[] = Object.keys(result);
//     let barChart= new Chart("barParkYearByC" , {
//       type: 'bar',
//       data:{
//         labels: ["CR", "CRPD", "PD", "LP","HI","HD"],
//         datasets: [
//           {
//             data: [output[0],output[2],output[8],output[6],output[5],output[4]],
//             backgroundColor: "#ffbf00",
//             "borderWidth":1,
//             label: 'Bandipur',
//             file: false
//           },
//           {
//             data: [output[1],output[3],output[9],output[7]],
//             backgroundColor: "#e71d36",
//             "borderWidth":1,
//             label: 'Nagarahole',
//             file: false
//           }

//         ]
//       },

//       options: {
//         title: {
//           text: "Number of Cases in Each Year By Park",
//           display: true
//         },
//         tooltips: {
//           mode: 'index',
//           intersect: false
//         },
//         legend: {
//           display: false
//         },
//         responsive: true,
//         maintainAspectRatio: false,
//         scales: {
//           yAxes: [
//             {
//               ticks: {
//                 beginAtZero: true
//               },
//            //   stacked: true
//             }
//           ],
//           xAxes: [
//             {
//               gridLines: {
//               display: false
//             },
//             ticks: {
//               autoSkip: false
//             },
//           //  stacked: true
//           }
//           ]
//         },
//         plugins: {
//           datalabels: {
//             anchor: 'end',
//             align: 'top',
//             formatter: Math.round,
//             font: {
//               weight: 'bold'
//             }
//           }
//         }
//       }
//     });
//   // let data: any;

//   //   for(let i = 0; i<years.length; i++){
//   //     data = Object.values(result)[i];
//   //    data.forEach(element => {
//   //      if(element.PARK === "bandipur")
//   //      barChart.data.datasets[0].data.push(element.NO_OF_CASES);
//   //      else if(element.PARK === "nagarahole")
//   //      barChart.data.datasets[1].data.push(element.NO_OF_CASES);
//   //    });
//   //  }


//   //   barChart.update();
//     });

  }

  b: any;
  barCatChart: any = [];
categoryByYear(){
  let _result = this.wildService.getCatByYear();
  _result.subscribe(res => {
    let _data = res.data[0];
  console.log(_data);
    let result: any = _data.reduce(function (r, a) {
      r[a.YEAR] = r[a.YEAR] || [];
      r[a.YEAR].push(a);
      return r;
  }, Object.create(null));


  console.log(result);
  let barChart: any;
  let data: any;
//  let data: any = Object.values(result)[0]
  let years: any[] = Object.keys(result)
  console.log(years);
  Chart.Legend.prototype.afterFit = function() {
    this.height = this.height + 40;
  };

  this.b= new Chart("b" , {
    type: 'bar',
    data:{
      labels: years,
      datasets: [
        {
          data: [],
          backgroundColor: "#e71d36",
          "borderWidth":1,
          label: 'Crop Loss',
          file: false
        },
        {
          data: [],
          backgroundColor: "#ffbf00",
          "borderWidth":1,
          label: 'Crop & Property Loss',
          file: false
        },
        {
          data: [],
          backgroundColor: "#011627",
          "borderWidth":1,
          label: 'Property Loss',
          file: false
        },
        {
          data: [],
          backgroundColor: "#2ec4b6",
          "borderWidth":1,
          label: 'Livestock Predation',
          file: false
        },
        {
          data: [],
          "backgroundColor": "grey",
          "borderWidth":1,
          label: 'Human Injury',
          file: false
        },
        {
          data: [],
          "backgroundColor": "chocolate",
          "borderWidth":1,
          label: 'Human Death',
          file: false
        }
      ]
    },

    options: {
      title: {
        text: "Frequency of Human-Wildlife Conflict Incidents by HWC Category",
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

  for(let i = 0; i<years.length; i++){
   data = Object.values(result)[i];
  data.forEach(element => {
    if(element.HWC_CASE_CATEGORY === "CR")
    this.b.data.datasets[0].data[i] = element.NO_OF_CASES;
    else if(element.HWC_CASE_CATEGORY === "CRPD")
    this.b.data.datasets[1].data[i] = element.NO_OF_CASES;
    else if(element.HWC_CASE_CATEGORY === "PD")
    this.b.data.datasets[2].data[i] = element.NO_OF_CASES;
    else if(element.HWC_CASE_CATEGORY === "LP")
    this.b.data.datasets[3].data[i] = element.NO_OF_CASES;
    else if(element.HWC_CASE_CATEGORY === "HI")
    this.b.data.datasets[4].data[i] = element.NO_OF_CASES;
    else if(element.HWC_CASE_CATEGORY === "HD")
    this.b.data.datasets[5].data[i] = element.NO_OF_CASES;
  });
}

//  console.log(barChart.data.datasets[0]);
this.b.update();


  let _data1 = res.data[1];

  let result1: any = _data1.reduce(function (r, a) {
    r[a.YEAR] = r[a.YEAR] || [];
    r[a.YEAR].push(a);
    return r;
}, Object.create(null));

let key: any;
let _res;

  console.log(result1);
  console.log(_res);
let barChart1: any = [];
let data1: any = [];
//  let data: any = Object.values(result)[0]
let j = 0;

for(let i = 0; i<years.length; i++){
  key = Object.values(result1)[i];
  _res = key.reduce(function (r, a) {
    r[a.MONTH] = r[a.MONTH] || [];
    r[a.MONTH].push(a);
    return r;
  }, Object.create(null));

  let months: any[] = Object.keys(_res);



this.barCatChart[j]= new Chart("b"+ i , {
  type: 'bar',
  data:{
    labels: months,
    datasets: [
      {
        data: [],
        backgroundColor: "#e71d36",
        "borderWidth":1,
        label: 'Crop Loss',
        file: false
      },
      {
        data: [],
        backgroundColor: "#ffbf00",
        "borderWidth":1,
        label: 'Crop & Property Loss',
        file: false
      },
      {
        data: [],
        backgroundColor: "#011627",
        "borderWidth":1,
        label: 'Property Loss',
        file: false
      },
      {
        data: [],
        "backgroundColor": "#2ec4b6",
        "borderWidth":1,
        label: 'Livestock Predation',
        file: false
      },
      {
        data: [],
        backgroundColor: "grey",
        "borderWidth":1,
        label: 'Human Injury',
        file: false
      },
      {
        data: [],
        backgroundColor: "chocolate",
        "borderWidth":1,
        label: 'Human Death',
        file: false
      }
    ]
  },

  options: {
    title: {
      text: "Monthly Frequency of Human-Wildlife Conflict Incidents by HWC Category (20" + (15 + i) + ")",
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
  this.barCatChart[j].data.datasets[0].data[i]=element.NO_OF_CASES;
  else if(element.HWC_CASE_CATEGORY === "CRPD")
  this.barCatChart[j].data.datasets[1].data[i]=element.NO_OF_CASES;
  else if(element.HWC_CASE_CATEGORY === "PD")
  this.barCatChart[j].data.datasets[2].data[i]=element.NO_OF_CASES;
  else if(element.HWC_CASE_CATEGORY === "LP")
  this.barCatChart[j].data.datasets[3].data[i]=element.NO_OF_CASES;
  else if(element.HWC_CASE_CATEGORY === "HI")
  this.barCatChart[j].data.datasets[4].data[i]=element.NO_OF_CASES;
  else if(element.HWC_CASE_CATEGORY === "HD")
  this.barCatChart[j].data.datasets[5].data[i]=element.NO_OF_CASES;
});

}
this.barCatChart[j++].update();
}
// //  console.log(barChart.data.datasets[0]);
// barChart1.update();


  });
}

barRange : any = [];

casesByRangeByYear(){
  let result: any[] ;
  let j = 0;
  let colors = ['#011627', '#e71d36', '#ffbf00', '#2ec4b6'];
  this.result8.subscribe(res => {
    console.log(res.data);
    result = res.data[0];
    let resultY: any[] = Object.values(result).reduce(function (r, a) {
      r[a.YEAR] = r[a.YEAR] || [];
      r[a.YEAR].push(a);
      return r;
  }, Object.create(null));
//  console.log(resultY);
//  console.log(Object.values(resultY)[0]);
//  console.log(Object.keys(resultY));
  let len = Object.keys(resultY).length;
  for(let i=0;i<len;i++ ){
 let  output = Object.values(resultY)[i]
    .sort(function(a, b) {
      return a.NO_OF_CASES - b.NO_OF_CASES;
    })
    .reverse();
  console.log(output);
  let resRange: any = [];
  resRange = output;
  // for (let i = 0; i < 10; i++) {
  //   resRange.push(output[i]);
  // }
  // console.log(resRange);

   this.barRange[j] = new Chart("barRange"+ i , {
    type: 'bar',
    data:{
      labels: [],
      datasets: [
        {
          data: [],
          backgroundColor: '#ffbf00',
          "borderWidth":1,
          label: 'Frequency',
          file: false
        }

      ]
    },

    options: {
      title: {
        text: "Number of cases in each Year by Range(20" + (15+ i) + ")",
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


  resRange.forEach(element => {
    element.HWC_RANGE =
    element.HWC_RANGE.charAt(0).toUpperCase() + element.HWC_RANGE.slice(1);
    console.log(element.HWC_RANGE)
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
    this.barRange[j].data.labels.push(element.HWC_RANGE);
    this.barRange[j].data.datasets[0].data.push(element.NO_OF_CASES);
  });
  // //console.log(data1);
  this.barRange[j++].update();
}

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
  //console.log(crpd_sum);
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
      console.log(res);
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
      console.log(res);
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
      console.log(res);
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
      console.log(res);
      this.allcompomdataprocess = res.data;
       let compamtomsheetdataprocess = res.data.reduce(function (r, a) {
        r[a.HWC_CATEGORY] = r[a.HWC_CATEGORY] || [];
        r[a.HWC_CATEGORY].push(a);
        return r;
    },Object.create(null));
    let categry1: any[] = Object.keys(compamtomsheetdataprocess);
    //console.log(compamtomsheetdata2["LP"]);
    console.log(categry1);  
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
      console.log(res);
      this.allcompomdatabydays = res.data;
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
      console.log(res);
      this.allcompomdatabyalldays = res.data;
      this.allcompcolbyalldays = ["OM SHEET","NO OF SHEET","COMPENSATION DAYS","COMPENSATION_AVERAGE"];
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
getCompensationbyCategoryprojectYr(){
this.compamtomsheetcat = this.wildService.getCompensationByCategoryProjectYear();
     this.compamtomsheetcat.subscribe(res => {
    //   console.log(res);
    //   let compamtdata2 = res.data.reduce(function (r, a) {
    //     r[a.HWC_Category] = r[a.HWC_Category] || [];
    //     r[a.HWC_Category].push(a);
    //     return r;
    // },Object.create(null));
//  let categry: any[] = Object.keys(compamtdata2)
//  console.log(categry)
//  console.log(compamtdata2["CR"]);
//  this.crcol = compamtdata2["CR"];
//     this.crpdcol = compamtdata2["CRPD"];
//     this.pdcol = compamtdata2["PD"];
//     this.hicol = compamtdata2["HI"];
//     this.lpcol = compamtdata2["LP"];
//        this.hdcol = compamtdata2["HD"];
      
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
  crcolproj:any;
  crpdcolproj:any=[];
  pdcolproj:any=[];
  lpcolproj:any=[];
  hdcolproj:any=[];
  hicolproj:any=[];
getCompensationbyProjectYearbyCategry(){
  this.compamtomsprojcat = this.wildService.getCompensationByProjectYearbyCategory();
    this.compamtomsprojcat.subscribe(res => {
      console.log(res);
      let compamtdata3 = res.data;
    //reduce(function (r, a) {
    //     r[a.HWC_CATEGORY] = r[a.HWC_CATEGORY] || [];
    //     r[a.HWC_CATEGORY].push(a);
    //     return r;
    // },Object.create(null));
    console.log(compamtdata3);
    console.log(compamtdata3[0]);
//  let categry: any[] = Object.keys(compamtdata3)
//  console.log(categry)
//  console.log(compamtdata3["CR"]);
    });

}

allcompomdatabyprojsheet:any;
  allcompcolbyprojsheet:any=[];
  allcompresbyprojsheet:any;
getCompensationByprojectYearbySheet(){
   this.allcompresbyprojsheet = this.wildService. getCompensationByProjectYearBYSheet();
    this.allcompresbyprojsheet.subscribe(res => {
      console.log(res);
      this.allcompomdatabyprojsheet = res.data;
      this.allcompcolbyprojsheet = ["FREQUENCY","TOTAL","AVERAGE","MAX COMP","MIN COMP"];
    });

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


markers: any = [
  {

    lat: 12.9616883000,
    lng: 77.6017112000
  },
  {

    lat: 12.9617580600,
    lng: 77.6017614600,
  },
  {

    lat: 12.9614955398,
    lng: 77.6015829169
  },
  {

    lat: 12.9619713276,
    lng: 77.6017867484
  },
  {

    lat: 12.9619152940,
    lng: 77.6017196542
  }
]

mapClicked(event) {
  console.log(event);
}

clickedMarker(m, i) {

}

}

