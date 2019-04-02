import { Component, OnInit , ViewChild} from '@angular/core';

import { ConnectorService } from '../../services/connector.service';
import { ExcelService } from '../../services/excel.service';

import { MatTableDataSource, MatPaginator } from '@angular/material';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import * as GeoJSON from 'geojson';
import * as tokml from 'tokml';
import {FileSaver,saveAs} from 'file-saver';


import { Chart } from 'chart.js';

// var GeoJSON = require('geojson');
// var tokml =  require('tokml');

@Component({
  selector: 'app-daily-count',
  templateUrl: './daily-count.component.html',
  styleUrls: ['./daily-count.component.scss'],
  providers: [ConnectorService]
})
export class DailyCountComponent implements OnInit {

  public myDatePickerOptions: any = {
    // other options...
    dateFormat: 'yyyy-mm-dd',
};

  geoJsonData = [
    { name: 'Location A', category: 'Store', street: 'Market', lat: 39.984, lng: -75.343 },
    { name: 'Location B', category: 'House', street: 'Broad', lat: 39.284, lng: -75.833 },
    { name: 'Location C', category: 'Office', street: 'South', lat: 39.123, lng: -74.534 },
    { name: 'Location D', category: 'home', street: 'East', lat: 12.9716, lng: 77.5946 }

  ];
  obj;
  record: any;
  dataSource: any;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  totalPost = 10;
  postPerPage = 10;
  pageSizeOptions = [5, 10, 20, 50, 100];
  constructor(private wildService: ConnectorService, private excelService: ExcelService, private spinnerService: Ng4LoadingSpinnerService) { }

  displayedCol = [
    'DC_METAINSTANCE_ID',
    'DC_DEVICE_ID',
    'DC_SIMCARD_ID',
    'DC_FA_ID',
    'DC_CASE_ID',
    'DC_USER_NAME'
  ];

