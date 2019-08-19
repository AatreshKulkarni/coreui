import {Component, ViewChild, Inject, EventEmitter, OnInit, TemplateRef, OnDestroy } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA,
  MatPaginator, MatTableDataSource} from '@angular/material';
import { AddUserService } from '../../services/addUser.service';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ConnectorService } from './../../services/connector.service';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
/**
 * @title Dialog Overview
 */
@Component({
  templateUrl: 'errors.component.html',
  styleUrls: ['errors.component.scss']
})
export class ErrorsComponent implements OnInit, OnDestroy {

  record: any;
  record1: any;
  dataSource: any;
  modalRef: BsModalRef;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  totalPost = 10;
  postPerPage = 10;
  pageSizeOptions = [5, 10, 20, 50, 100];

  constructor(public dialog: MatDialog,  private spinnerService: Ng4LoadingSpinnerService, private wildService: ConnectorService) {
  }

  displayedCol: any;



  // openModal(lgModal, pid: any, did: any) {
  //   // this.modalRef = this.modalService.show(template);
  //   lgModal.show();
  //   this.record =  this.wildService.getParentRecord(pid);
  //   this.record.subscribe(res => {
  //     console.log(res.response[0]);
  //     this.dataSource = res.response[0];
  //   });
  //   this.record1 = this.wildService.getDuplicateRecord(did);
  //   this.record1.subscribe(res => {
  //     console.log(res.response);

  //   });

  // }

  openUpdate(data): void {
let dialogRef = this.dialog.open(ErrorDetailsComponent, {
      width: '800px',
       height: '450px',
      data: data
    });

    dialogRef.afterClosed().subscribe(() => {
      this.getTable();
    });

  }

ngOnDestroy(){
  this.dialog.closeAll();
}

  ngOnInit() {
    this.spinnerService.show();
    this.getTable();
  }



  getTable(){
    this.record = this.wildService.getErrorRecords();
    this.record.subscribe(res => {
      if (!res) {
        this.spinnerService.hide();
        return;
      }
      this.dataSource = res.response;
     // console.log(this.dataSource);
      this.displayedCol = ["HWC_ORG_METAID", "HWC_DUP_METAID",  "Action"];
      this.spinnerService.hide();
    });
  }

  // deleteUser(username) {
  //   this.addUser.deleteUser(username).subscribe(() => {
  //     this.fetchUser();
  //   });
  // }

}


@Component({
  templateUrl: 'errors-dialogue.component.html',
  styleUrls: ['errors-dialogue.component.scss'],
})
export class ErrorDetailsComponent implements OnInit{

  record1: any;
  record2: any;
  createForm: FormGroup;
  createForm2: FormGroup;
  private formSubmitAttempt: boolean;
  dataSource: any;
  dataSource2: any;
  public event: EventEmitter<any> = new EventEmitter();

  constructor(
    public dialogRef: MatDialogRef<ErrorsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private wildService: ConnectorService,
    private fb: FormBuilder,
    private router: Router,
  ) {


  }

