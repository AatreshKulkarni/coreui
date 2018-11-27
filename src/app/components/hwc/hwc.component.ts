import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';


import { MatTableDataSource, MatPaginator } from '@angular/material';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';

import { ConnectorService } from '../../services/connector.service';
import { ExcelService } from '../../services/excel.service';
import {
  IChartDataset, IHwcBlockA, IBarChartDataSet, IGetblock2TtotalCasesByYearMonth, IBblock2Top20CasesByCat,
  IBblock2Top50CasesByWsid, IBlock3TopCases, IFADateFreq, IHwcDateFreq, IGeoJson, ICoordinates
} from '../../models/hwc.model';
import * as GeoJSON from 'geojson';
import * as tokml from 'tokml';
import * as FileSaver from 'file-saver';
import { from } from 'rxjs';
import { groupBy, mergeMap, toArray } from 'rxjs/operators';
import { Chart } from 'chart.js';
import 'chartjs-plugin-datalabels';



@Component({
  selector: 'app-hwc',
  templateUrl: './hwc.component.html',
  styleUrls: ['./hwc.component.scss'],
  providers: [ConnectorService],

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
  dataSource: any;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  totalPost ;
  postPerPage = 10;
  pageSizeOptions = [5, 10, 20, 50, 100];
  public fromDate: any;
  public toDate: any;
  public toShow: boolean = false;
  public block1HeaderText: string = 'Number of cases by HWC category, animal, Park, Taluk, Range';
  public hwcVillageHeaderText: string = 'Number of Cases by HWC village';
  public hwcCaseByHwcDateHeaderText: string = 'HWC Cases by HWC Date';
  public hwcCaseByFDSubDateHeaderText: string = 'HWC Cases by FD SubDate';
  public block2TotalCasesByYearMonthHeaderText: string = 'Total Cases By Month Year';
  public block2Top20CasesByCatHeaderText: string = 'Top 20 Cases By Category';
  public block2Top50CasesByWsidHeaderText: string = 'Top 50 Cases By WSID';
  public block3TopCasesByCropHeaderText: string = 'Top Cases By Crop';
  public block3TopCasesByPropertyHeaderText: string = 'Top Cases By Property';
  public block3TopCasesByLivestockHeaderText: string = 'Top Cases By Livestock';
  public block3TopCasesByVillageHeaderText: string = 'Top Cases By Village';
  public block2ByFaDateFreqHeaderText: string = "Fa Date Frequency set";
  public block2ByHwcDateFreqHeaderText: string = "Hwc Date Frequency set";

  public block1RresultSet: Array<IChartDataset>;
  public hwcVillageResultSet: Array<IBarChartDataSet>;
  public hwcCasesByHwcDateResultSet: Array<IBarChartDataSet>;
  public hwcCasesByFDSubDateResultSet: Array<IBarChartDataSet>;
  public block2TotalCasesByYearMonthResultSet: Array<IBarChartDataSet>;
  public block2Top20CasesByCatResultSet: Array<IBarChartDataSet>;
  public block2Top50CasesByWsidResultSet: Array<IBarChartDataSet>;
  public block3TopCasesByCropResultSet: Array<IBarChartDataSet>;
  public block3TopCasesByPropertyResultSet: Array<IBarChartDataSet>;
  public block3TopCasesByLivestockResultSet: Array<IBarChartDataSet>;
  public block3TopCasesByVillageResultSet: Array<IBarChartDataSet>;
  public block2ByFaDateFreqResultSet: Array<IBarChartDataSet>;
  public block2ByHwcDateFreqResultSet: Array<IBarChartDataSet>;


  public block1Labels: Array<any>;
  public hwcVillageLabels: Array<string> = [];
  public hwcCaseByHwcDateLabels: Array<any>;
  public hwcCaseByFDSubDateLabels: Array<any>;
  public block2TotalCasesByYearMonthLabels: Array<string>;
  public block2Top20CasesByCatLabels: Array<string>;
  public block2Top50CasesByWsidLabels: Array<string>;
  public block3TopCasesByCropLabels: Array<string>;
  public block3TopCasesByPropertyLabels: Array<string>;
  public block3TopCasesByLivestockLabels: Array<string>;
  public block3TopCasesByVillageLabels: Array<string>;
  public block2ByFaDateFreqLabels: Array<string>;
  public block2ByHwcDateFreqLabels: Array<string>;

  hwcBlockAModel: IHwcBlockA = {
    category: [],
    animal: [],
    park: [],
    taluk: [],
    range: [],
    village: []
  };

  block3TopCasesData: IBlock3TopCases = {
    byCrop: [],
    byProperty: [],
    byLiveStock: [],
    byVillage: []
  };

  _arr: Array<IGeoJson> = [];
  animalChartByHwc: any;

  constructor(private wildService: ConnectorService, private excelService: ExcelService,
    private spinnerService: Ng4LoadingSpinnerService) { }

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
displayedCol = [];
  ngOnInit() {
    this.spinnerService.show();
    this.record = this.wildService.getHWC();
    this.record.subscribe(res => {
      if (!res) {
        this.spinnerService.hide();
        return;
      }
      this.totalPost = res.length;
      this.dataSource = new MatTableDataSource(res.response);
      this.dataSource.paginator = this.paginator;
      this.spinnerService.hide();
    });
    this.getDateRange();
    this.block1Graph();
    this.block1ByHwcDate();
    this.getBlock2TotalCasesByYearMonthGraph();
    this.getBblock2Top20CasesByCatGraph();
    this.getBblock2Top50CasesByWsidGraph();
    this.getBlock3TopCasesGraph();
  //  this.toShow = true;
  //  this.block1HwcCasesByDateGraph();
    this.block1HwcCasesByFDSubDateGraph();
    this.getblock2ByFaDateFreq();
    this.getBlock2ByHwcDateFreq();
  }


  getDateRange() {
    var d: Date = new Date();
    this.toDate = {
      date: {
        year: d.getFullYear(),
        month: d.getMonth() + 1,
        day: d.getDate()
      },
      formatted: d.getFullYear() + "-" + ('0' + (d.getMonth() + 1)).slice(-2) + "-" + ('0' + (d.getDate())).slice(-2)
    };
    this.fromDate = {
      date: {
        year: d.getFullYear(),
        month: d.getMonth() ,
        day: d.getDate()
      },
      formatted: d.getFullYear() + "-" + ('0' + (d.getMonth() )).slice(-2) + "-" + ('0' + (d.getDate())).slice(-2)
    };
  }

  private saveAsKmlFile(buffer: any, fileName: string): void {
    const data: Blob = new Blob([buffer]);
    FileSaver.saveAs(data, fileName + '_export.kml');
  }

  xlsxReport() {
    this.excelService.exportAsExcelFile(this.dataSource.data, 'HWC');
    return 'success';
  }
  kmlReport() {
    var kmlData = {}
    for (let i = 0; i < this.dataSource.data.length; i++) {
      kmlData = { Name: this.dataSource.data[i].HWC_TALUK_NAME, Park: this.dataSource.data[i].HWC_PARK_NAME, lat: this.dataSource.data[i].HWC_LATITUDE, lng: this.dataSource.data[i].HWC_LONGITUDE }
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
      this._arr.push({ Name: val[0].Name, Park: val[0].Park,  points: [[]] });  //styles: this.newStyle(),
      let _index = this._arr.length;

      val.forEach((x, index) => {
        this._arr[_index - 1].points[0].push([x.lat, x.lng]);
      });

    });

    //  GeoJSON.defaults = { Polygon: 'points', include: ['Park'],  'extra' : { style: 'styles'}};
    this.obj = GeoJSON.parse(this._arr,
      { Polygon: 'points', extra: { style: this.newStyle()}, include: ['Park']});
    var kmlNameDescription = tokml(this.obj, {
      name: 'Name',
      description: 'description'
    });
    this.saveAsKmlFile(kmlNameDescription, 'HWC');
  }

  newStyle() {
    return {
      'weight': 2,
      'opacity': 1,
      'color': this.getRandomColor(),
    };
  }

  getRandomColor() {
    var color = Math.floor(0x1000000 * Math.random()).toString(16);
    return '#' + ('000000' + color).slice(-6);
  }

  onSubmit(data) {
    this.fromDate = data[0];
    this.toDate = data[1];
 //   this.toShow = true;
    this.block1ByHwcDate();
  //  this.block1HwcCasesByDateGraph();
    this.block1HwcCasesByFDSubDateGraph();
    this.getblock2ByFaDateFreq();
    this.getBlock2ByHwcDateFreq();
  }

  // chartType = 'Category';
  // chartType1 = 'Taluk';

  categoryArr:any = [];
  dataCat:any = [];
  dataAnimal: any = [];
  dataPark: any = [];
  dataTaluk: any = [];
  dataRange: any = [];
  dataVillage: any = [];

  catChart;
  animalChart;
  parkChart;
  talukChart;
  rangeChart;
  villageChart;

  cat:number = 0;

// First Graph

  private block1Graph() {
     this.record = this.wildService.getHwcGetBlock1();

     this.record.subscribe(res => {
       this.dataCat = res[0];
       console.log(this.dataCat);
       Chart.defaults.global.plugins.datalabels.anchor = 'end';
Chart.defaults.global.plugins.datalabels.align = 'end';

    this.catChart = new Chart('category',{
      type: 'bar',
      data: {
        labels:[],
        datasets: [{
          backgroundColor: '#ffbf00',
          label: 'frequency',
          data: []
        }]
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        scales:{
        yAxes: [
          {
          ticks: {
            beginAtZero: true
          }
        }
      ]
        }
      }
      }
    )

    this.dataCat.forEach(element => {
      this.catChart.data.labels.push(element.CATEGORY);
      this.catChart.data.datasets[0].data.push(element.CAT_FREQ);
      });
      // console.log(this.catChart.data.labels);
      // console.log(this.catChart.data.datasets[0].data);
      this.catChart.update();

      this.dataAnimal = res[1];
      this.animalChart = new Chart('animal',{
        type: 'bar',
        data: {
          labels:[],
          datasets: [{
            backgroundColor: '#ffbf00',
            label: 'frequency',
            data: []
          }]
        },
        options: {
          responsive: true, maintainAspectRatio: false,
          scales:{
          yAxes: [
            {
            ticks: {
              beginAtZero: true
            }
          }
        ]
          }
        }
        }
      )

      this.dataAnimal.forEach(element => {
        this.animalChart.data.labels.push(element.ANIMAL);
        this.animalChart.data.datasets[0].data.push(element.ANIMAL_FREQ);
        });
        // console.log(this.animalChart.data.labels);
        // console.log(this.animalChart.data.datasets[0].data);
        this.animalChart.update();


        this.dataPark = res[2];
        this.parkChart = new Chart('park',{
          type: 'bar',
          data: {
            labels:[],
            datasets: [{
              backgroundColor: '#ffbf00',
              label: 'frequency',
              data: []
            }]
          },
          options: {
            responsive: true, maintainAspectRatio: false,
            scales:{
            yAxes: [
              {
              ticks: {
                beginAtZero: true
              }
            }
          ]
            }
          }
          }
        )

        this.dataPark.forEach(element => {
          this.parkChart.data.labels.push(element.PARK);
          this.parkChart.data.datasets[0].data.push(element.PARK_FREQ);
          });
          // console.log(this.parkChart.data.labels);
          // console.log(this.parkChart.data.datasets[0].data);
          this.parkChart.update();

          this.dataTaluk = res[3];
          this.talukChart = new Chart('taluk',{
            type: 'bar',
            data: {
              labels:[],
              datasets: [{
                backgroundColor: '#ffbf00',
                label: 'frequency',
                data: []
              }]
            },
            options: {
              responsive: true, maintainAspectRatio: false,
              scales:{
              yAxes: [
                {
                ticks: {
                  beginAtZero: true
                }
              }
            ]
              }
            }
            }
          )

          this.dataTaluk.forEach(element => {
            this.talukChart.data.labels.push(element.TALUK);
            this.talukChart.data.datasets[0].data.push(element.TALUK_FREQ);
            });
            this.talukChart.update();


            this.dataRange = res[4];
            this.rangeChart = new Chart('range',{
              type: 'bar',
              data: {
                labels:[],
                datasets: [{
                  backgroundColor: '#ffbf00',
                  label: 'frequency',
                  data: []
                }]
              },
              options: {
                responsive: true, maintainAspectRatio: false,
                scales:{
                  xAxes: [{
                    ticks: {
                        autoSkip: false,
                        maxRotation: 90,
                        minRotation: 90
                    }
                }],
                yAxes: [
                  {
                  ticks: {
                    beginAtZero: true
                  }
                }
              ]
                }
              }
              }
            )

            this.dataRange.forEach(element => {
              this.rangeChart.data.labels.push(element.HWC_RANGE);
              this.rangeChart.data.datasets[0].data.push(element.RANGE_FREQ);
              });
              this.rangeChart.update();

              this.dataVillage = res[5];
              this.villageChart = new Chart('village',{
                type: 'bar',
                data: {
                  labels:[],
                  datasets: [{
                    backgroundColor: '#ffbf00',
                    label: 'frequency',
                    data: []
                  }]
                },
                options: {
                  responsive: true, maintainAspectRatio: false,
                  scales:{
                    xAxes: [{
                      ticks: {
                          autoSkip: false,
                          maxRotation: 90,
                          minRotation: 90
                      }
                  }],
                  yAxes: [
                    {
                    ticks: {
                      beginAtZero: true
                    }
                  }
                ]
                  }
                }
                }
              )

              this.dataVillage.forEach(element => {
                this.villageChart.data.labels.push(element.VILLAGE);
                this.villageChart.data.datasets[0].data.push(element.VILLAGE_FREQ);
                });
                // console.log(this.villageChart.data.labels);
                // console.log(this.villageChart.data.datasets[0].data);
                this.villageChart.update();



      })


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
    this.record = this.wildService.getHwcCasesByHwcDate(this.fromDate.formatted, this.toDate.formatted);

    this.record.subscribe(res => {
      this.dataCat = res[0];

       this.result1 = this.dataCat.reduce(function(res, obj) {
        if (!(obj.CATEGORY in res)){
            res.__array.push(res[obj.CATEGORY] = obj);
            res}
        else {
            res[obj.CATEGORY].CAT_FREQ += obj.CAT_FREQ;
            // res[obj.category].bytes += obj.bytes;
        }
        return res;
    }, {__array:[]}).__array
                    .sort(function(a,b) { return b.bytes - a.bytes; });

   this.catChartByHwc = new Chart('categorybyhwc',{
     type: 'bar',
     data: {
       labels:[],
       datasets: [{
         backgroundColor: '#ffbf00',
         label: 'frequency',
         data: []
       }]
     },
     options: {
       responsive: true, maintainAspectRatio: false,
       scales:{
       yAxes: [
         {
         ticks: {
           beginAtZero: true
         }
       }
     ]
       }
     }
     }
   )
    console.log(this.result1);
   this.result1.forEach(element => {

     this.catChartByHwc.data.labels.push(element.CATEGORY);
     this.catChartByHwc.data.datasets[0].data.push(element.CAT_FREQ);
     });
     console.log(this.catChartByHwc.data.labels);
     console.log(this.catChartByHwc.data.datasets[0].data);

     this.catChartByHwc.update();


  // Animal

     this.dataAnimal = res[1];
     this.result = this.dataAnimal.reduce(function(res, obj) {
      if (!(obj.ANIMAL in res)){
          res.__array.push(res[obj.ANIMAL] = obj);
          res}
      else {
          res[obj.ANIMAL].ANIMAL_FREQ += obj.ANIMAL_FREQ;
          // res[obj.category].bytes += obj.bytes;
      }
      return res;
  }, {__array:[]}).__array
                  .sort(function(a,b) { return b.bytes - a.bytes; });

 this.animalChartByHwc = new Chart('animalbyhwc',{
   type: 'bar',
   data: {
     labels:[],
     datasets: [{
       backgroundColor: '#ffbf00',
       label: 'frequency',
       data: []
     }]
   },
   options: {
     responsive: true, maintainAspectRatio: false,
     scales:{
     yAxes: [
       {
       ticks: {
         beginAtZero: true
       }
     }
   ]
     }
   }
   }
 )
  console.log(this.result);
 this.result.forEach(element => {

   this.animalChartByHwc.data.labels.push(element.ANIMAL);
   this.animalChartByHwc.data.datasets[0].data.push(element.ANIMAL_FREQ);
   });
   console.log(this.animalChartByHwc.data.labels);
   console.log(this.animalChartByHwc.data.datasets[0].data);
    this.animalChartByHwc.update();


  // Park

        this.dataPark = res[2];
  this.result = this.dataPark.reduce(function(res, obj) {
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

       this.parkChartByHwc = new Chart('parkbyhwc',{
         type: 'bar',
         data: {
           labels:[],
           datasets: [{
             backgroundColor: '#ffbf00',
             label: 'frequency',
             data: []
           }]
         },
         options: {
           responsive: true, maintainAspectRatio: false,
           scales:{
           yAxes: [
             {
             ticks: {
               beginAtZero: true
             }
           }
         ]
           }
         }
         }
       )

       this.result.forEach(element => {
         this.parkChartByHwc.data.labels.push(element.PARK);
         this.parkChartByHwc.data.datasets[0].data.push(element.PARK_FREQ);
         });
         console.log(this.parkChartByHwc.data.labels);
         console.log(this.parkChartByHwc.data.datasets[0].data);
          this.parkChartByHwc.update();


  // Taluk

        this.dataTaluk = res[3];
  this.result = this.dataTaluk.reduce(function(res, obj) {
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


         this.talukChartByHwc = new Chart('talukbyhwc',{
           type: 'bar',
           data: {
             labels:[],
             datasets: [{
               backgroundColor: '#ffbf00',
               label: 'frequency',
               data: []
             }]
           },
           options: {
             responsive: true, maintainAspectRatio: false,
             scales:{
             yAxes: [
               {
               ticks: {
                 beginAtZero: true
               }
             }
           ]
             }
           }
           }
         )

         this.result.forEach(element => {
           this.talukChartByHwc.data.labels.push(element.TALUK);
           this.talukChartByHwc.data.datasets[0].data.push(element.TALUK_FREQ);
           });
           console.log(this.talukChartByHwc.data.labels);
         console.log(this.talukChartByHwc.data.datasets[0].data);
            this.talukChartByHwc.update();


  // Range

  //          this.dataRange = res[4];
  this.result = this.dataRange.reduce(function(res, obj) {
    if (!(obj.HWC_RANGE in res)){
        res.__array.push(res[obj.HWC_RANGE] = obj);
        res}
    else {
        res[obj.HWC_RANGE].RANGE_FREQ += obj.RANGE_FREQ;
        // res[obj.category].bytes += obj.bytes;
    }
    return res;
 }, {__array:[]}).__array
                .sort(function(a,b) { return b.bytes - a.bytes; });

           this.rangeChartByHwc = new Chart('rangebyhwc',{
             type: 'bar',
             data: {
               labels:[],
               datasets: [{
                 backgroundColor: '#ffbf00',
                 label: 'frequency',
                 data: []
               }]
             },
             options: {
               responsive: true, maintainAspectRatio: false,
               scales:{
                 xAxes: [{
                   ticks: {
                       autoSkip: false,
                       maxRotation: 90,
                       minRotation: 90
                   }
               }],
               yAxes: [
                 {
                 ticks: {
                   beginAtZero: true
                 }
               }
             ]
               }
             }
             }
           )

           this.result.forEach(element => {
             this.rangeChartByHwc.data.labels.push(element.HWC_RANGE);
             this.rangeChartByHwc.data.datasets[0].data.push(element.RANGE_FREQ);
             });
  console.log(this.rangeChartByHwc.data.labels);
  console.log(this.rangeChartByHwc.data.datasets[0].data);
              this.rangeChartByHwc.update();


  //      Village


              this.dataVillage = res[5];
              this.result = this.dataVillage.reduce(function(res, obj) {
                if (!(obj.VILLAGE in res)){
                    res.__array.push(res[obj.VILLAGE] = obj);
                    res}
                else {
                    res[obj.VILLAGE].VILLAGE_FREQ += obj.VILLAGE_FREQ;
                    // res[obj.category].bytes += obj.bytes;
                }
                return res;
             }, {__array:[]}).__array
                            .sort(function(a,b) { return b.bytes - a.bytes; });

                         this.villageChartByHwc = new Chart('villagebyhwc',{
               type: 'bar',
               data: {
                 labels:[],
                 datasets: [{
                   backgroundColor: '#ffbf00',
                   label: 'frequency',
                   data: []
                 }]
               },
               options: {
                 responsive: true, maintainAspectRatio: false,
                 scales:{
                   xAxes: [{
                     ticks: {
                         autoSkip: false,
                         maxRotation: 90,
                         minRotation: 90
                     }
                 }],
                 yAxes: [
                   {
                   ticks: {
                     beginAtZero: true
                   }
                 }
               ]
                 }
               }
               }
             )

             this.result.forEach(element => {
               this.villageChartByHwc.data.labels.push(element.VILLAGE);
               this.villageChartByHwc.data.datasets[0].data.push(element.VILLAGE_FREQ);
               });
               console.log(this.villageChartByHwc.data.labels);
               console.log(this.villageChartByHwc.data.datasets[0].data);
                this.villageChartByHwc.update();



     });
    }


  private block1HwcCasesByFDSubDateGraph() {
    if (this.fromDate !== undefined && this.toDate !== undefined) {
      this.record = this.wildService.getHwcCasesByFDSubDate(this.fromDate.formatted, this.toDate.formatted);
      this.record.subscribe(res => {
        this.dataCat = res[0];

         this.result1 = this.dataCat.reduce(function(res, obj) {
          if (!(obj.CATEGORY in res)){
              res.__array.push(res[obj.CATEGORY] = obj);
              res}
          else {
              res[obj.CATEGORY].CAT_FREQ += obj.CAT_FREQ;
              // res[obj.category].bytes += obj.bytes;
          }
          return res;
      }, {__array:[]}).__array
                      .sort(function(a,b) { return b.bytes - a.bytes; });

     this.catChartByHwc = new Chart('catfd',{
       type: 'bar',
       data: {
         labels:[],
         datasets: [{
           backgroundColor: '#ffbf00',
           label: 'frequency',
           data: []
         }]
       },
       options: {
         responsive: true, maintainAspectRatio: false,
         scales:{
         yAxes: [
           {
           ticks: {
             beginAtZero: true
           }
         }
       ]
         }
       }
       }
     )
      console.log(this.result1);
     this.result1.forEach(element => {

       this.catChartByHwc.data.labels.push(element.CATEGORY);
       this.catChartByHwc.data.datasets[0].data.push(element.CAT_FREQ);
       });
       console.log(this.catChartByHwc.data.labels);
       console.log(this.catChartByHwc.data.datasets[0].data);

       this.catChartByHwc.update();


    // Animal

       this.dataAnimal = res[1];
       this.result = this.dataAnimal.reduce(function(res, obj) {
        if (!(obj.ANIMAL in res)){
            res.__array.push(res[obj.ANIMAL] = obj);
            res}
        else {
            res[obj.ANIMAL].ANIMAL_FREQ += obj.ANIMAL_FREQ;
            // res[obj.category].bytes += obj.bytes;
        }
        return res;
    }, {__array:[]}).__array
                    .sort(function(a,b) { return b.bytes - a.bytes; });

   this.animalChartByHwc = new Chart('animalfd',{
     type: 'bar',
     data: {
       labels:[],
       datasets: [{
         backgroundColor: '#ffbf00',
         label: 'frequency',
         data: []
       }]
     },
     options: {
       responsive: true, maintainAspectRatio: false,
       scales:{
       yAxes: [
         {
         ticks: {
           beginAtZero: true
         }
       }
     ]
       }
     }
     }
   )
    console.log(this.result);
   this.result.forEach(element => {

     this.animalChartByHwc.data.labels.push(element.ANIMAL);
     this.animalChartByHwc.data.datasets[0].data.push(element.ANIMAL_FREQ);
     });
     console.log(this.animalChartByHwc.data.labels);
     console.log(this.animalChartByHwc.data.datasets[0].data);
      this.animalChartByHwc.update();


    // Park

          this.dataPark = res[2];
    this.result = this.dataPark.reduce(function(res, obj) {
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

         this.parkChartByHwc = new Chart('parkfd',{
           type: 'bar',
           data: {
             labels:[],
             datasets: [{
               backgroundColor: '#ffbf00',
               label: 'frequency',
               data: []
             }]
           },
           options: {
             responsive: true, maintainAspectRatio: false,
             scales:{
             yAxes: [
               {
               ticks: {
                 beginAtZero: true
               }
             }
           ]
             }
           }
           }
         )

         this.result.forEach(element => {
           this.parkChartByHwc.data.labels.push(element.PARK);
           this.parkChartByHwc.data.datasets[0].data.push(element.PARK_FREQ);
           });
           console.log(this.parkChartByHwc.data.labels);
           console.log(this.parkChartByHwc.data.datasets[0].data);
            this.parkChartByHwc.update();


    // Taluk

          this.dataTaluk = res[3];
    this.result = this.dataTaluk.reduce(function(res, obj) {
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


           this.talukChartByHwc = new Chart('talukfd',{
             type: 'bar',
             data: {
               labels:[],
               datasets: [{
                 backgroundColor: '#ffbf00',
                 label: 'frequency',
                 data: []
               }]
             },
             options: {
               responsive: true, maintainAspectRatio: false,
               scales:{
               yAxes: [
                 {
                 ticks: {
                   beginAtZero: true
                 }
               }
             ]
               }
             }
             }
           )

           this.result.forEach(element => {
             this.talukChartByHwc.data.labels.push(element.TALUK);
             this.talukChartByHwc.data.datasets[0].data.push(element.TALUK_FREQ);
             });
             console.log(this.talukChartByHwc.data.labels);
           console.log(this.talukChartByHwc.data.datasets[0].data);
              this.talukChartByHwc.update();


    // Range

    //          this.dataRange = res[4];
    this.result = this.dataRange.reduce(function(res, obj) {
      if (!(obj.HWC_RANGE in res)){
          res.__array.push(res[obj.HWC_RANGE] = obj);
          res}
      else {
          res[obj.HWC_RANGE].RANGE_FREQ += obj.RANGE_FREQ;
          // res[obj.category].bytes += obj.bytes;
      }
      return res;
   }, {__array:[]}).__array
                  .sort(function(a,b) { return b.bytes - a.bytes; });

             this.rangeChartByHwc = new Chart('rangefd',{
               type: 'bar',
               data: {
                 labels:[],
                 datasets: [{
                   backgroundColor: '#ffbf00',
                   label: 'frequency',
                   data: []
                 }]
               },
               options: {
                 responsive: true, maintainAspectRatio: false,
                 scales:{
                   xAxes: [{
                     ticks: {
                         autoSkip: false,
                         maxRotation: 90,
                         minRotation: 90
                     }
                 }],
                 yAxes: [
                   {
                   ticks: {
                     beginAtZero: true
                   }
                 }
               ]
                 }
               }
               }
             )

             this.result.forEach(element => {
               this.rangeChartByHwc.data.labels.push(element.HWC_RANGE);
               this.rangeChartByHwc.data.datasets[0].data.push(element.RANGE_FREQ);
               });
    console.log(this.rangeChartByHwc.data.labels);
    console.log(this.rangeChartByHwc.data.datasets[0].data);
                this.rangeChartByHwc.update();


    //      Village


                this.dataVillage = res[5];
                this.result = this.dataVillage.reduce(function(res, obj) {
                  if (!(obj.VILLAGE in res)){
                      res.__array.push(res[obj.VILLAGE] = obj);
                      res}
                  else {
                      res[obj.VILLAGE].VILLAGE_FREQ += obj.VILLAGE_FREQ;
                      // res[obj.category].bytes += obj.bytes;
                  }
                  return res;
               }, {__array:[]}).__array
                              .sort(function(a,b) { return b.bytes - a.bytes; });

                           this.villageChartByHwc = new Chart('villagefd',{
                 type: 'bar',
                 data: {
                   labels:[],
                   datasets: [{
                     backgroundColor: '#ffbf00',
                     label: 'frequency',
                     data: []
                   }]
                 },
                 options: {
                   responsive: true, maintainAspectRatio: false,
                   scales:{
                     xAxes: [{
                       ticks: {
                           autoSkip: false,
                           maxRotation: 90,
                           minRotation: 90
                       }
                   }],
                   yAxes: [
                     {
                     ticks: {
                       beginAtZero: true
                     }
                   }
                 ]
                   }
                 }
                 }
               )

               this.result.forEach(element => {
                 this.villageChartByHwc.data.labels.push(element.VILLAGE);
                 this.villageChartByHwc.data.datasets[0].data.push(element.VILLAGE_FREQ);
                 });
                 console.log(this.villageChartByHwc.data.labels);
                 console.log(this.villageChartByHwc.data.datasets[0].data);
                  this.villageChartByHwc.update();



      });
    }
  }

  data: any;
  totalCasesChart;
  dataSource0:any;
  displayedCol0: any;
  col0: any[];

// First Table

  private getBlock2TotalCasesByYearMonthGraph() {
     this.record = this.wildService.getBlock2TotalCasesByYearMonth();
    this.record.subscribe(res => {
      this.data = res;
       console.log(this.data);
       //this.dataSource0 = this.data;
       this.displayedCol0 = ['YEAR', 'MONTH', 'TATAL CASES'];
      this.col0 = this.data;
    });
  }
dataSource1:any;
displayedCol1: any;



col1: any[] ;
collection: any[];

  private getBblock2Top20CasesByCatGraph() {
    this.record = this.wildService.getBlock2Top20CasesBycat();
  this.record.subscribe(res => {
      this.data = res;
       console.log(this.data);
      //  this.dataSource1 = this.data;
        this.displayedCol1 = ['HWC WSID', 'HWC CASE CATEGORY', 'CASES'];
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
       console.log(this.data);
    //   this.dataSource2 = this.data;
       this.displayedCol2 = ['HWC WSID', 'HWC CASES'];
      this.col2 = this.data;
    });
  }

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
       this.displayedCol3 = ['CROP NAME', 'CROP FREQ'];
      this.col3 = _data;
  }
dataSource4: any;
displayedCol4: any;
col4: any;
  private block3ByPropertyGraphs(_data) {
   // this.dataSource4 = _data;
       this.displayedCol4 = ['PROPERTY NAME', 'PROPERTY FREQ'];
      this.col4 = _data;
  }
  dataSource5: any;
  displayedCol5: any;
  col5: any;
  private block3ByLiveStockGraphs(_data) {
   // this.dataSource5 = _data;
       this.displayedCol5 = ['LIVESTOCK NAME', 'LIVESTOKE FREQ'];
      this.col5 = _data;
  }
dataSource6: any;
displayedCol6: any;
col6: any;
  private block3ByVillageGraphs(_data) {
    this.dataSource6 = _data;
       this.displayedCol6 = ['VILLAGE NAME', 'VILLAGE FREQ'];
      this.col6 = _data;
  }

  lineChart1: any;
  displayedCol7: any = [];
  displayedCol8: any = [];
  col7: any = [];
  col8: any = [];

  private getBlock2ByHwcDateFreq() {
    if (this.fromDate !== undefined && this.toDate !== undefined) {
      let _record = this.wildService.getBlock2ByHwcDateFreq(this.fromDate.formatted, this.toDate.formatted);
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
      let _record = this.wildService.getBlock2ByFaDateFreq(this.fromDate.formatted, this.toDate.formatted);
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
        this.displayedCol8 = ['FA DATE', 'FREQUENCY'];
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
