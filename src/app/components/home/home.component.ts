import { Component, OnInit, ViewChild } from '@angular/core';
import { Chart } from 'chart.js';
import { MatTableDataSource, MatPaginator } from '@angular/material';

import {IMyDpOptions, IMyDate} from 'mydatepicker';
import { ConnectorService } from '../../services/connector.service';

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

  constructor(private wildService: ConnectorService) {
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

  ngOnInit() {
    this.barGraph();
    this.barGraph2();
    this.casesByYear();
    this.categoryByYear();
  //   this.lineGraph(this.fromDate, this.toDate);
  // this.lineGraph2(this.fromDate, this.toDate);
  // this.lineGraph3(this.fromDate,this.toDate);
  // this.lineGraph4(this.fromDate,this.toDate);
  this.getTable1();
}



  onSubmit(data){
    this.fromDate=data[0];
    this.toDate=data[1];
    // this.lineGraph(this.fromDate, this.toDate);
    // this.lineGraph2(this.fromDate,this.toDate);
    // this.lineGraph3(this.fromDate,this.toDate);
    // this.lineGraph4(this.fromDate,this.toDate);
  }

  dataSet: any;
  lineChart = [];
  barChart = [];
  record: any;
//  fromDate: any;
 // toDate: any;

//   lineGraph(fromdate, todate) {
//   this.fromDate = fromdate;
//   this.toDate = todate;
//   if (this.fromDate !== undefined && this.toDate !== undefined) {
//    this.record =  this.wildService.getBpNhByRange(this.fromDate.formatted, this.toDate.formatted);
//   this.record.subscribe(res => {
//     this.dataSet = res.data;
//     const date = [];
//    const nh_case = [];
//    const bp_case = [];
//    this.dataSet.forEach(element => {
//     //console.log(element);
//      date.push(element.CASE_DATE);
//      nh_case.push(element.NH_CASES);
//      bp_case.push(element.BP_CASE);
//    });
//     date;
//     nh_case;
//     bp_case;


//      this.lineChart = new Chart('canvas', {
//        type: 'line',
//        data: {
//          labels: date.reverse(),
//          datasets: [
//            {
//              data: nh_case,
//              borderColor: '#3cba9f',
//              label: 'NH_CASES',
//              file: false,
//              "fill" : false
//            },
//            {
//             data: bp_case,
//             borderColor: '#ffcc00',
//             label: 'BP_CASES',
//             file: false,
//             "fill" : false
//           }
//          ]
//        },
//        options: {
//         responsive: true, maintainAspectRatio: false,
//          legend : {
//           display: true,
//           labels: {
//             boxWidth: 10,
//           fontSize: 8
//           },
//         //  position: "right",

//         }
//        }
//      });

//     });
//   }
//    }


//    lineGraph2(fromdate, todate) {
//     this.fromDate = fromdate;
//     this.toDate = todate;
//     if (this.fromDate !== undefined && this.toDate !== undefined) {
//      this.record =  this.wildService.getBpNhByCategory(this.fromDate.formatted, this.toDate.formatted);
//     this.record.subscribe(res => {
//       this.dataSet = res.data;
//        const dateArr = [ ];
//       const crpd_cases = [];
//     // const bp_case = [];
//     // const pd_dates = [];

//      const pd_cases = [];

//     // // const lp_dates = [];
//      const lp_cases = [];

//     // // const cr_dates = [];
//      const cr_cases = [];

//     // // const hi_dates = [];
//      const hi_cases = [];

//     this.dataSet.forEach(element => {
//       if(!dateArr.includes(element.CASE_DATE)){
//         dateArr.push(element.CASE_DATE);
//       }

//     });
// dateArr;
//     for(let i = 0; i<dateArr.length;i++){
//       this.dataSet.forEach(element => {
//         if(dateArr[i] === element.CASE_DATE && element.CATEGORY === "CRPD"){
//           crpd_cases.push(element.TOTAL_BP_NH_CASES)
//         }
//         // else {
//         //   crpd_cases.push(0);
//         // }
//         crpd_cases;
//         if(dateArr[i] === element.CASE_DATE && element.CATEGORY === "PD"){
//           pd_cases.push(element.TOTAL_BP_NH_CASES)
//         }
//         // else {
//         //   pd_cases.push(0);
//         // }
//         pd_cases;
//         if(dateArr[i] === element.CASE_DATE && element.CATEGORY === "LP"){
//           lp_cases.push(element.TOTAL_BP_NH_CASES)
//         }
//         // else {
//         //   lp_cases.push(0);
//         // }
//         if(dateArr[i] === element.CASE_DATE && element.CATEGORY === "CR"){
//           cr_cases.push(element.TOTAL_BP_NH_CASES)
//         }
//         // else {
//         //   cr_cases.push(0);
//         // }
//         if(dateArr[i] === element.CASE_DATE && element.CATEGORY === "HI"){
//           hi_cases.push(element.TOTAL_BP_NH_CASES)
//         }
//         // else {
//         //   hi_cases.push(0);
//         // }
//       });
//     }



//        this.lineChart = new Chart('can', {
//          type: 'line',
//          data: {
//            labels: dateArr,
//            datasets: [
//              {
//                data: crpd_cases,
//                "borderColor":"rgb(0, 0, 255)",
//                label: 'CRPD_CASES',
//                file: false,
//                "fill" : false,
//              },
//              {
//               data: pd_cases,
//               borderColor: '#ffcc00',
//               label: 'PD_CASES',
//               file: false,
//               "fill" : false,
//             },
//             {
//               data: lp_cases,
//               "borderColor":"rgb(75, 192, 192)",
//               label: 'LP_CASES',
//               file: false,
//               "fill" : false,
//             },
//             {
//               data: cr_cases,
//               "borderColor":"rgb(175, 92, 92)",
//               label: 'CR_CASES',
//               file: false,
//               "fill" : false,
//             },
//             {
//               data: hi_cases,
//               "borderColor":"rgb(5, 12, 52)",
//               label: 'HI_CASES',
//               file: false,
//               "fill" : false,
//             },

//            ]
//          },
//          options: {
//           responsive: true, maintainAspectRatio: false,
//            legend : {
//             display: true,
//             labels: {
//               boxWidth: 10,
//             fontSize: 8
//             },
//           //  position: "right",

//           }
//          }
//        });

//       });
//     }
//     }


//     lineGraph3(fromdate, todate) {
//       this.fromDate = fromdate;
//       this.toDate = todate;
//       if (this.fromDate !== undefined && this.toDate !== undefined) {
//       this.record =  this.wildService.getBpByCategory(this.fromDate.formatted, this.toDate.formatted);
//       this.record.subscribe(res => {
//         this.dataSet = res.data;
//          const dateArr = [ ];
//         const crpd_cases = [];
//       // const bp_case = [];
//       // const pd_dates = [];

//        const pd_cases = [];

//       // // const lp_dates = [];
//        const lp_cases = [];

//       // // const cr_dates = [];
//        const cr_cases = [];

//       // // const hi_dates = [];
//        const hi_cases = [];

//       this.dataSet.forEach(element => {
//         if(!dateArr.includes(element.CASE_DATE)){
//           dateArr.push(element.CASE_DATE);
//         }

//       });

//       for(let i = 0; i<dateArr.length;i++){
//         this.dataSet.forEach(element => {
//           if(dateArr[i] === element.CASE_DATE && element.CATEGORY === "CRPD"){
//             crpd_cases.push(element.BP_CASES)
//           }
//           // else {
//           //   crpd_cases.push(0);
//           // }
//           crpd_cases;
//           if(dateArr[i] === element.CASE_DATE && element.CATEGORY === "PD"){
//             pd_cases.push(element.BP_CASES)
//           }
//           // else {
//           //   pd_cases.push(0);
//           // }
//           pd_cases;
//           if(dateArr[i] === element.CASE_DATE && element.CATEGORY === "LP"){
//             lp_cases.push(element.BP_CASES)
//           }
//           // else {
//           //   lp_cases.push(0);
//           // }
//           if(dateArr[i] === element.CASE_DATE && element.CATEGORY === "CR"){
//             cr_cases.push(element.BP_CASES)
//           }
//           // else {
//           //   cr_cases.push(0);
//           // }
//           if(dateArr[i] === element.CASE_DATE && element.CATEGORY === "HI"){
//             hi_cases.push(element.BP_CASES)
//           }
//           // else {
//           //   hi_cases.push(0);
//           // }
//         });
//       }


//          this.lineChart = new Chart('bp', {
//            type: 'line',
//            data: {
//              labels: dateArr,
//              datasets: [
//                {
//                  data: crpd_cases,
//                  "borderColor":"rgb(0, 0, 255)",
//                  label: 'CRPD_CASES',
//                  file: false,
//                  "fill" : false,
//                },
//                {
//                 data: pd_cases,
//                 borderColor: '#ffcc00',
//                 label: 'PD_CASES',
//                 file: false,
//                 "fill" : false,
//               },
//               {
//                 data: lp_cases,
//                 "borderColor":"rgb(75, 192, 192)",
//                 label: 'LP_CASES',
//                 file: false,
//                 "fill" : false,
//               },
//               {
//                 data: cr_cases,
//                 "borderColor":"rgb(175, 92, 92)",
//                 label: 'CR_CASES',
//                 file: false,
//                 "fill" : false,
//               },
//               {
//                 data: hi_cases,
//                 "borderColor":"rgb(5, 12, 52)",
//                 label: 'HI_CASES',
//                 file: false,
//                 "fill" : false,
//               },

//              ]
//            },
//            options: {
//             responsive: true, maintainAspectRatio: false,
//              legend : {
//               display: true,
//               labels: {
//                 boxWidth: 10,
//               fontSize: 8
//               },
//             //  position: "right",

//             }
//            }
//          });

//         });
//       }
//       }

//       lineGraph4(fromdate, todate) {
//         this.fromDate = fromdate;
//         this.toDate = todate;
//         if (this.fromDate !== undefined && this.toDate !== undefined) {
//         this.record =  this.wildService.getNhByCategory(this.fromDate.formatted, this.toDate.formatted);
//         this.record.subscribe(res => {
//           this.dataSet = res.data;
//            const dateArr = [ ];
//           const crpd_cases = [];
//         // const bp_case = [];
//         // const pd_dates = [];

//          const pd_cases = [];

//         // // const lp_dates = [];
//          let lp_cases = [];

//         // // const cr_dates = [];
//          const cr_cases = [];

//         // // const hi_dates = [];
//          const hi_cases = [];

//         this.dataSet.forEach(element => {
//           if(!dateArr.includes(element.CASE_DATE)){
//             dateArr.push(element.CASE_DATE);
//           }

//         });

//         for(let i = 0; i<dateArr.length;i++){
//           this.dataSet.forEach(element => {
//             if(element.CATEGORY === "CRPD") {
//             if(dateArr[i] === element.CASE_DATE ){
//               crpd_cases.push(element.NH_CASES)
//             }
//             // else {
//             //   crpd_cases.push("0");
//             // }
//           }
//             //crpd_cases;
//             if(element.CATEGORY === "PD") {
//             if(dateArr[i] === element.CASE_DATE ){
//               pd_cases.push(element.NH_CASES)
//             }
//             // else {
//             //   pd_cases.push("0");
//             // }
//           }
//            // pd_cases;
//             if(element.CATEGORY === "LP") {
//             if(dateArr[i] === element.CASE_DATE){
//               lp_cases.push(element.NH_CASES)
//             }
//             // else {
//             //   lp_cases.push("0");
//             // }
//           }
//             if(element.CATEGORY === "CR") {
//             if(dateArr[i] === element.CASE_DATE ){
//               cr_cases.push(element.NH_CASES)
//             }
//             // else {
//             //   cr_cases.push("0");
//             // }
//           }
//             if(element.CATEGORY === "HI") {
//             if(dateArr[i] === element.CASE_DATE ){
//               hi_cases.push(element.NH_CASES)
//             }
//             // else {
//             //   hi_cases.push("0");
//             // }
//           }
//           });
//         }
//      //   console.log(crpd_cases);
//         let crpd_sum = crpd_cases.reduce(function(a, b) {return a + b;}, 0);
//       //  console.log(crpd_sum);


//         lp_cases = ["25", "50", "100", "150", "200"];
//           //  cr_cases;
//            this.lineChart = new Chart('nh', {
//              type: 'line',
//              data: {
//                labels: dateArr,
//                datasets: [
//                  {
//                    data: crpd_cases,
//                    "borderColor":"rgb(0, 0, 255)",
//                    label: 'CRPD_CASES',
//                    file: false,
//                    "fill" : false,
//                  },
//                  {
//                   data: pd_cases,
//                   borderColor: '#ffcc00',
//                   label: 'PD_CASES',
//                   file: false,
//                   "fill" : false,
//                 },
//                 {
//                   data: lp_cases,
//                   "borderColor":"rgb(75, 192, 192)",
//                   label: 'LP_CASES',
//                   file: false,
//                   "fill" : false,
//                 },
//                 {
//                   data: cr_cases,
//                   "borderColor":"rgb(175, 92, 92)",
//                   label: 'CR_CASES',
//                   file: false,
//                   "fill" : false,
//                 },
//                 {
//                   data: hi_cases,
//                   "borderColor":"rgb(5, 12, 52)",
//                   label: 'HI_CASES',
//                   file: false,
//                   "fill" : false,
//                 },

//                ]
//              },
//              options: {
//               responsive: true, maintainAspectRatio: false,
//                legend : {
//                 display: true,
//                 labels: {
//                   boxWidth: 10,
//                 fontSize: 8
//                 },
//                 // position: "right",

//               }
//              }
//            });

//           });
//         }
//         }



// bar chart

casesByYear(){
  let result = this.wildService.getCasesByYear();
  result.subscribe(res => {
  let  data1 = res.data[0];
//console.log(data1);
  let barChart1 = new Chart('bar', {
    type: 'bar',
    data:{
      labels: [],
      datasets: [
        {
          data: [],
          backgroundColor: "#e71d36",
          "borderWidth":1,
          label: 'NH_CASES',
          file: false
        }

      ]
    },

    options: {
      title: {
        text: "Number of cases in each year of the project(July to June)",
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
  console.log(typeof data1)
  data1.forEach(element => {
    barChart1.data.labels.push(element.YEAR);
    barChart1.data.datasets[0].data.push(element.NO_OF_CASES);
  });

  barChart1.update();

  // by month

  let data2 = res.data[1];

  let result = data2.reduce(function (r, a) {
    r[a.YEAR] = r[a.YEAR] || [];
    r[a.YEAR].push(a);
    return r;
}, Object.create(null));

let data: any = [];
let barChart: any = [];
//  console.log(result);
//  console.log(Object.values(result)[0]);
let len = Object.keys(result).length
for(let i=0; i < len; i++){
  data[i] = Object.values(result)[i];
// console.log(typeof data15);
   barChart[i]= new Chart("bar"+i , {
    type: 'bar',
    data:{
      labels: [],
      datasets: [
        {
          data: [],
          backgroundColor: "#e71d36",
          "borderWidth":1,

          label: 'NH_CASES',
          file: false
        }

      ]
    },

    options: {
      title: {
        text: "Number of cases in each year by month",
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
    barChart[i].data.labels.push(element.MONTH);
    barChart[i].data.datasets[0].data.push(element.NO_OF_CASES);
  });
  // setTimeout(() => {
  //   barChart2015.update();
  // }, 2000);
//  barChart[i].update();
//console.log(barChart[i]);
}
barChart[0].update();
  });
}

categoryByYear(){
  let _result = this.wildService.getCatByYear();
  _result.subscribe(res => {
    let _data = res.data[0];

    let result: any = _data.reduce(function (r, a) {
      r[a.YEAR] = r[a.YEAR] || [];
      r[a.YEAR].push(a);
      return r;
  }, Object.create(null));


//  console.log(result);
  let barChart: any;
  let data: any;
//  let data: any = Object.values(result)[0]
  let years: any[] = Object.keys(result)
  console.log(years);

  barChart= new Chart("b" , {
    type: 'bar',
    data:{
      labels: years,
      datasets: [
        {
          data: [],
          backgroundColor: "#e71d36",
          "borderWidth":1,
          label: 'CR',
          file: false
        },
        {
          data: [],
          backgroundColor: "#e71d36",
          "borderWidth":1,
          label: 'CRPD',
          file: false
        },
        {
          data: [],
          backgroundColor: "#e71d36",
          "borderWidth":1,
          label: 'PD',
          file: false
        },
        {
          data: [],
          backgroundColor: "#e71d36",
          "borderWidth":1,
          label: 'LP',
          file: false
        },
        {
          data: [],
          backgroundColor: "#e71d36",
          "borderWidth":1,
          label: 'HI',
          file: false
        },
        {
          data: [],
          backgroundColor: "#e71d36",
          "borderWidth":1,
          label: 'HI',
          file: false
        }
      ]
    },

    options: {
      title: {
        text: "Number of cases in each year by month",
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
    barChart.data.datasets[0].data.push(element.NO_OF_CASES);
    else if(element.HWC_CASE_CATEGORY === "CRPD")
    barChart.data.datasets[1].data.push(element.NO_OF_CASES);
    else if(element.HWC_CASE_CATEGORY === "PD")
    barChart.data.datasets[2].data.push(element.NO_OF_CASES);
    else if(element.HWC_CASE_CATEGORY === "LP")
    barChart.data.datasets[3].data.push(element.NO_OF_CASES);
    else if(element.HWC_CASE_CATEGORY === "HI")
    barChart.data.datasets[4].data.push(element.NO_OF_CASES);
    else if(element.HWC_CASE_CATEGORY === "HD")
    barChart.data.datasets[5].data.push(element.NO_OF_CASES);
  });
}

//  console.log(barChart.data.datasets[0]);
  barChart.update();


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


for(let i = 0; i<years.length; i++){
  key = Object.values(result1)[i];
  _res = key.reduce(function (r, a) {
    r[a.MONTH] = r[a.MONTH] || [];
    r[a.MONTH].push(a);
    return r;
  }, Object.create(null));

  let months: any[] = Object.keys(_res);



barChart1= new Chart("b"+ i , {
  type: 'bar',
  data:{
    labels: months,
    datasets: [
      {
        data: [],
        backgroundColor: "#e71d36",
        "borderWidth":1,
        label: 'CR',
        file: false
      },
      {
        data: [],
        backgroundColor: "#e71d36",
        "borderWidth":1,
        label: 'CRPD',
        file: false
      },
      {
        data: [],
        backgroundColor: "#e71d36",
        "borderWidth":1,
        label: 'PD',
        file: false
      },
      {
        data: [],
        backgroundColor: "#e71d36",
        "borderWidth":1,
        label: 'LP',
        file: false
      },
      {
        data: [],
        backgroundColor: "#e71d36",
        "borderWidth":1,
        label: 'HI',
        file: false
      },
      {
        data: [],
        backgroundColor: "#e71d36",
        "borderWidth":1,
        label: 'HI',
        file: false
      }
    ]
  },

  options: {
    title: {
      text: "Number of cases in each year by month",
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
  barChart1.data.datasets[0].data.push(element.NO_OF_CASES);
  else if(element.HWC_CASE_CATEGORY === "CRPD")
  barChart1.data.datasets[1].data.push(element.NO_OF_CASES);
  else if(element.HWC_CASE_CATEGORY === "PD")
  barChart1.data.datasets[2].data.push(element.NO_OF_CASES);
  else if(element.HWC_CASE_CATEGORY === "LP")
  barChart1.data.datasets[3].data.push(element.NO_OF_CASES);
  else if(element.HWC_CASE_CATEGORY === "HI")
  barChart1.data.datasets[4].data.push(element.NO_OF_CASES);
  else if(element.HWC_CASE_CATEGORY === "HD")
  barChart1.data.datasets[5].data.push(element.NO_OF_CASES);
});

}
barChart1.update();
}
// //  console.log(barChart.data.datasets[0]);
 barChart1.update();


  });
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
          file: false
        },
        {
         data: bp_case,
         borderColor: "rgba(0,0,255)",
         backgroundColor: "rgba(0,0,255,0.2)",
         "borderWidth":1,
         label: 'BP_CASES',
         file: false
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

