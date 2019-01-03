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
    this.getPublicityByRange();
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
    }
     else{
      this.buttonName = "By Date";

     }

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

      res[0].forEach(element => {
        if(element.VILLAGE_NAME !== null)
        element.VILLAGE_NAME =
        element.VILLAGE_NAME.charAt(0).toUpperCase() + element.VILLAGE_NAME.slice(1);
      });
      res[0].sort((a,b) => b.VILLAGE_FREQ - a.VILLAGE_FREQ);
      this.dataSource2 = res[0];
     // console.log(this.dataSource2);
      this.displayedCol2 = ['Village Name', 'Frequency'];

      res[1].forEach(element => {
        if(element.PARK !== null)
        element.PARK =
        element.PARK.charAt(0).toUpperCase() + element.PARK.slice(1);
      });
      res[1].sort((a,b) => b.PARK_FREQ - a.PARK_FREQ);
      this.dataSource3 = res[1];
      console.log(this.dataSource3)
      this.displayedCol3 = ['Park Name', 'Frequency'];

      res[2].forEach(element => {
        if(element.TALUK !== null)
        element.TALUK =
        element.TALUK.charAt(0).toUpperCase() + element.TALUK.slice(1);
      });
      res[2].sort((a,b) => b.TALUK_FREQ - a.TALUK_FREQ);
      this.dataSource4 = res[2];
      console.log(this.dataSource4);
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
                                month: d.getMonth() + 11 ,
                                day: d.getDate()},
                              formatted: d.getFullYear()-1+"-"+('0' + (d.getMonth()+11 )).slice(-2)+"-"+('0' + (d.getDate())).slice(-2)};
                             }


                          }

  onSubmit(data){
    this.fromDate=data[0];
    this.toDate=data[1];
    this.getPublicityByRange();
  }

  barChart1: any ;
  barChart2: any ;
  barChart3: any ;

  getPublicityByRange(){
    if (this.fromDate !== undefined && this.toDate !== undefined) {
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
