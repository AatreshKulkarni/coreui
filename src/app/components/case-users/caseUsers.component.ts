import { Component, OnInit, ViewChild, Inject } from '@angular/core';

import { MatTableDataSource, MatPaginator, MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';

import { ConnectorService } from '../../services/connector.service';
import { ExcelService } from '../../services/excel.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-caseUsers',
  templateUrl: './caseUsers.component.html',
  styleUrls: ['./caseUsers.component.scss'],
  providers: [ConnectorService]
})
export class CaseUsersComponent implements OnInit {

  record: any;
  dataSource: any = [];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild('MatPaginator1') paginator2: MatPaginator;
  // totalPost = 10;
  // postPerPage = 10;
  // pageSizeOptions = [5, 10, 20, 50, 100];
  constructor(private wildService: ConnectorService,
    private excelService: ExcelService,
    public dialog: MatDialog,
    private spinnerService: Ng4LoadingSpinnerService) { }



   displayedCol: any[] = [];
  //   "HWC_WSID",
  //   "HWC_FIRST_NAME",
  //   "HWC_LAST_NAME",
  //   "HWC_FULL_NAME",
  //   "HWC_FAMILY_NAME",
  //   "HWC_PARENTS_NAME",
  //   "HWC_PARK_NAME",
  //   "HWC_TALUK_NAME",
  //   "HWC_VILLAGE_NAME",
  //   "HWC_OLDPHONE_NUMBER",
  //   "HWC_NEWPHONE_NUMBER",
  //   "HWC_SURVEY_NUMBER",
  //       ]
    tableheaders:any=[];
    res:any=[];
  ngOnInit() {
    this.getWSUsers();
    this.getHWCvsCompCases();

  }

  dataSource2: any = [];
  displayedCol2: any = [];
  getHWCvsCompCases(){
    let record = this.wildService.getHWCvsCompCases();
    record.subscribe(res => {
      // this.dataSource2 =;
      this.displayedCol2 = Object.keys(res.response[0]);
      this.dataSource2 = new MatTableDataSource( res.response);
      this.dataSource2.paginator = this.paginator2;

    });
  }
  getWSUsers(){
    this.record = this.wildService.getWildSeveUsers();
    this.record.subscribe(res => {

      console.log(res);
      this.displayedCol = Object.keys(Object.values(res.response)[0]);
      this.displayedCol.unshift("HWC_EDIT_BUTTON");
      this.displayedCol = this.displayedCol.filter(res => res!=="HWC_METAINSTANCE_ID" && res!="HWC_CASE_FREQ");
     //
     this.displayedCol.push("HWC_CASE_FREQ");
      this.dataSource = new MatTableDataSource(res.response);
      console.log(this.dataSource.value);
      this.dataSource.paginator = this.paginator;

    });
  }

  editWSUsers(data){
    console.log(data);
    delete data.HWC_CASE_FREQ;
    console.log(data);
    let dialogRef = this.dialog.open(CaseUsersDetailsComponent, {
      width: '500px',
      height: '500px',
      data: data
    });

    dialogRef.afterClosed().subscribe(() => {
      this.getWSUsers();
    });
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  applyFilterHWCvsComp(filterValue: string) {
    this.dataSource2.filter = filterValue.trim().toLowerCase();

    if (this.dataSource2.paginator) {
      this.dataSource2.paginator.firstPage();
    }
  }

  xlsxReport(dataSource, name) {
    console.log(dataSource.data);
    let d: any = new Date();
    const formatter = new Intl.DateTimeFormat('en-IN');
    d = formatter.format(d);
      name = name+'_'+d;
    this.excelService.exportAsExcelFile(dataSource.data,  name);
    return 'success';
  }

}

@Component({
  templateUrl: './caseUserDetails.component.html',
  styleUrls: ['./caseUserDetails.component.scss']
})
export class CaseUsersDetailsComponent implements OnInit {
  constructor(private wildService: ConnectorService,
    public dialogRef: MatDialogRef<CaseUsersComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder)
    {}
  ngOnInit(){
    this.wsForm.setValue(this.data);
    this.wsForm.disable();
  //   this.openWSUsers();

  }

  wsForm: FormGroup = this.fb.group({
    HWC_METAINSTANCE_ID: ['', Validators.required],
    HWC_WSID: ['', Validators.required],
    HWC_FIRST_NAME: ['', Validators.required],
    HWC_LAST_NAME: ['', Validators.required],
    HWC_FULL_NAME: ['',Validators.required],
    HWC_PARENT_NAME: ['', Validators.required],
    HWC_PARK_NAME: ['', Validators.required],
    HWC_TALUK_NAME: ['', Validators.required],
    HWC_RANGE: ['', Validators.required],
    HWC_VILLAGE_NAME:['', Validators.required],
    HWC_OLDPHONE_NUMBER:['', Validators.required],
    HWC_NEWPHONE_NUMBER:['', Validators.required],
    HWC_SURVEY_NUMBER:['', Validators.required]
  });

  // openWSUsers(){

  // }

  onNoClick(){
    this.dialogRef.close();
  }

  updateWildSeveUser(data){
    let record = this.wildService.updateWildSeveRecord(data);
    record.subscribe(data => {

      this.dialogRef.close();
    });
  }
}
