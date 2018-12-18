import { Component, OnInit, ViewChild, ViewEncapsulation } from "@angular/core";

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
    this.getallvillageincidentsbycat();
    this.getDateRange();
    this.block1Graph();
//   this.block1ByHwcDate();
    this.getBlock2TotalCasesByYearMonthGraph();
    this.getBblock2Top20CasesByCatGraph();
    this.getBblock2Top50CasesByWsidGraph();
    this.getBlock3TopCasesGraph();
    //  this.toShow = true;
    // this.block1HwcCasesByDateGraph();
  // this.block1HwcCasesByFDSubDateGraph();
    this.getblock2ByFaDateFreq();
    this.getBlock2ByHwcDateFreq();
    this.spinnerService.hide();
  }

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
        month: d.getMonth() - 2,
        day: d.getDate()
      },
      formatted:
        d.getFullYear() +
        "-" +
        ("0" + (d.getMonth() - 2)).slice(-2) +
        "-" +
        ("0" + d.getDate()).slice(-2)
    };
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

  buttonName: any = "By Date"

  showHideButton() {
    if(this.showMainContent = !this.showMainContent){
      this.buttonName = "All Cases";
      this.block1ByHwcDate();
      this.block1HwcCasesByFDSubDateGraph();
    }
     else{
      this.buttonName = "By Date";
       this.block1Graph();
     }

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

  categoryArr: any = [];
  dataCat: any = [];
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

  cat: number = 0;

  // First Graph

  private block1Graph() {
    this.record = this.wildService.getHwcGetBlock1();

    this.record.subscribe(res => {
      this.dataCat = res[0];
      console.log(this.dataCat);
      Chart.defaults.global.plugins.datalabels.anchor = "end";
      Chart.defaults.global.plugins.datalabels.align = "end";

      this.catChart = new Chart("category", {
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
            text: "Frequency of cases by HWC category",
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
        element.CATEGORY.charAt(0).toUpperCase() + element.CATEGORY.slice(1);
        this.catChart.data.labels.push(element.CATEGORY);
        this.catChart.data.datasets[0].data.push(element.CAT_FREQ);
      });
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
            text: "Frequency of cases by Animal",
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
              backgroundColor: "#ffbf00",
              label: "frequency",
              data: []
            }
          ]
        },
        options: {
          title: {
            text: "Frequency of cases by Park",
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
              backgroundColor: "#ffbf00",
              label: "frequency",
              data: []
            }
          ]
        },
        options: {
          title: {
            text: "Frequency of cases by Taluk",
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
        element.TALUK.charAt(0).toUpperCase() + element.TALUK.slice(1);
        this.talukChart.data.labels.push(element.TALUK);
        this.talukChart.data.datasets[0].data.push(element.TALUK_FREQ);
      });
      this.talukChart.update();

      this.dataRange = res[4];
      this.rangeChart = new Chart("range", {
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
            text: "Frequency of cases by Range",
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
              backgroundColor: "#ffbf00",
              label: "frequency",
              data: []
            }
          ]
        },
        options: {
          title: {
            text: "Frequency of cases by Village",
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

  categoryArrByHwcDate: any = [];
  result;
  catChartByHwc;
  parkChartByHwc;
  talukChartByHwc;
  rangeChartByHwc;
  villageChartByHwc;
 result1;





displayedCol33: any = [];
data33: any = [];
private getallvillageincidentsbycat(){
  let record = this.wildService.getVillageIncidentsByCat();
  record.subscribe(res => {
    let _data = JSON.parse(res.data);
//    console.log(_data[0]);
let i = 0;
_data.forEach(element => {
  this.data33[i++] = element;
});
console.log(this.data33[0]);
  });
this.displayedCol33 = ["VILLAGE", "INCIDENT", "HWC CASE CATEGORY"]
}


  // Second Graph

  private block1ByHwcDate() {
    this.record = this.wildService.getHwcCasesByHwcDate(
      this.fromDate.formatted,
      this.toDate.formatted
    );

    this.record.subscribe(res => {
      this.dataCat = res[0];

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

      if (this.catChartByHwc !== undefined) {
        this.catChartByHwc.destroy();
      }

      this.catChartByHwc = new Chart("categorybyhwc", {
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
            text: "Frequency of cases by HWC category(HWC Date)",
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
            text: "Frequency of cases by Animal(HWC Date)",
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
              backgroundColor: "#ffbf00",
              label: "frequency",
              data: []
            }
          ]
        },
        options: {
          title: {
            text: "Frequency of cases by Park(HWC Date)",
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
              backgroundColor: "#ffbf00",
              label: "frequency",
              data: []
            }
          ]
        },
        options: {
          title: {
            text: "Frequency of cases by Taluk(HWC Date)",
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
        this.talukChartByHwc.data.labels.push(element.TALUK);
        this.talukChartByHwc.data.datasets[0].data.push(element.TALUK_FREQ);
      });
      //    console.log(this.talukChartByHwc.data.labels);
      //  console.log(this.talukChartByHwc.data.datasets[0].data);
      this.talukChartByHwc.update();

      // Range

      //          this.dataRange = res[4];
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
              backgroundColor: "#ffbf00",
              label: "frequency",
              data: []
            }
          ]
        },
        options: {
          title: {
            text: "Frequency of cases by Range(HWC Date)",
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
              backgroundColor: "#ffbf00",
              label: "frequency",
              data: []
            }
          ]
        },
        options: {
          title: {
            text: "Frequency of cases by Village(HWC Date)",
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

  catChartFd;
  animalChartFd;
  parkChartFd;
  talukChartFd;
  rangeChartFd;
  villageChartFd;

  private block1HwcCasesByFDSubDateGraph() {
    if (this.fromDate !== undefined && this.toDate !== undefined) {
      this.record = this.wildService.getHwcCasesByFDSubDate(
        this.fromDate.formatted,
        this.toDate.formatted
      );
      this.record.subscribe(res => {
        this.dataCat = res[0];

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

        if (this.catChartFd !== undefined) {
          this.catChartFd.destroy();
        }

        this.catChartFd = new Chart("catfd", {
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
              text: "Frequency of cases by HWC category(FDSubDate)",
              display: true
            },
            legend: {
              labels: {
                boxWidth: 10,
                fontSize: 8
              },
              position: "right"
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
              text: "Frequency of cases by Animal(FDSubDate)",
              display: true
            },
            legend: {
              labels: {
                boxWidth: 10,
                fontSize: 8
              },
              position: "right"
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

        if (this.parkChartFd !== undefined) {
          this.parkChartFd.destroy();
        }

        this.parkChartFd = new Chart("parkfd", {
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
              text: "Frequency of cases by Park(FDSubDate)",
              display: true
            },
            legend: {
              labels: {
                boxWidth: 10,
                fontSize: 8
              },
              position: "right"
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

        if (this.talukChartFd !== undefined) {
          this.talukChartFd.destroy();
        }

        this.talukChartFd = new Chart("talukfd", {
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
              text: "Frequency of cases by Taluk(FDSubDate)",
              display: true
            },
            legend: {
              labels: {
                boxWidth: 10,
                fontSize: 8
              },
              position: "right"
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

        this.result.forEach(element => {
          element.TALUK =
          element.TALUK.charAt(0).toUpperCase() + element.TALUK.slice(1);
          this.talukChartFd.data.labels.push(element.TALUK);
          this.talukChartFd.data.datasets[0].data.push(element.TALUK_FREQ);
        });
        //    console.log(this.talukChartFd.data.labels);
        //  console.log(this.talukChartFd.data.datasets[0].data);
        this.talukChartFd.update();

        // Range

        //          this.dataRange = res[4];
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

        if (this.rangeChartFd !== undefined) {
          this.rangeChartFd.destroy();
        }

        this.rangeChartFd = new Chart("rangefd", {
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
              text: "Frequency of cases by Range(FDSubDate)",
              display: true
            },
            legend: {
              labels: {
                boxWidth: 10,
                fontSize: 8
              },
              position: "right"
            },
            responsive: true,
            maintainAspectRatio: false,
            scales: {
              xAxes: [
                {
                  ticks: {
                    autoSkip: false,
                    // maxRotation: 90,
                    // minRotation: 90
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
                backgroundColor: "#ffbf00",
                label: "frequency",
                data: []
              }
            ]
          },
          options: {
            title: {
              text: "Frequency of cases by Village(FDSubDate)",
              display: true
            },
            legend: {
              labels: {
                boxWidth: 10,
                fontSize: 8
              },
              position: "right"
            },
            responsive: true,
            maintainAspectRatio: false,
            scales: {
              xAxes: [
                {
                  ticks: {
                    autoSkip: false,
                      maxRotation: 90,
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
      this.displayedCol0 = ["YEAR", "MONTH", "TATAL CASES"];
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