  updateHWC( element){
    this.dialogRef.close();

    for (var key in element) {
      if (element[key] === '') {
        element[key] = null;
//        console.log(element[key]);
      }
    }
   // console.log(element.HWC_METAINSTANCE_ID);

    this.wildService.updateParentRecord(element.HWC_METAINSTANCE_ID,element.HWC_METAMODEL_VERSION,element.HWC_METAUI_VERSION,element.HWC_METASUBMISSION_DATE,element.HWC_WSID,element.HWC_FIRST_NAME,element.HWC_LAST_NAME,element.HWC_FULL_NAME,element.HWC_PARK_NAME,element.HWC_TALUK_NAME,element.HWC_VILLAGE_NAME,element.HWC_OLDPHONE_NUMBER,element.HWC_NEWPHONE_NUMBER,element.HWC_SURVEY_NUMBER,element.HWC_RANGE,element.HWC_LATITUDE,element.HWC_LONGITUDE,element.HWC_ALTITUDE,element.HWC_ACCURACY,element.HWC_CASE_DATE,element.HWC_CASE_CATEGORY,element.HWC_ANIMAL,element.HWC_HI_NAME,element.HWC_HI_VILLAGE,element.HWC_HI_AREA,element.HWC_HI_DETAILS,element.HWC_HD_NAME,element.HWC_HD_VILLAGE,element.HWC_HD_DETAILS,element.HWC_COMMENT,element.HWC_FD_SUB_DATE,element.HWC_FD_SUB_RANGE,element.HWC_FD_NUM_FORMS,element.HWC_FD_COMMENT,element.HWC_START,element.HWC_END,element.HWC_DEVICE_ID,element.HWC_SIMCARD_ID,element.HWC_FA_PHONE_NUMBER,element.HWC_USER_NAME,element.HWC_CASE_TYPE)
    .subscribe((res) => {
    //  console.log(res);
      setTimeout(() => {
      if(res.status === 200){
        alert("Row Updated!");
        this.dialogRef.close();
      }
      else{
        alert("Something Went Wrong Please Retry!");
      }
    },200);
    });
  }

  errorRecord(did){

    did = "uuid:" + did;
    this.wildService.insertErrorRecord(did).subscribe((result) => {

    if(result != undefined){
      this.wildService.updateErrorRecord(did).subscribe((res) => {
      if(res.status == 200)
        this.dialogRef.close();
      })
      }

    //  this.router.navigateByUrl('/error');

    });
  }

inputvalue:any;
  form1() {
    this.createForm = this.fb.group({
      HWC_METAINSTANCE_ID: ['', Validators.required],
      HWC_METAMODEL_VERSION: ['', Validators.required],
      HWC_METAUI_VERSION: ['', Validators.required],
      HWC_METASUBMISSION_DATE: ['', Validators.required],
      HWC_WSID: ['',Validators.required],
      HWC_FIRST_NAME: ['', Validators.required],
      HWC_LAST_NAME: ['', Validators.required],
      HWC_FULL_NAME:['', Validators.required],
      HWC_PARK_NAME:['', Validators.required],
      HWC_TALUK_NAME:['', Validators.required],
      HWC_VILLAGE_NAME:['', Validators.required],
      HWC_OLDPHONE_NUMBER:['', Validators.required],
      HWC_NEWPHONE_NUMBER:['', Validators.required],
      HWC_SURVEY_NUMBER: ['', Validators.required],
      HWC_RANGE:['', Validators.required],
      HWC_LATITUDE:['', Validators.required],
      HWC_LONGITUDE:['', Validators.required],
      HWC_ALTITUDE:['', Validators.required],
      HWC_ACCURACY:['', Validators.required],
      HWC_CASE_DATE:['', Validators.required],
      HWC_CASE_CATEGORY:['', Validators.required],
      HWC_ANIMAL:['', Validators.required],
      HWC_HI_NAME:['', Validators.required],
      HWC_HI_VILLAGE:['', Validators.required],
      HWC_HI_AREA:['', Validators.required],
      HWC_HI_DETAILS:['', Validators.required],
      HWC_HD_NAME:['', Validators.required],
      HWC_HD_VILLAGE:['', Validators.required],
      HWC_HD_DETAILS:['', Validators.required],
      HWC_COMMENT:['', Validators.required],
      HWC_FD_SUB_DATE:['', Validators.required],
      HWC_FD_SUB_RANGE:['', Validators.required],
      HWC_FD_NUM_FORMS:['', Validators.required],
      HWC_FD_COMMENT:['', Validators.required],
      HWC_START:['', Validators.required],
      HWC_END:['', Validators.required],
      HWC_DEVICE_ID:['', Validators.required],
      HWC_SIMCARD_ID:['', Validators.required],
      HWC_FA_PHONE_NUMBER:['', Validators.required],
      HWC_USER_NAME:['', Validators.required],
      HWC_CASE_TYPE:['', Validators.required]
    })
  //  this.inputvalue = this.createForm.get('HWC_METAINSTANCE_ID').value;
  //  console.log(this.inputvalue);
 // console.log(this.createForm);
  }


