import { Component, OnInit, ViewChild } from '@angular/core';


import { MatTableDataSource, MatPaginator } from '@angular/material';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';

import { ConnectorService } from '../../services/connector.service';
import { ExcelService } from '../../services/excel.service';
import {IChartDataset, IHwcBlockA,IBarChartDataSet,IGetblock2TtotalCasesByYearMonth,IBblock2Top20CasesByCat,IBblock2Top50CasesByWsid} from '../../models/hwc.model';
import * as GeoJSON from 'geojson';
import * as tokml from 'tokml';
import * as FileSaver from 'file-saver';


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
  public fromDate:any;
  public toDate:any;
  public toShow:boolean=false;
  public block1HeaderText:string='Number of cases by HWC category, animal, Park, Taluk, Range';
  public hwcVillageHeaderText:string='Number of Cases by HWC village';
  public hwcCaseByHwcDateHeaderText:string='HWC Cases by HWC Date';
  public hwcCaseByFDSubDateHeaderText:string='HWC Cases by FD SubDate';
  public block2TotalCasesByYearMonthHeaderText:string='Total Cases By Month Year';
  public block2Top20CasesByCatHeaderText:string='Top 20 Cases By Category';
  public block2Top50CasesByWsidHeaderText:string='Top 50 Cases By WSID';  
  public block3TopCasesHeaderText:string='Top 50 Cases By WSID';  


  public block1RresultSet:Array<IChartDataset>;
  public hwcVillageResultSet:Array<IBarChartDataSet>;
  public hwcCasesByHwcDateResultSet:Array<IBarChartDataSet>;
  public hwcCasesByFDSubDateResultSet:Array<IBarChartDataSet>;
  public block2TotalCasesByYearMonthResultSet:Array<IBarChartDataSet>;
  public block2Top20CasesByCatResultSet:Array<IBarChartDataSet>;
  public block2Top50CasesByWsidResultSet:Array<IBarChartDataSet>;
  public block3TopCasesResultSet:Array<IBarChartDataSet>;


  public block1Labels:Array<any>;
  public hwcVillageLabels:Array<string>=[];
  public hwcCaseByHwcDateLabels:Array<any>;
  public hwcCaseByFDSubDateLabels:Array<any>;
  public block2TotalCasesByYearMonthLabels:Array<string>;
  public block2Top20CasesByCatLabels:Array<string>;  
  public block2Top50CasesByWsidLabels:Array<string>; 
  public block3TopCasesLabels:Array<string>; 


  hwcBlockAModel:IHwcBlockA={category:[],
    animal:[],
    park:[],
    taluk:[],
    range:[],
    village:[]
};


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
    this.block1Graph();
    this.getBlock2TotalCasesByYearMonthGraph();
    this.getBblock2Top20CasesByCatGraph();
    this.getBblock2Top50CasesByWsidGraph();
    this.getBlock3TopCasesGraph();
  }


  private saveAsKmlFile(buffer: any, fileName: string): void {
    const data: Blob = new Blob([buffer]);
    FileSaver.saveAs(data, fileName + '_export_' + new Date().getTime() + '.kml');
  }

  xlsxReport() {
    this.excelService.exportAsExcelFile(this.dataSource.data,  'HWC');
    return 'success';
  }
  kmlReport(){
    var kmlData={}
    for(let i=0; i<this.dataSource.data.length; i++){
      kmlData = {Name: this.dataSource.data[i].HWC_TALUK_NAME, Park: this.dataSource.data[i].HWC_PARK_NAME,lat:this.dataSource.data[i].HWC_LATITUDE, lng:this.dataSource.data[i].HWC_LONGITUDE}
      this.geoJsonData.push(kmlData);
    }
    this.obj = GeoJSON.parse(this.geoJsonData, {Point: ['lat', 'lng']});
    var kmlNameDescription = tokml(this.obj, {
      name: 'Name',
      description: 'description'
  });
  this.saveAsKmlFile(kmlNameDescription,'HWC' );
  }

  onSubmit(data){
    this.fromDate=data[0];
    this.toDate=data[1];
    this.toShow=true;
    this.block1HwcCasesByDateGraph();
    this.block1HwcCasesByFDSubDateGraph();
  }

 private block1Graph() {
    let _record =  this.wildService.getHwcGetBlock1();
    _record.subscribe(res => {
      let _data=res;
      _data.forEach(element => {
        element.forEach(x => {
          if(x.CATEGORY !== undefined)
          this.hwcBlockAModel.category.push(x.CAT_FREQ);
          else if(x.ANIMAL !== undefined)
          this.hwcBlockAModel.animal.push(x.ANIMAL_FREQ);
            else if(x.PARK !== undefined)
            this.hwcBlockAModel.park.push(x.PARK_FREQ);
            else if(x.TALUK !== undefined)
            this.hwcBlockAModel.taluk.push(x.TALUK_FREQ);
            else if(x.HWC_RANGE !== undefined)
            this.hwcBlockAModel.range.push(x.RANGE_FREQ);
            else if(x.VILLAGE !== undefined){
              this.hwcBlockAModel.village.push(x.VILLAGE_FREQ);
              this.hwcVillageLabels.push(x.VILLAGE);
          }
        });

      });

    this.hwcVillageGraph();

      let _chartDataset:Array<IChartDataset>=[{
        data:this.hwcBlockAModel.category,
        borderColor:'#3cba9f',
        label:'CATEGOEY',
        file: false,
        "fill" : false
        },
        {
          data:this.hwcBlockAModel.animal,
          borderColor:'#ffcc00',
          label:'ANIMAL',
          file: false,
          "fill" : false
        },
        {
          data:this.hwcBlockAModel.park,
          borderColor:'rgb(0, 0, 255)',
          label:'PARK',
          file: false,
          "fill" : false
        },
        {
          data:this.hwcBlockAModel.taluk,
          borderColor:'rgb(175, 92, 92)',
          label:'TALUK',
          file: false,
          "fill" : false
        },
        {
          data:this.hwcBlockAModel.range,
          borderColor:'rgb(75, 192, 192)',
          label:'RANGE',
          file: false,
          "fill" : false
        }
      ];
     this.block1Labels=['0','1','3','4','5','6','7','8','9','10'];
      this.block1RresultSet=_chartDataset;
    });
  }

  private hwcVillageGraph() {
      let _chartDataset:Array<IBarChartDataSet>=[{
        data:this.hwcBlockAModel.village,
          borderColor:'rgb(75, 215, 192)',
          backgroundColor: "rgb(75, 215, 192, 0.2)",
        "borderWidth":1,
          label:'VILLAGE',
          file: false
        }
      ];
      this.hwcVillageResultSet=_chartDataset;
  }

  private block1HwcCasesByDateGraph() {
    let _record =  this.wildService.getHwcCasesByHwcDate(this.fromDate.formatted,this.toDate.formatted);
    _record.subscribe(res => {
      let _data=res;
      let _dateFreq:Array<string>=[];
      _data.forEach(element => {
        element.forEach(x => {
          if(x.CATEGORY !== undefined){
            this.hwcBlockAModel.category.push(x.CAT_FREQ);
            _dateFreq.push(x.HWC_DATE);
          }
          else if(x.ANIMAL !== undefined)
          this.hwcBlockAModel.animal.push(x.ANIMAL_FREQ);
            else if(x.PARK !== undefined)
            this.hwcBlockAModel.park.push(x.PARK_FREQ);
            else if(x.TALUK !== undefined)
            this.hwcBlockAModel.taluk.push(x.TALUK_FREQ);
            else if(x.HWC_RANGE !== undefined)
            this.hwcBlockAModel.range.push(x.RANGE_FREQ);
            else if(x.VILLAGE !== undefined)
            this.hwcBlockAModel.village.push(x.VILLAGE_FREQ);
        });

      });

      let _chartDataset:Array<IBarChartDataSet>=[{
        data:this.hwcBlockAModel.category,
        borderColor:'rgba(255, 70, 132)',
        backgroundColor: "rgba(255, 70, 132, 0.2)",
        "borderWidth":1,
        label:'CATEGOEY',
        file: false
        },
        {
          data:this.hwcBlockAModel.animal,
          borderColor:'rgba(255, 110, 132)',
          backgroundColor: "rgba(255, 110, 132, 0.2)",
           "borderWidth":1,
          label:'ANIMAL',
          file: false
        },
        {
          data:this.hwcBlockAModel.park,
          borderColor:'rgb(0, 0, 255)',
          backgroundColor: "rgb(0, 0, 255, 0.2)",
        "borderWidth":1,
          label:'PARK',
          file: false
        },
        {
          data:this.hwcBlockAModel.taluk,
          borderColor:'rgb(175, 92, 92)',
          backgroundColor: "rgb(175, 92, 92, 0.2)",
        "borderWidth":1,
          label:'TALUK',
          file: false
        },
        {
          data:this.hwcBlockAModel.range,
          borderColor:'rgb(75, 192, 192)',
          backgroundColor: "rgb(75, 192, 192, 0.2)",
        "borderWidth":1,
          label:'RANGE',
          file: false
        },
        {
          data:this.hwcBlockAModel.village,
          borderColor:'rgb(70, 215, 192)',
          backgroundColor: "rgb(70, 215, 192, 0.2)",
        "borderWidth":1,
          label:'Village',
          file: false
        }
      ];
     this.hwcCaseByHwcDateLabels=_dateFreq;
      this.hwcCasesByHwcDateResultSet=_chartDataset;
    });
  }

  private block1HwcCasesByFDSubDateGraph() {
    let _record =  this.wildService.getHwcCasesByFDSubDate(this.fromDate.formatted,this.toDate.formatted);
    _record.subscribe(res => {
      let _data=res;
      let _dateFreq:Array<string>=[];
      _data.forEach(element => {
        element.forEach(x => {
          if(x.CATEGORY !== undefined){
            this.hwcBlockAModel.category.push(x.CAT_FREQ);
            _dateFreq.push(x.FA_DATE);
          }
          else if(x.ANIMAL !== undefined)
          this.hwcBlockAModel.animal.push(x.ANIMAL_FREQ);
            else if(x.PARK !== undefined)
            this.hwcBlockAModel.park.push(x.PARK_FREQ);
            else if(x.TALUK !== undefined)
            this.hwcBlockAModel.taluk.push(x.TALUK_FREQ);
            else if(x.HWC_RANGE !== undefined)
            this.hwcBlockAModel.range.push(x.RANGE_FREQ);
            else if(x.VILLAGE !== undefined)
            this.hwcBlockAModel.village.push(x.VILLAGE_FREQ);
        });

      });

      let _chartDataset:Array<IBarChartDataSet>=[{
        data:this.hwcBlockAModel.category,
        borderColor:'rgba(255, 70, 132)',
        backgroundColor: "rgba(255, 70, 132, 0.2)",
        "borderWidth":1,
        label:'CATEGOEY',
        file: false
        },
        {
          data:this.hwcBlockAModel.animal,
          borderColor:'rgba(255, 110, 132)',
          backgroundColor: "rgba(255, 119, 132, 0.2)",
           "borderWidth":1,
          label:'ANIMAL',
          file: false
        },
        {
          data:this.hwcBlockAModel.park,
          borderColor:'rgb(0, 0, 255)',
          backgroundColor: "rgb(0, 0, 255, 0.2)",
        "borderWidth":1,
          label:'PARK',
          file: false
        },
        {
          data:this.hwcBlockAModel.taluk,
          borderColor:'rgb(175, 92, 92)',
          backgroundColor: "rgb(175, 92, 92, 0.2)",
        "borderWidth":1,
          label:'TALUK',
          file: false
        },
        {
          data:this.hwcBlockAModel.range,
          borderColor:'rgb(75, 192, 192)',
          backgroundColor: "rgb(75, 192, 192, 0.2)",
        "borderWidth":1,
          label:'RANGE',
          file: false
        },
        {
          data:this.hwcBlockAModel.village,
          borderColor:'rgb(70, 215, 192)',
          backgroundColor: "rgb(70, 215, 192, 0.2)",
        "borderWidth":1,
          label:'Village',
          file: false
        }

      ];
      this.hwcCaseByFDSubDateLabels=_dateFreq;
      this.hwcCasesByFDSubDateResultSet=_chartDataset;
    });
  }

  private getBlock2TotalCasesByYearMonthGraph() {
    let _record =  this.wildService.getBlock2TotalCasesByYearMonth();
    _record.subscribe(res => {
      let _data:Array<IGetblock2TtotalCasesByYearMonth>=res; 
      let _totalCases:Array<string>=[];
      let _blockLabels:Array<string>=[];
      _data.forEach(x => {
            _totalCases.push(x.TOTAL_CASES.toString());
            _blockLabels.push(x.MONTH + ' ' + x.YEAR);
      });
      let _chartDataset:Array<IBarChartDataSet>=[{
        data:_totalCases,
        borderColor:'rgba(255, 70, 132)',
        backgroundColor: "rgba(255, 70, 132, 0.2)",
        "borderWidth":1,
        label:'Cases By Year Month',
        file: false
        } 
      ];
      this.block2TotalCasesByYearMonthLabels=_blockLabels;
      this.block2TotalCasesByYearMonthResultSet=_chartDataset;
    });
  }

  private getBblock2Top20CasesByCatGraph() {
    let _record =  this.wildService.getBlock2Top20CasesBycat();
    _record.subscribe(res => {
      let _data:Array<IBblock2Top20CasesByCat>=res; 
      let _totalCases:Array<string>=[];
      let _blockLabels:Array<string>=[];
      _data.forEach(x => {
            _totalCases.push(x.CASES.toString());
            _blockLabels.push(x.HWC_CASE_CATEGORY);
      });
      let _chartDataset:Array<IBarChartDataSet>=[{
        data:_totalCases,
        borderColor:'red',
        backgroundColor: "blue",
        "borderWidth":1,
        label:'Top 20 Cases By Category',
        file: false
        } 
      ];
      this.block2Top20CasesByCatLabels=_blockLabels;
      this.block2Top20CasesByCatResultSet=_chartDataset;
    });
  }

  private getBblock2Top50CasesByWsidGraph() {
    let _record =  this.wildService.getBlock2Top50CasesByWsid();
    _record.subscribe(res => {
      let _data:Array<IBblock2Top50CasesByWsid>=res; 
      let _totalCases:Array<string>=[];
      let _blockLabels:Array<string>=[];
      _data.forEach(x => {
            _totalCases.push(x.CASES.toString());
            _blockLabels.push(x.HWC_WSID);
      });
      let _chartDataset:Array<IBarChartDataSet>=[{
        data:_totalCases,
        borderColor:'blue',
        backgroundColor: "yellow",
        "borderWidth":1,
        label:'Top 50 Cases By WSID',
        file: false
        } 
      ];
      this.block2Top50CasesByWsidLabels=_blockLabels;
      this.block2Top50CasesByWsidResultSet=_chartDataset;
    });
  }

  private getBlock3TopCasesGraph() {
    let _record =  this.wildService.getBlock3TopCases();
    _record.subscribe(res => {
      let _data:Array<IBblock2Top50CasesByWsid>=res; 
      let _totalCases:Array<string>=[];
      let _blockLabels:Array<string>=[];
      _data.forEach(x => {
            _totalCases.push(x.CASES.toString());
            _blockLabels.push(x.HWC_WSID);
      });
      let _chartDataset:Array<IBarChartDataSet>=[{
        data:_totalCases,
        borderColor:'blue',
        backgroundColor: "yellow",
        "borderWidth":1,
        label:'Top 10 affected Crops',
        file: false
        } 
      ];
      this.block3TopCasesLabels=_blockLabels; 
      this.block3TopCasesResultSet=_chartDataset;
    });
  }
}
