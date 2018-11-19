import { Component, OnInit, ViewChild } from '@angular/core';


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


@Component({
  selector: 'app-hwc',
  templateUrl: './hwc.component.html',
  styleUrls: ['./hwc.component.scss'],
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
  totalPost = 10;
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

  constructor(private wildService: ConnectorService, private excelService: ExcelService, private spinnerService: Ng4LoadingSpinnerService) { }

  displayedCol = [
    'HWC_METAINSTANCE_ID',
    'HWC_METASUBMISSION_DATE',
    'HWC_FULL_NAME',
    'HWC_NEWPHONE_NUMBER',
    'HWC_PARK_NAME',
    'HWC_TALUK_NAME',
    'HWC_VILLAGE_NAME',
    'HWC_ANIMAL'
  ];

  ngOnInit() {
    this.spinnerService.show();
    this.record = this.wildService.getHWC();
    this.record.subscribe(res => {
      if (!res) {
        this.spinnerService.hide();
        return;
      }

      this.dataSource = new MatTableDataSource(res.response);
      this.dataSource.paginator = this.paginator;
      this.spinnerService.hide();
    });
    this.getDateRange();
    this.block1Graph();
    this.getBlock2TotalCasesByYearMonthGraph();
    this.getBblock2Top20CasesByCatGraph();
    this.getBblock2Top50CasesByWsidGraph();
    this.getBlock3TopCasesGraph();
    this.toShow = true;
    this.block1HwcCasesByDateGraph();
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
        month: d.getMonth() - 5,
        day: d.getDate()
      },
      formatted: d.getFullYear() + "-" + ('0' + (d.getMonth() - 5)).slice(-2) + "-" + ('0' + (d.getDate())).slice(-2)
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
    this.toShow = true;
    this.block1HwcCasesByDateGraph();
    this.block1HwcCasesByFDSubDateGraph();
  }

  private block1Graph() {
    let _record = this.wildService.getHwcGetBlock1();
    _record.subscribe(res => {
      let _data = res;
      _data.forEach(element => {
        element.forEach(x => {
          if (x.CATEGORY !== undefined)
            this.hwcBlockAModel.category.push(x.CAT_FREQ);
          else if (x.ANIMAL !== undefined)
            this.hwcBlockAModel.animal.push(x.ANIMAL_FREQ);
          else if (x.PARK !== undefined)
            this.hwcBlockAModel.park.push(x.PARK_FREQ);
          else if (x.TALUK !== undefined)
            this.hwcBlockAModel.taluk.push(x.TALUK_FREQ);
          else if (x.HWC_RANGE !== undefined)
            this.hwcBlockAModel.range.push(x.RANGE_FREQ);
          else if (x.VILLAGE !== undefined) {
            this.hwcBlockAModel.village.push(x.VILLAGE_FREQ);
            this.hwcVillageLabels.push(x.VILLAGE);
          }
        });

      });

      this.hwcVillageGraph();

      let _chartDataset: Array<IChartDataset> = [{
        data: this.hwcBlockAModel.category,
        borderColor: '#3cba9f',
        label: 'CATEGOEY',
        file: false,
        "fill": false
      },
      {
        data: this.hwcBlockAModel.animal,
        borderColor: '#ffcc00',
        label: 'ANIMAL',
        file: false,
        "fill": false
      },
      {
        data: this.hwcBlockAModel.park,
        borderColor: 'rgb(0, 0, 255)',
        label: 'PARK',
        file: false,
        "fill": false
      },
      {
        data: this.hwcBlockAModel.taluk,
        borderColor: 'rgb(175, 92, 92)',
        label: 'TALUK',
        file: false,
        "fill": false
      },
      {
        data: this.hwcBlockAModel.range,
        borderColor: 'rgb(75, 192, 192)',
        label: 'RANGE',
        file: false,
        "fill": false
      }
      ];
      this.block1Labels = ['0', '1', '3', '4', '5', '6', '7', '8', '9', '10'];
      this.block1RresultSet = _chartDataset;
    });
  }

  private hwcVillageGraph() {
    let _chartDataset: Array<IBarChartDataSet> = [{
      data: this.hwcBlockAModel.village,
      borderColor: 'rgb(75, 215, 192)',
      backgroundColor: "rgb(75, 215, 192, 0.2)",
      "borderWidth": 1,
      label: 'VILLAGE',
      file: false
    }
    ];
    this.hwcVillageResultSet = _chartDataset;
  }

  private block1HwcCasesByDateGraph() {
    if (this.fromDate !== undefined && this.toDate !== undefined) {
      let _record = this.wildService.getHwcCasesByHwcDate(this.fromDate.formatted, this.toDate.formatted);
      _record.subscribe(res => {
        let _data = res;
        let _dateFreq: Array<string> = [];
        _data.forEach(element => {
          element.forEach(x => {
            if (x.CATEGORY !== undefined) {
              this.hwcBlockAModel.category.push(x.CAT_FREQ);
              _dateFreq.push(x.HWC_DATE);
            }
            else if (x.ANIMAL !== undefined)
              this.hwcBlockAModel.animal.push(x.ANIMAL_FREQ);
            else if (x.PARK !== undefined)
              this.hwcBlockAModel.park.push(x.PARK_FREQ);
            else if (x.TALUK !== undefined)
              this.hwcBlockAModel.taluk.push(x.TALUK_FREQ);
            else if (x.HWC_RANGE !== undefined)
              this.hwcBlockAModel.range.push(x.RANGE_FREQ);
            else if (x.VILLAGE !== undefined)
              this.hwcBlockAModel.village.push(x.VILLAGE_FREQ);
          });

        });

        let _chartDataset: Array<IBarChartDataSet> = [{
          data: this.hwcBlockAModel.category,
          borderColor: 'rgba(255, 70, 132)',
          backgroundColor: "rgba(255, 70, 132, 0.2)",
          "borderWidth": 1,
          label: 'CATEGOEY',
          file: false
        },
        {
          data: this.hwcBlockAModel.animal,
          borderColor: 'rgba(255, 110, 132)',
          backgroundColor: "rgba(255, 110, 132, 0.2)",
          "borderWidth": 1,
          label: 'ANIMAL',
          file: false
        },
        {
          data: this.hwcBlockAModel.park,
          borderColor: 'rgb(0, 0, 255)',
          backgroundColor: "rgb(0, 0, 255, 0.2)",
          "borderWidth": 1,
          label: 'PARK',
          file: false
        },
        {
          data: this.hwcBlockAModel.taluk,
          borderColor: 'rgb(175, 92, 92)',
          backgroundColor: "rgb(175, 92, 92, 0.2)",
          "borderWidth": 1,
          label: 'TALUK',
          file: false
        },
        {
          data: this.hwcBlockAModel.range,
          borderColor: 'rgb(75, 192, 192)',
          backgroundColor: "rgb(75, 192, 192, 0.2)",
          "borderWidth": 1,
          label: 'RANGE',
          file: false
        },
        {
          data: this.hwcBlockAModel.village,
          borderColor: 'rgb(70, 215, 192)',
          backgroundColor: "rgb(70, 215, 192, 0.2)",
          "borderWidth": 1,
          label: 'Village',
          file: false
        }
        ];
        this.hwcCaseByHwcDateLabels = _dateFreq;
        this.hwcCasesByHwcDateResultSet = _chartDataset;
      });
    }
  }

  private block1HwcCasesByFDSubDateGraph() {
    if (this.fromDate !== undefined && this.toDate !== undefined) {
      let _record = this.wildService.getHwcCasesByFDSubDate(this.fromDate.formatted, this.toDate.formatted);
      _record.subscribe(res => {
        let _data = res;
        let _dateFreq: Array<string> = [];
        _data.forEach(element => {
          element.forEach(x => {
            if (x.CATEGORY !== undefined) {
              this.hwcBlockAModel.category.push(x.CAT_FREQ);
              _dateFreq.push(x.FA_DATE);
            }
            else if (x.ANIMAL !== undefined)
              this.hwcBlockAModel.animal.push(x.ANIMAL_FREQ);
            else if (x.PARK !== undefined)
              this.hwcBlockAModel.park.push(x.PARK_FREQ);
            else if (x.TALUK !== undefined)
              this.hwcBlockAModel.taluk.push(x.TALUK_FREQ);
            else if (x.HWC_RANGE !== undefined)
              this.hwcBlockAModel.range.push(x.RANGE_FREQ);
            else if (x.VILLAGE !== undefined)
              this.hwcBlockAModel.village.push(x.VILLAGE_FREQ);
          });

        });

        let _chartDataset: Array<IBarChartDataSet> = [{
          data: this.hwcBlockAModel.category,
          borderColor: 'rgba(255, 70, 132)',
          backgroundColor: "rgba(255, 70, 132, 0.2)",
          "borderWidth": 1,
          label: 'CATEGOEY',
          file: false
        },
        {
          data: this.hwcBlockAModel.animal,
          borderColor: 'rgba(255, 110, 132)',
          backgroundColor: "rgba(255, 119, 132, 0.2)",
          "borderWidth": 1,
          label: 'ANIMAL',
          file: false
        },
        {
          data: this.hwcBlockAModel.park,
          borderColor: 'rgb(0, 0, 255)',
          backgroundColor: "rgb(0, 0, 255, 0.2)",
          "borderWidth": 1,
          label: 'PARK',
          file: false
        },
        {
          data: this.hwcBlockAModel.taluk,
          borderColor: 'rgb(175, 92, 92)',
          backgroundColor: "rgb(175, 92, 92, 0.2)",
          "borderWidth": 1,
          label: 'TALUK',
          file: false
        },
        {
          data: this.hwcBlockAModel.range,
          borderColor: 'rgb(75, 192, 192)',
          backgroundColor: "rgb(75, 192, 192, 0.2)",
          "borderWidth": 1,
          label: 'RANGE',
          file: false
        },
        {
          data: this.hwcBlockAModel.village,
          borderColor: 'rgb(70, 215, 192)',
          backgroundColor: "rgb(70, 215, 192, 0.2)",
          "borderWidth": 1,
          label: 'Village',
          file: false
        }

        ];
        this.hwcCaseByFDSubDateLabels = _dateFreq;
        this.hwcCasesByFDSubDateResultSet = _chartDataset;
      });
    }
  }

  private getBlock2TotalCasesByYearMonthGraph() {
    let _record = this.wildService.getBlock2TotalCasesByYearMonth();
    _record.subscribe(res => {
      let _data: Array<IGetblock2TtotalCasesByYearMonth> = res;
      let _totalCases: Array<string> = ['0'];
      let _blockLabels: Array<string> = [''];
      _data.forEach(x => {
        _totalCases.push(x.TOTAL_CASES.toString());
        _blockLabels.push(x.MONTH + ' ' + x.YEAR);
      });
      let _chartDataset: Array<IBarChartDataSet> = [{
        data: _totalCases,
        borderColor: 'rgba(255, 70, 132)',
        backgroundColor: "rgba(255, 70, 132, 0.2)",
        "borderWidth": 1,
        label: 'Cases By Year Month',
        file: false
      }
      ];
      this.block2TotalCasesByYearMonthLabels = _blockLabels;
      this.block2TotalCasesByYearMonthResultSet = _chartDataset;
    });
  }

  private getBblock2Top20CasesByCatGraph() {
    let _record = this.wildService.getBlock2Top20CasesBycat();
    _record.subscribe(res => {
      let _data: Array<IBblock2Top20CasesByCat> = res;
      let _totalCases: Array<string> = [];
      let _blockLabels: Array<string> = [];
      _data.forEach(x => {
        _totalCases.push(x.CASES.toString());
        _blockLabels.push(x.HWC_CASE_CATEGORY);
      });
      let _chartDataset: Array<IBarChartDataSet> = [{
        data: _totalCases,
        borderColor: 'red',
        backgroundColor: "blue",
        "borderWidth": 1,
        label: 'Top 20 Cases By Category',
        file: false
      }
      ];
      this.block2Top20CasesByCatLabels = _blockLabels;
      this.block2Top20CasesByCatResultSet = _chartDataset;
    });
  }

  private getBblock2Top50CasesByWsidGraph() {
    let _record = this.wildService.getBlock2Top50CasesByWsid();
    _record.subscribe(res => {
      let _data: Array<IBblock2Top50CasesByWsid> = res;
      let _totalCases: Array<string> = ['0'];
      let _blockLabels: Array<string> = [''];
      _data.forEach(x => {
        _totalCases.push(x.CASES.toString());
        _blockLabels.push(x.HWC_WSID);
      });
      let _chartDataset: Array<IBarChartDataSet> = [{
        data: _totalCases,
        borderColor: 'blue',
        backgroundColor: "yellow",
        "borderWidth": 1,
        label: 'Top 50 Cases By WSID',
        file: false
      }
      ];
      this.block2Top50CasesByWsidLabels = _blockLabels;
      this.block2Top50CasesByWsidResultSet = _chartDataset;
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

  private block3ByCropGraphs(_data) {
    let _totalCases: Array<string> = ['0'];
    let _blockLabels: Array<string> = [''];
    _data.forEach(x => {
      _totalCases.push(x.CROP_FREQ.toString());
      _blockLabels.push(x.CROP_NAME);
    });
    let _chartDataset: Array<IBarChartDataSet> = [{
      data: _totalCases,
      borderColor: 'blue',
      backgroundColor: "yellow",
      "borderWidth": 1,
      label: 'Top 10 affected Crops',
      file: false
    }
    ];
    this.block3TopCasesByCropLabels = _blockLabels;
    this.block3TopCasesByCropResultSet = _chartDataset;
  }

  private block3ByPropertyGraphs(_data) {
    let _totalCases: Array<string> = [];
    let _blockLabels: Array<string> = [];
    _data.forEach(x => {
      _totalCases.push(x.PROPERTY_FREQ.toString());
      _blockLabels.push(x.PROPERTY_NAME);
    });
    let _chartDataset: Array<IBarChartDataSet> = [{
      data: _totalCases,
      borderColor: 'blue',
      backgroundColor: "yellow",
      "borderWidth": 1,
      label: 'Top 10 affected Property',
      file: false
    }
    ];
    this.block3TopCasesByPropertyLabels = _blockLabels;
    this.block3TopCasesByPropertyResultSet = _chartDataset;
  }

  private block3ByLiveStockGraphs(_data) {
    let _totalCases: Array<string> = [];
    let _blockLabels: Array<string> = [];
    _data.forEach(x => {
      _totalCases.push(x.LIVESTOCK_FREQ.toString());
      _blockLabels.push(x.LIVESTOCK_NAME);
    });
    let _chartDataset: Array<IBarChartDataSet> = [{
      data: _totalCases,
      borderColor: 'blue',
      backgroundColor: "yellow",
      "borderWidth": 1,
      label: 'Top 10 affected LiveStock',
      file: false
    }
    ];
    this.block3TopCasesByLivestockLabels = _blockLabels;
    this.block3TopCasesByLivestockResultSet = _chartDataset;
  }

  private block3ByVillageGraphs(_data) {
    let _totalCases: Array<string> = [];
    let _blockLabels: Array<string> = [];
    _data.forEach(x => {
      _totalCases.push(x.VILLAGE_FREQ.toString());
      _blockLabels.push(x.VILLAGE_NAME);
    });
    let _chartDataset: Array<IBarChartDataSet> = [{
      data: _totalCases,
      borderColor: 'blue',
      backgroundColor: "yellow",
      "borderWidth": 1,
      label: 'Top 10 affected village',
      file: false
    }
    ];
    this.block3TopCasesByVillageLabels = _blockLabels;
    this.block3TopCasesByVillageResultSet = _chartDataset;
  }

  private getblock2ByFaDateFreq() {
    if (this.fromDate !== undefined && this.toDate !== undefined) {
      let _record = this.wildService.getBlock2ByFaDateFreq(this.fromDate.formatted, this.toDate.formatted);
      _record.subscribe(res => {
        let _data: Array<IFADateFreq> = res;
        let _dateFreq: Array<string> = ['0'];
        let _date: Array<string> = [''];
        _data.forEach(x => {
          _dateFreq.push(x.DATE_FREQ.toString());
          _date.push(x.FA_DATE);
          //alert(_dateFreq);
          //alert(_date);
        });

        let _chartDataset: Array<IBarChartDataSet> = [{
          data: _dateFreq,
          borderColor: 'blue',
          backgroundColor: "red",
          //borderColor: 'rgba(255, 70, 132)',
          //backgroundColor: "rgba(255, 70, 132, 0.2)",
          "borderWidth": 1,
          label: 'FA FREQUENCY',
          file: false
        }
        ];
        this.block2ByFaDateFreqLabels = _date;
        this.block2ByFaDateFreqResultSet = _chartDataset;
      });
    }
  }

  private getBlock2ByHwcDateFreq() {
    if (this.fromDate !== undefined && this.toDate !== undefined) {
      let _record = this.wildService.getBlock2ByHwcDateFreq(this.fromDate.formatted, this.toDate.formatted);
      _record.subscribe(res => {
        let _data: Array<IHwcDateFreq> = res;
        let _dateFreq: Array<string> = ['0'];
        let _date: Array<string> = [''];
        _data.forEach(x => {
          _dateFreq.push(x.DATE_FREQ.toString());
          _date.push(x.HWC_DATE);
        });

        let _chartDataset: Array<IBarChartDataSet> = [{
          data: _dateFreq,
          borderColor: 'blue',
          backgroundColor: "green",
          "borderWidth": 1,
          label: 'HWC FREQUENCY',
          file: false
        }
        ];
        this.block2ByHwcDateFreqLabels = _date;
        this.block2ByHwcDateFreqResultSet = _chartDataset;
      });
    }
  }
}