  form2() {
    this.createForm2 = this.fb.group({
      HWC_METAINSTANCE_ID: ['', Validators.required],
      HWC_METAMODEL_VERSION: ['', Validators.required],
      HWC_METAUI_VERSION: ['', Validators.required],
      HWC_METASUBMISSION_DATE: ['', Validators.required],
      HWC_WSID: ['',Validators.required],
      HWC_FIRST_NAME: ['', Validators.required],
      HWC_LAST_NAME: ['', Validators.required],
      HWC_FULL_NAME:['', Validators.required],
      HWC_PARK_NAME:['', Validators.required],
      HWC_TALUK_NAME:['', Validators.required],
      HWC_VILLAGE_NAME:['', Validators.required],
      HWC_OLDPHONE_NUMBER:['', Validators.required],
      HWC_NEWPHONE_NUMBER:['', Validators.required],
      HWC_SURVEY_NUMBER: ['', Validators.required],
      HWC_RANGE:['', Validators.required],
      HWC_LATITUDE:['', Validators.required],
      HWC_LONGITUDE:['', Validators.required],
      HWC_ALTITUDE:['', Validators.required],
      HWC_ACCURACY:['', Validators.required],
      HWC_CASE_DATE:['', Validators.required],
      HWC_CASE_CATEGORY:['', Validators.required],
      HWC_ANIMAL:['', Validators.required],
      HWC_HI_NAME:['', Validators.required],
      HWC_HI_VILLAGE:['', Validators.required],
      HWC_HI_AREA:['', Validators.required],
      HWC_HI_DETAILS:['', Validators.required],
      HWC_HD_NAME:['', Validators.required],
      HWC_HD_VILLAGE:['', Validators.required],
      HWC_HD_DETAILS:['', Validators.required],
      HWC_COMMENT:['', Validators.required],
      HWC_FD_SUB_DATE:['', Validators.required],
      HWC_FD_SUB_RANGE:['', Validators.required],
      HWC_FD_NUM_FORMS:['', Validators.required],
      HWC_FD_COMMENT:['', Validators.required],
      HWC_START:['', Validators.required],
      HWC_END:['', Validators.required],
      HWC_DEVICE_ID:['', Validators.required],
      HWC_SIMCARD_ID:['', Validators.required],
      HWC_FA_PHONE_NUMBER:['', Validators.required],
      HWC_USER_NAME:['', Validators.required],
      HWC_CASE_TYPE:['', Validators.required]
    })
  }

  flagIds: any;
hasError:boolean = false;
  ngOnInit(){

    this.form1();
    this.form2();
    //this.dataSource;
 // console.log(this.data.HWC_ORG_METAID);
    this.record1 = this.wildService.getParentRecord(this.data.HWC_ORG_METAID);
    this.record1.subscribe(res => {
      this.dataSource=res.response[0];
     // console.log(this.dataSource);
  this.updateForm1();
  console.log(this.data.HWC_DUP_METAID);
  console.log(this.data.HWC_FORM_NAME);
  this.record2 = this.wildService.getDuplicateRecord(this.data.HWC_DUP_METAID, this.data.HWC_FORM_NAME);
    this.record2.subscribe(res => {
        this.dataSource2=res.response;
      //  console.log(this.dataSource2)
        this.updateForm2();

       this.flagIds  = this.styleIt(this.dataSource,this.dataSource2);
  //     console.log(this.flagIds);
    });
  });



    //   for(let key in this.dataSource) {
    //       if(this.dataSource[key] == this.dataSource2[key]) {
    //         if(this.dataSource[key]!==null){
    //  //       console.log(this.dataSource[key]);
    //         continue;
    //       }
    //       }

    //   }





  }

