import { Component, OnInit ,Input,OnChanges, SimpleChange } from '@angular/core';
import { Chart } from 'chart.js';

@Component({
  selector: 'app-chart-types',
  templateUrl: './chart-types.component.html',
  styleUrls: ['./chart-types.component.scss']
})
export class ChartTypesComponent implements OnInit,OnChanges {

  @Input() chartType:string;
  @Input() chartId:string;
  @Input() chartLabels:Array<any>=[];
  @Input() chartHeaderText:string;
  @Input() resultSet:Array<any>=[];
  lineChart=[];
  record:any;
  dataSet:any;
  constructor() {} 

  ngOnInit() {
  }
  
  ngOnChanges(changes: { [propName: string]: SimpleChange }) {
    for (let propName in changes) {
      if ((propName === 'resultSet') && (changes['resultSet'].currentValue !== undefined)) {        
        this.lineGraph(this.chartLabels,this.resultSet );
     }
    }
  }

  lineGraph(labelData:Array<any>,dataSets:Array<any>) {
    //   const date = [];
    //  const nh_case = [];
    //  const bp_case = [];
    //  this.resultSet.forEach(element => {
    //   console.log(element);
    //    date.push(element.CASE_DATE);
    //    nh_case.push(element.NH_CASES);
    //    bp_case.push(element.BP_CASE);
    //  });
  
       this.lineChart = new Chart('canvas_'+this.chartId, {
         type: this.chartType,
         data: {
           labels: labelData,
           datasets: dataSets  
           //[
          //    {
          //      data: nh_case,
          //      borderColor: '#3cba9f',
          //      label: 'NH_CASES',
          //      file: false,
          //      "fill" : false
          //    },
          //    {
          //     data: bp_case,
          //     borderColor: '#ffcc00',
          //     label: 'BP_CASES',
          //     file: false,
          //     "fill" : false
          //   }
          //  ]
         },
         options: {
           legend : {
            display: true,
            labels: {
              boxWidth: 10,
            fontSize: 8
            },
            position: "right",
          }
         }
       });
  
     }

}