  ngOnInit() {
  //   this.obj = GeoJSON.parse(this.geoJsonData, {Point: ['lat', 'lng']});
  //   var kmlNameDescription = tokml(this.obj, {
  //     name: 'name',
  //     description: 'description'
  // });
  // this.saveAsKmlFile(kmlNameDescription,'Sample' );
    this.spinnerService.show();
    this.getTotalDailyCount();
    this.getDateRange();
    this.getDCcasesvsHWC();
    //this.exportdata();

   // this.getTotalDailyCountByDate();
    // this.record = this.wildService.getDailyCountUsers();
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
  private saveAsKmlFile(buffer: any, fileName: string): void {
    const data: Blob = new Blob([buffer]);
    FileSaver.saveAs(data, fileName + '_export_' + new Date().getTime() + '.kml');
  }

 downloadImage(data, myImage) {
  /* save as image */
  var link = document.createElement('a');
//  link.href = this.bar.toBase64Image();
  link.href = data.toBase64Image();
  link.download = myImage +'.png';
  link.click();
}

  ConvertToCSV(objArray) {
    const array = typeof objArray !== 'object' ? JSON.parse(objArray) : objArray;
      let str = '';
    let row = '';

     // tslint:disable-next-line:forin
     for (const index in objArray[0]) {
         // Now convert each value to string and comma-separated
         row += index + ',';
     }
     row = row.slice(0, -1);
     // append Label row with line break
     str += row + '\r\n';

     for (let i = 0; i < array.length; i++) {
        let line = '';
         // tslint:disable-next-line:forin
         for (const index in array[i]) {
             // tslint:disable-next-line:curly
             if (line !== '') line += ',';

             line += array[i][index];
         }
         str += line + '\r\n';
     }
     return str;
 }

 download(data) {
  const csvData = this.ConvertToCSV(data);
                         const a = document.createElement('a');
                          a.setAttribute('style', 'display:none;');
                          document.body.appendChild(a);
                         const blob = new Blob([csvData], { type: 'text/csv' });
                         const url = window.URL.createObjectURL(blob);
                          a.href = url;
                          a.download = 'Daily_count.csv'; /* your file name*/
                          a.click();
                          return 'success';
  }

  xlsxReport(data, name) {
  let xlsdata = this.excelService.exportAsExcelFile(data, name);
  return  xlsdata;
 //   return 'success';
  }
content:any;
  zipfolder(){


//zip.file();

//	this.content = zip.generate();


// zip.generateAsync({type:"blob"}).then(function(content) {
//     // see FileSaver.js
//     saveAs(content, "export.zip");
    console.log(this.content);
  }
//    exportdata(){

//       let datas1 = this.xlsxReport(this.dataSource1, 'Total_case_by_park(DC)');
//       console.log(datas1)
//      var zip = new JSZip();

//     zip.file(datas1);

// zip.generateAsync({type:"blob"}).then(function(content) {
//     // see FileSaver.js
//     saveAs(content, "example.zip");
// });

//     // this.xlsxReport(this.dataSource2, 'Total_case_by_hwc_cat(DC)');
//     // this.xlsxReport(this.dataSource4, 'HWC_category');
//     // this.xlsxReport(this.dataSource3, 'Total_Number_of_Cases_Field_Assistant');

//   }

  showMainContent: boolean = false;

  buttonName: any = "Date Range"

  showHideButton() {
    if(this.showMainContent = !this.showMainContent){
      this.buttonName = "All Cases";
      this.getTotalDailyCountByDate();
      this.getDCHWCcasesbycat();

    }
     else{
      this.buttonName = "Date Range";

     }

  }

  onSubmit(fDate, tDate){
    this.fromDate=fDate;
    this.toDate=tDate;

    this.getTotalDailyCountByDate();
    this.getDCHWCcasesbycat();

    // this.lineGraph(this.fromDate, this.toDate);
    // this.lineGraph2(this.fromDate,this.toDate);
    // this.lineGraph3(this.fromDate,this.toDate);
    // this.lineGraph4(this.fromDate,this.toDate);
  }


  dataSource1: any;
  dataSource2: any;
  dataSource3: any;
  dataSource4: any;

  fromDate;
  toDate;
  displayedCol1: any = [];
  displayedCol2: any = [];
  displayedCol3: any = [];
  displayedCol4: any = [];



  tableType1 = 'Park';
  tableType2 = 'each Field Assistant';
length4: any;
length3:any;
  getTotalDailyCount() {
    this.record = this.wildService.getTotalDC();
    this.record.subscribe(res => {
      //console.log(res);
      this.dataSource1 = res[0];
      this.displayedCol1 = ['Total DC Cases', 'Total NH Cases', 'Total BP Cases'];
     // console.log(this.dataSource1);

      this.dataSource2 = res[1];
      this.displayedCol2 = ['Crop Loss', 'Crop & Property Loss', 'Property Loss', 'Livestock Predation', 'Human Injury', 'Human Death', 'Total'];

      this.dataSource3 = res[2];
      this.length3 = this.dataSource3.length;
      this.displayedCol3 = ['Field Assistant','Total'];

      this.dataSource4 = res[3];
      //console.log(this.dataSource4);
      this.length4 = this.dataSource4.length;
      this.displayedCol4 = ['Field Assistant','Crop Loss', 'Crop & Property Loss' , 'Property Loss', 'Livestock Predation', 'Human Injury', 'Human Death']
    });
  }


  //DC cases Versus HWC cases API
dchwcrecord:any;
datasourcedcvshwc:any;
displayedCol4dchwc: any = [];
datadcvshwc: any=[];

  getDCcasesvsHWC(){
    this.dchwcrecord = this.wildService.getDCvsHWC(this.fromDate.formatted, this.toDate.formatted);
    this.dchwcrecord.subscribe(res => {
   // console.log(res);
    this.datasourcedcvshwc = res.data;
   // console.log(this.datasourcedcvshwc);
   let i=0;
    this.datasourcedcvshwc.forEach(element =>
    {
     this.datadcvshwc[i++] = element.Cases;
    })
    this.displayedCol4dchwc = ["DC Cases","HWC Cases"];

    });
  }

  //DC and HWC Cases By category

  dchwcbycatgraph:any;
  dchwcbycat:any;
  result4:any;
  barCatProj1:any;
  datadchwcbycat:any;

  getDCHWCcasesbycat(){

  let labelNames: any = [];

  let years:any[] = ["CR","CRPD","PD","LP","HI","HD"];
   this.dchwcbycat = this.wildService.getDCHWCBycat(this.fromDate.formatted, this.toDate.formatted);
    this.dchwcbycat.subscribe(res => {
      this.datadchwcbycat = res.data;

      if(this.barCatProj1 !== undefined){
        this.barCatProj1.destroy();
      }

   this.barCatProj1= new Chart("barCatProj", {
      type: 'bar',
      data:{
        labels: years,
        datasets: [
          {
            data: [this.datadchwcbycat[0].CR,this.datadchwcbycat[0].CRPD,this.datadchwcbycat[0].PD,this.datadchwcbycat[0].LP,this.datadchwcbycat[0].HI,this.datadchwcbycat[0].HD],
            backgroundColor: "#ffbf00",
            "borderWidth":1,
            label: 'DC Cases',
            file: false
          },
          {
            data: [this.datadchwcbycat[1].CR,this.datadchwcbycat[1].CRPD,this.datadchwcbycat[1].PD,this.datadchwcbycat[1].LP,this.datadchwcbycat[1].HI,this.datadchwcbycat[1].HD],
            backgroundColor: "#e71d36",
            "borderWidth":1,
            label: 'HWC Cases',
            file: false
          }

        ]
      },

      options: {
        title: {
          text: "DC Cases And HWC Cases By HWC Category",
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

      this.barCatProj1.update();
    });
  }

  getDateRange(){
    var d: Date = new Date();
  //  console.log(d);
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
                                month:  d.getMonth() + 11  ,
                                day: d.getDate()},
                              formatted: d.getFullYear()-1+"-"+('0' + (d.getMonth() + 11)).slice(-2)+"-"+('0' + (d.getDate())).slice(-2)};
                             }

                          }



  lineChart: any = [];
  barChart: any ;
  result: any;
  val: any = [];
  displayedCol5: any;
  length5: any;
  getTotalDailyCountByDate() {
    if (this.fromDate !== undefined && this.toDate !== undefined) {
    this.record = this.wildService.getTotalDCByDate(this.fromDate.formatted, this.toDate.formatted);
    this.record.subscribe(res => {
      //console.log(res);
      let data = res;
      let dateArr1: Array<string> = [];
      let dateArr2: Array<string> = [];
      let dataArr1: any = [];
      let crop: any ;
      let cropProperty: any ;
      let humanDeath: any ;
      let humanInjury: any;
      let liveStock: any;
      let property: any ;
      let total: any;

      this.val = data[0];
      this.length5 = this.val,length;
        this.displayedCol5 = ["DC Date", "Frequency"];

      // data[0].forEach(element => {
      //   if (element.CASE_DATE !==undefined && element.DC_TOTAL_CASES !== undefined){
      //   dateArr1.push(element.CASE_DATE);
      //   dataArr1.push(element.DC_TOTAL_CASES);
      // }
      // });

//       var months = ['January', 'Febuary', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
//       console.log(dateArr1[0]);
//       var date = dateArr1[0];
// var newdate = date.split("-").reverse().join("-");
//        console.log(newdate);
//       // console.log(dataArr1);
//    var newD = new Date(newdate);
//     console.log(months[newD.getMonth()]);
      // this.lineChart = new Chart('canvas', {
      //   type: 'line',
      //   data: {
      //     labels: dateArr1.reverse(),
      //     datasets: [
      //       {
      //         data: dataArr1,
      //         borderColor: 'brown',
      //         label: 'DC Total Cases',
      //         file: false,
      //         "fill" : false
      //       }
      //     ]
      //   },
      //   options: {
      //     responsive: true, maintainAspectRatio: false,
      //     legend : {
      //      display: true,
      //      labels: {
      //        boxWidth: 10,
      //      fontSize: 8
      //      },
      //      position: "right",

      //    }
      //   }
      // });


   // console.log(data[1]);
    total = 0;
    crop = 0;
    cropProperty = 0;
    humanDeath = 0;
    humanInjury = 0;
    liveStock = 0;
    property = 0;

    this.result = data[1];
   // console.log(this.result);
    for (let i = 0; i < this.result.length; i++) {  //loop through the array
      total += Number(this.result[i].TOTAL);
      crop += Number(this.result[i].CROP);
      property += Number(this.result[i].PROPERTY);
      cropProperty += Number(this.result[i].CROP_PROPERTY);
      liveStock += Number(this.result[i].LIVESTOCK);
      humanInjury += Number(this.result[i].HUMAN_INJURY);
      humanDeath += Number(this.result[i].HUMAN_DEATH);
  }
//    console.log(this.result);

  let dataArr : any = [

    {"name": "Crop Loss","value": crop},
    {"name": "Crop & Property Loss","value": cropProperty},
    {"name": "Property Loss","value": property},
    {"name": "Livestock Predation","value": liveStock},
    {"name": "Human Injury","value": humanInjury},
    {"name": "Human Death","value": humanDeath},

];
//console.log(dataArr);
    // data[1].forEach(element => {
    //   if(element.CASE_DATE !== undefined){
    //     dateArr2.push(element.CASE_DATE);
    //     crop.push(element.CROP);
    //     cropProperty.push(element.CROP_PROPERTY);
    //     humanDeath.push(element.HUMAN_DEATH);
    //     humanInjury.push(element.HUMAN_INJURY);
    //     liveStock.push(element.LIVESTOCK);
    //     property.push(element.PROPERTY);
    //     total.push(element.TOTAL);
    //   }
    // });

    // console.log(dateArr2);
    // console.log(crop);

    if(this.barChart !== undefined){
      this.barChart.destroy();
    }
    Chart.Legend.prototype.afterFit = function() {
      this.height = this.height + 40;
    };

 // let  labelsArr = ['Total', 'Crop Loss',  'Crop & Property Loss', 'Property Loss', 'Livestock Predation' , 'Human Injury', 'Human Death']

    this.barChart = new Chart('can', {
      type: 'bar',
      data: {
        labels: [],
        datasets: [
          {
            data: [],
            label: 'Record',
            backgroundColor: 'chocolate',
            borderWidth: 1,
          }

        ]
      },
      options: {
        title: {
          text: "Daily Count Cases By Category [" + this.fromDate.formatted +' to ' + this.toDate.formatted + "]",
          display: true
        },
        responsive: true, maintainAspectRatio: false,
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
      },

      });
      dataArr.forEach(element => {
        // element.VILLAGE =
        // element.VILLAGE.charAt(0).toUpperCase() + element.VILLAGE.slice(1);
        this.barChart.data.labels.push(element.name);
        this.barChart.data.datasets[0].data.push(element.value);
    });
    this.barChart.update();

    Chart.pluginService.register({
      afterDraw: function (chart) {
                      if (chart.data.datasets[0].data[0] === 0) {
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

  //console.log(this.barChart);

    });
    }
  }


}