  styleIt(origindata, flagdata){
    let result: any;

    console.log(typeof origindata.HWC_LAST_NAME);
    console.log(typeof flagdata.HWC_LAST_NAME);

    //console.log((flagdata.HWC_LAST_NAME != "" || flagdata.HWC_LAST_NAME != null)? flagdata.HWC_LAST_NAME.toLowerCase() :null);
    console.log( );
    // console.log(flagdata.HWC_LAST_NAME == null ?null: flagdata.HWC_LAST_NAME.toLowerCase()  );
    // console.log(flagdata.HWC_FIRST_NAME);
    // console.log(flagdata.HWC_FIRST_NAME== null ? null : flagdata.HWC_FIRST_NAME.toLowerCase() );
   return result = {
    HWC_WSID: flagdata.HWC_WSID == origindata.HWC_WSID ? 1: 0,
    HWC_FIRST_NAME: (flagdata.HWC_FIRST_NAME!= "" ? flagdata.HWC_FIRST_NAME.toLowerCase() : null) == (typeof origindata.HWC_FIRST_NAME == "string" ? (origindata.HWC_FIRST_NAME!=""? origindata.HWC_FIRST_NAME.toLowerCase():""): null ) ? 1: 0,
    HWC_LAST_NAME:  (flagdata.HWC_LAST_NAME != ""? flagdata.HWC_LAST_NAME.toLowerCase() :null)  == (typeof origindata.HWC_LAST_NAME == "string" ? (origindata.HWC_LAST_NAME!=""? origindata.HWC_LAST_NAME.toLowerCase():""): null )? 1: 0,
    HWC_FULL_NAME: (flagdata.HWC_FULL_NAME != "" ? flagdata.HWC_FULL_NAME.toLowerCase() :null)  == (typeof origindata.HWC_FULL_NAME == "string" ? (origindata.HWC_FULL_NAME!=""? origindata.HWC_FULL_NAME.toLowerCase():""): null ) ? 1: 0,
    HWC_PARK_NAME: (flagdata.HWC_PARK_NAME != "" ? flagdata.HWC_PARK_NAME.toLowerCase() :null)  == (typeof origindata.HWC_PARK_NAME == "string" ? (origindata.HWC_PARK_NAME!=""? origindata.HWC_PARK_NAME.toLowerCase():""): null )? 1: 0,
    HWC_TALUK_NAME: (flagdata.HWC_TALUK_NAME != "" ? flagdata.HWC_TALUK_NAME.toLowerCase() :null)  == (typeof origindata.HWC_TALUK_NAME == "string" ? (origindata.HWC_TALUK_NAME!=""? origindata.HWC_TALUK_NAME.toLowerCase():""): null )? 1: 0,
    HWC_VILLAGE_NAME: (flagdata.HWC_VILLAGE_NAME != "" ?  flagdata.HWC_VILLAGE_NAME.toLowerCase(): null) == (typeof origindata.HWC_VILLAGE_NAME == "string" ? (origindata.HWC_VILLAGE_NAME!=""? origindata.HWC_VILLAGE_NAME.toLowerCase():""): null) ? 1: 0,
    HWC_OLDPHONE_NUMBER: flagdata.HWC_OLDPHONE_NUMBER == origindata.HWC_OLDPHONE_NUMBER ? 1: 0,
    HWC_NEWPHONE_NUMBER: flagdata.HWC_NEWPHONE_NUMBER == origindata.HWC_NEWPHONE_NUMBER ? 1: 0,
    HWC_SURVEY_NUMBER: flagdata.HWC_SURVEY_NUMBER == origindata.HWC_SURVEY_NUMBER ? 1: 0,
    HWC_RANGE: (flagdata.HWC_RANGE != "" ? flagdata.HWC_RANGE.toLowerCase() : null) == (typeof origindata.HWC_RANGE == "string" ? (origindata.HWC_RANGE!=""? origindata.HWC_RANGE.toLowerCase():""): null) ? 1: 0,
    HWC_FD_SUB_RANGE: (flagdata.HWC_FD_SUB_RANGE != "" ? flagdata.HWC_FD_SUB_RANGE.toLowerCase() : null) == (typeof origindata.HWC_FD_SUB_RANGE == "string" ? (origindata.HWC_FD_SUB_RANGE!=""? origindata.HWC_FD_SUB_RANGE.toLowerCase():""): null) ? 1: 0
   }
  }

