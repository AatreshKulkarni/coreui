import { Component, OnInit ,Output,EventEmitter} from '@angular/core';

import {IMyDpOptions} from 'mydatepicker';

@Component({
  selector: 'app-date-picker',
  templateUrl: './date-picker.component.html',
  styleUrls: ['./date-picker.component.scss']
})
export class DatePickerComponent implements OnInit {

  @Output() submit:EventEmitter<Array<Date>> = new EventEmitter();
  public myDatePickerOptions: IMyDpOptions = {
    // other options...
    dateFormat: 'yyyy-mm-dd',
  };
  public toDate;
  public fromDate;
  public returnDates:Array<Date>=[];

  constructor() {
    var d: Date = new Date();
    console.log(d);
        this.toDate = {date: {year: d.getFullYear(),
                             month: d.getMonth() + 1,
                             day: d.getDate()},
                            formatted:d.getFullYear()+"-"+('0' + (d.getMonth() + 1)).slice(-2)+"-"+('0' + (d.getDate())).slice(-2)};
        this.fromDate = {date: {year: d.getFullYear(),
                              month: d.getMonth() ,
                              day: d.getDate()},
                            formatted: d.getFullYear()+"-"+('0' + (d.getMonth() - 5)).slice(-2)+"-"+('0' + (d.getDate())).slice(-2)};
   }

  ngOnInit() {
  }

  onSubmit(fromdate, todate) {
    if (!fromdate || !todate) {
      alert("Please fill date fields.")
    }
    else
      {
        this.returnDates.push(fromdate);
        this.returnDates.push(todate);
        this.submit.emit(this.returnDates);
        this.returnDates.length = 0;
      }
    // this.lineGraph(fromdate, todate);
    // this.lineGraph2(fromdate,todate);
    // this.lineGraph3(fromdate,todate);
    // this.lineGraph4(fromdate,todate);
  }

}
