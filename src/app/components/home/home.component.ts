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
//    this.barGraph();
//    this.barGraph2();
    this.casesByYear();
//    this.categoryByYear();
  //   this.lineGraph(this.fromDate, this.toDate);
  // this.lineGraph2(this.fromDate, this.toDate);
  // this.lineGraph3(this.fromDate,this.toDate);
  // this.lineGraph4(this.fromDate,this.toDate);
//  this.getTable1();
}

showByMonth: boolean = false;
showByCat: boolean = false;
showByCatMonth: boolean = false;

toggle1(){

  if(this.showByMonth = !this.showByMonth){

  }
  if(this.showByCat = !this.showByCat){
    this.barGraph2();
  }
  if(this.showByCatMonth = !this.showByCatMonth){

  }

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


   result = this.wildService.getTotalCasesByProject();
   result1 = this.wildService.getCasesByYear();
casesByYear(){

  let record: any = [];
  let labelNames: any = []
  this.result.subscribe(res => {
  //  console.log(res)
//  let  data1 = res.data;
  let data1 = JSON.parse(res.data);
  console.log(data1[0]);
  let i = 0;
  data1.forEach(element => {

     record[i++] = element.reduce((sum, item) => sum + item.NO_OF_CASES, 0);
     labelNames.push("projYear" + (i));
    });
console.log(record);
Chart.Legend.prototype.afterFit = function() {
  this.height = this.height + 30;
};

let bar= new Chart("bar" , {
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

for(let i=0; i<record.length; i++){
//  barChart[i].data.labels.push(element.MONTH);
  bar.data.datasets[0].data.push(record[i]);
}
//console.log(data1);
bar.update();
});

  // by month

  this.result1.subscribe(res => {


  let data2 = res.data;

  console.log(data2[1]);
  let result = data2[1].reduce(function (r, a) {
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
          backgroundColor: "#ffbf00",
          "borderWidth":1,

          label: 'Cases',
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
          backgroundColor: "#ffbf00",
          "borderWidth":1,
          label: 'CRPD',
          file: false
        },
        {
          data: [],
          backgroundColor: "#011627",
          "borderWidth":1,
          label: 'PD',
          file: false
        },
        {
          data: [],
          backgroundColor: "#2ec4b6",
          "borderWidth":1,
          label: 'LP',
          file: false
        },
        {
          data: [],
          "backgroundColor": "grey",
          "borderWidth":1,
          label: 'HI',
          file: false
        },
        {
          data: [],
          "backgroundColor": "chocolate",
          "borderWidth":1,
          label: 'HD',
          file: false
        }
      ]
    },

    options: {
      title: {
        text: "Number of cases in each year, for each HWC category",
        display: true
      },
      legend: {
        labels: {
          boxWidth: 10,
          fontSize: 8
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
        backgroundColor: "#ffbf00",
        "borderWidth":1,
        label: 'CRPD',
        file: false
      },
      {
        data: [],
        backgroundColor: "#011627",
        "borderWidth":1,
        label: 'PD',
        file: false
      },
      {
        data: [],
        "backgroundColor": "#2ec4b6",
        "borderWidth":1,
        label: 'LP',
        file: false
      },
      {
        data: [],
        backgroundColor: "grey",
        "borderWidth":1,
        label: 'HI',
        file: false
      },
      {
        data: [],
        backgroundColor: "chocolate",
        "borderWidth":1,
        label: 'HD',
        file: false
      }
    ]
  },

  options: {
    title: {
      text: "Number of cases in each year, by month for each HWC category",
      display: true
    },
    legend: {
        labels: {
          boxWidth: 10,
          fontSize: 8
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