  varifyHWC(did){
    this.wildService.updateErrorRecord(did).subscribe((res) => {
      if(res.status === 200){
        this.dialogRef.close();

    }
    else{
      alert("Something went wrong kindly retry!");
    }
  });
  }

  updateForm1(){
    this.createForm.get('HWC_METAINSTANCE_ID').setValue(this.dataSource.HWC_METAINSTANCE_ID);
    this.createForm.get('HWC_METAMODEL_VERSION').setValue(this.dataSource.HWC_METAMODEL_VERSION);
    this.createForm.get('HWC_METAUI_VERSION').setValue(this.dataSource.HWC_METAUI_VERSION);
     this.createForm.get('HWC_METASUBMISSION_DATE').setValue((this.dataSource.HWC_METASUBMISSION_DATE === null) ? null : this.dataSource.HWC_METASUBMISSION_DATE.slice(0,10));
     this.createForm.get('HWC_WSID').setValue(this.dataSource.HWC_WSID);
     this.createForm.get('HWC_FIRST_NAME').setValue(this.dataSource.HWC_FIRST_NAME);
     this.createForm.get('HWC_LAST_NAME').setValue(this.dataSource.HWC_LAST_NAME);
     this.createForm.get('HWC_FULL_NAME').setValue(this.dataSource.HWC_FULL_NAME);
     this.createForm.get('HWC_PARK_NAME').setValue(this.dataSource.HWC_PARK_NAME);
     this.createForm.get('HWC_TALUK_NAME').setValue(this.dataSource.HWC_TALUK_NAME);
     this.createForm.get('HWC_VILLAGE_NAME').setValue(this.dataSource.HWC_VILLAGE_NAME);
     this.createForm.get('HWC_OLDPHONE_NUMBER').setValue(this.dataSource.HWC_OLDPHONE_NUMBER);
     this.createForm.get('HWC_NEWPHONE_NUMBER').setValue(this.dataSource.HWC_NEWPHONE_NUMBER);
     this.createForm.get('HWC_SURVEY_NUMBER').setValue(this.dataSource.HWC_SURVEY_NUMBER);
     this.createForm.get('HWC_RANGE').setValue(this.dataSource.HWC_RANGE);
     this.createForm.get('HWC_LATITUDE').setValue(this.dataSource.HWC_LATITUDE);
     this.createForm.get('HWC_LONGITUDE').setValue(this.dataSource.HWC_LONGITUDE);
     this.createForm.get('HWC_ALTITUDE').setValue(this.dataSource.HWC_ALTITUDE);
     this.createForm.get('HWC_ACCURACY').setValue(this.dataSource.HWC_ACCURACY);
     this.createForm.get('HWC_CASE_DATE').setValue((this.dataSource.HWC_CASE_DATE === null) ? null : this.dataSource.HWC_CASE_DATE.slice(0,10));
     this.createForm.get('HWC_CASE_CATEGORY').setValue(this.dataSource.HWC_CASE_CATEGORY);
     this.createForm.get('HWC_ANIMAL').setValue(this.dataSource.HWC_ANIMAL);
     this.createForm.get('HWC_HI_NAME').setValue(this.dataSource.HWC_HI_NAME);
     this.createForm.get('HWC_HI_VILLAGE').setValue(this.dataSource.HWC_HI_VILLAGE);
     this.createForm.get('HWC_HI_AREA').setValue(this.dataSource.HWC_HI_AREA);
     this.createForm.get('HWC_HI_DETAILS').setValue(this.dataSource.HWC_HI_DETAILS);
     this.createForm.get('HWC_HD_NAME').setValue(this.dataSource.HWC_HD_NAME);
     this.createForm.get('HWC_HD_VILLAGE').setValue(this.dataSource.HWC_HD_VILLAGE);
     this.createForm.get('HWC_HD_DETAILS').setValue(this.dataSource.HWC_HD_DETAILS);
     this.createForm.get('HWC_COMMENT').setValue(this.dataSource.HWC_COMMENT);
     this.createForm.get('HWC_FD_SUB_DATE').setValue((this.dataSource.HWC_FD_SUB_DATE === null) ? null : this.dataSource.HWC_FD_SUB_DATE.slice(0,10));
     this.createForm.get('HWC_FD_SUB_RANGE').setValue(this.dataSource.HWC_FD_SUB_RANGE);
     this.createForm.get('HWC_FD_NUM_FORMS').setValue(this.dataSource.HWC_FD_NUM_FORMS);
     this.createForm.get('HWC_FD_COMMENT').setValue(this.dataSource.HWC_FD_COMMENT);
     this.createForm.get('HWC_START').setValue((this.dataSource.HWC_START === null) ? null : this.dataSource.HWC_START.slice(0,10));
     this.createForm.get('HWC_END').setValue((this.dataSource.HWC_END === null) ? null : this.dataSource.HWC_END.slice(0,10));
     this.createForm.get('HWC_DEVICE_ID').setValue(this.dataSource.HWC_DEVICE_ID);
     this.createForm.get('HWC_SIMCARD_ID').setValue(this.dataSource.HWC_SIMCARD_ID);
     this.createForm.get('HWC_FA_PHONE_NUMBER').setValue(this.dataSource.HWC_FA_PHONE_NUMBER);
     this.createForm.get('HWC_USER_NAME').setValue(this.dataSource.HWC_USER_NAME);
     this.createForm.get('HWC_CASE_TYPE').setValue(this.dataSource.HWC_CASE_TYPE);

  }

  updateForm2(){
    this.createForm2.get('HWC_METAINSTANCE_ID').setValue(this.dataSource2.HWC_METAINSTANCE_ID);
    this.createForm2.get('HWC_METAMODEL_VERSION').setValue(this.dataSource2.HWC_METAMODEL_VERSION);
    this.createForm2.get('HWC_METAUI_VERSION').setValue(this.dataSource2.HWC_METAUI_VERSION);
     this.createForm2.get('HWC_METASUBMISSION_DATE').setValue(this.dataSource2.HWC_METASUBMISSION_DATE);
     this.createForm2.get('HWC_WSID').setValue(this.dataSource2.HWC_WSID);
     this.createForm2.get('HWC_FIRST_NAME').setValue(this.dataSource2.HWC_FIRST_NAME);
     this.createForm2.get('HWC_LAST_NAME').setValue(this.dataSource2.HWC_LAST_NAME);
     this.createForm2.get('HWC_FULL_NAME').setValue(this.dataSource2.HWC_FULL_NAME);
     this.createForm2.get('HWC_PARK_NAME').setValue(this.dataSource2.HWC_PARK_NAME);
     this.createForm2.get('HWC_TALUK_NAME').setValue(this.dataSource2.HWC_TALUK_NAME);
     this.createForm2.get('HWC_VILLAGE_NAME').setValue(this.dataSource2.HWC_VILLAGE_NAME);
     this.createForm2.get('HWC_OLDPHONE_NUMBER').setValue(this.dataSource2.HWC_OLDPHONE_NUMBER);
     this.createForm2.get('HWC_NEWPHONE_NUMBER').setValue(this.dataSource2.HWC_NEWPHONE_NUMBER);
     this.createForm2.get('HWC_SURVEY_NUMBER').setValue(this.dataSource2.HWC_SURVEY_NUMBER);
     this.createForm2.get('HWC_RANGE').setValue(this.dataSource2.HWC_RANGE);
     this.createForm2.get('HWC_LATITUDE').setValue(this.dataSource2.HWC_LATITUDE);
     this.createForm2.get('HWC_LONGITUDE').setValue(this.dataSource2.HWC_LONGITUDE);
     this.createForm2.get('HWC_ALTITUDE').setValue(this.dataSource2.HWC_ALTITUDE);
     this.createForm2.get('HWC_ACCURACY').setValue(this.dataSource2.HWC_ACCURACY);
     this.createForm2.get('HWC_CASE_DATE').setValue(this.dataSource2.HWC_CASE_DATE);
     this.createForm2.get('HWC_CASE_CATEGORY').setValue(this.dataSource2.HWC_CASE_CATEGORY);
     this.createForm2.get('HWC_ANIMAL').setValue(this.dataSource2.HWC_ANIMAL);
     this.createForm2.get('HWC_HI_NAME').setValue(this.dataSource2.HWC_HI_NAME);
     this.createForm2.get('HWC_HI_VILLAGE').setValue(this.dataSource2.HWC_HI_VILLAGE);
     this.createForm2.get('HWC_HI_AREA').setValue(this.dataSource2.HWC_HI_AREA);
     this.createForm2.get('HWC_HI_DETAILS').setValue(this.dataSource2.HWC_HI_DETAILS);
     this.createForm2.get('HWC_HD_NAME').setValue(this.dataSource2.HWC_HD_NAME);
     this.createForm2.get('HWC_HD_VILLAGE').setValue(this.dataSource2.HWC_HD_VILLAGE);
     this.createForm2.get('HWC_HD_DETAILS').setValue(this.dataSource2.HWC_HD_DETAILS);
     this.createForm2.get('HWC_COMMENT').setValue(this.dataSource2.HWC_COMMENT);
     this.createForm2.get('HWC_FD_SUB_DATE').setValue(this.dataSource2.HWC_FD_SUB_DATE);
     this.createForm2.get('HWC_FD_SUB_RANGE').setValue(this.dataSource2.HWC_FD_SUB_RANGE);
     this.createForm2.get('HWC_FD_NUM_FORMS').setValue(this.dataSource2.HWC_FD_NUM_FORMS);
     this.createForm2.get('HWC_FD_COMMENT').setValue(this.dataSource2.HWC_FD_COMMENT);
     this.createForm2.get('HWC_START').setValue(this.dataSource2.HWC_START);
     this.createForm2.get('HWC_END').setValue(this.dataSource2.HWC_END);
     this.createForm2.get('HWC_DEVICE_ID').setValue(this.dataSource2.HWC_DEVICE_ID);
     this.createForm2.get('HWC_SIMCARD_ID').setValue(this.dataSource2.HWC_SIMCARD_ID);
     this.createForm2.get('HWC_FA_PHONE_NUMBER').setValue(this.dataSource2.HWC_FA_PHONE_NUMBER);
     this.createForm2.get('HWC_USER_NAME').setValue(this.dataSource2.HWC_USER_NAME);
     this.createForm2.get('HWC_CASE_TYPE').setValue(this.dataSource2.HWC_CASE_TYPE);

  }

  isFieldInvalid(field: string) {
    // return (
    //   (!this.createForm.get(field).valid && this.createForm.get(field).touched) ||
    //   (this.createForm.get(field).untouched && this.formSubmitAttempt)
    // );
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  // createUser(firstname, lastname, username, phone, email, password, roleid){
  //   this.dialogRef.close();
  //   this.addUser.createUser(firstname, lastname, username, phone, email, password, roleid).subscribe(() => {
  //       this.router.navigate['/user']
  //     });
  // }

}
