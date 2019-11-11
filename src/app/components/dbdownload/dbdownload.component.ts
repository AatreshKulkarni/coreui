import { Component, OnInit, ViewChild, QueryList, ViewChildren, Inject, OnDestroy } from '@angular/core';
import { ConnectorService } from '../../services/connector.service';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { MatTableDataSource, MatPaginator, MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material';
import { ExcelService } from '../../services/excel.service';
import { Validators, FormGroup, FormBuilder } from '@angular/forms';
import { NgxSpinnerService } from "ngx-spinner";
import * as _ from 'lodash';
@Component({
  selector: 'app-dbdownload',
  templateUrl: './dbdownload.component.html',
  styleUrls: ['./dbdownload.component.scss'],
  providers: [ConnectorService]
})
export class DbdownloadComponent implements OnInit, OnDestroy {
  @ViewChildren(MatPaginator) paginator = new QueryList<MatPaginator>();

  dataSourceDC: any = [];
  dataSourceHWC: any = [];
  dataSourceCOMP: any = [];
  dataSourcePUB: any = [];

  constructor(
    private wildService: ConnectorService,
    private excelService: ExcelService,
    private spinnerService: Ng4LoadingSpinnerService,
    public dialog: MatDialog
    ) { }

  ngOnInit() {
  //  let year = new Date();
   // console.log(year.getFullYear());
   this.spinnerService.show();
    this.calYear();
      this.dbDownloadDC(this.selected);
     this.dbDownloadHWC(this.selected1);
     this.dbDownloadPub(this.selected2);
    this.dbDownloadComp(this.selected3);
    this.spinnerService.hide();
  }

  ngOnDestroy(){
    this.dialog.closeAll();
  }

yearArr: any=[];

selected: any;
selected1: any;
selected2: any;
selected3: any;

  calYear(){
    let year = new Date();
 //   year.setFullYear(2020);
    let curYear = year.getFullYear();
  if(year.getMonth() >= 6)
    year.setFullYear(curYear+1);
  for(let i=2015;i<year.getFullYear();i++){

        this.yearArr.push(i + '-' + (i+1));


    }
    this.selected = this.yearArr[this.yearArr.length-1];
    this.selected1 = this.yearArr[this.yearArr.length-1];
    this.selected2 = this.yearArr[this.yearArr.length-1];
    this.selected3 = this.yearArr[this.yearArr.length-1];

  }



  xlsxReport(data, name) {
    this.excelService.exportAsExcelFile(data, name);
    return 'success';
  }

  displayedColHWC: any[] = [];
  displayedColDC: any[] = [];
  displayedColPub: any[] = [];
  displayedColComp: any[] = [];

  hwcData: any;
  dcData: any;
  pubData: any;
  compData: any;



//  applyFilterHWC(filterValue: string ) {

//     this.hwcData.filter = filterValue.trim().toLowerCase();

//     if (this.hwcData.paginator) {
//       this.hwcData.paginator.firstPage();
//     }
//   }

//   applyFilterDC(filterValue: string ) {
//   filterValue = filterValue.trim();
//   filterValue = filterValue.toLowerCase();
//   this.dcData.filter = filterValue;


//     if (this.dcData.paginator) {
//       this.dcData.paginator.firstPage();
//     }
//   }

dbDownloadComp(projYear){
  let data = projYear.split("-");


    let recordComp = this.wildService.getCompDBByYear(data[0], data[1]);
    recordComp.subscribe(res => {
      this.compData = res;
     if(res.length != 0 ){
      this.displayedColComp = Object.keys(Object.values(res)[0]);
      this.displayedColComp.unshift("COMP_EDIT_BUTTON");
      this.displayedColComp.pop();
      this.dataSourceCOMP = new MatTableDataSource(res);
      this.dataSourceCOMP.paginator = this.paginator.toArray()[2];;
}
});

  }


  dbDownloadDC(projYear){

    let data = projYear.split("-");
    console.log(data);

      let recordDC = this.wildService.getDCDBByYear(data[0], data[1]);
      recordDC.subscribe(res => {
        this.dcData = res;
        console.log(res[0]);
        if(res.length != 0 ){
          this.displayedColDC = Object.keys(Object.values(res)[0]);
          this.displayedColDC.unshift("DC_EDIT_BUTTON");
         // this.displayedColDC.pop();
          this.dataSourceDC = new MatTableDataSource(res);
          this.dataSourceDC.paginator = this.paginator.toArray()[0];;
}
  // this.dcData = res;
    // this.dcData.paginator = this.paginatorDC;
    // this.dispColDC = Object.keys(Object.values(res)[0]);

  });


  }


  dbDownloadHWC(projYear){

    let data = projYear.split("-");

    let recordHwc = this.wildService.getHWCDBByYear(data[0],data[1]);

    recordHwc.subscribe(res => {

    this.hwcData = res;
    if(res.length != 0 ){
      this.displayedColHWC = Object.keys(Object.values(res)[0]);
      this.displayedColHWC.push("HWC_IMAGE_1");
      this.displayedColHWC.push("HWC_IMAGE_2");
      this.displayedColHWC.push("HWC_IMAGE_3");
      this.displayedColHWC.push("HWC_IMAGE_4");
      this.displayedColHWC.push("HWC_IMAGE_5");
      this.displayedColHWC.push("HWC_IMAGE_6");
      this.displayedColHWC.push("HWC_IMAGE_7");
      this.displayedColHWC.push("HWC_IMAGE_8");
      this.displayedColHWC.unshift("HWC_EDIT_BUTTON");
      this.displayedColHWC = this.displayedColHWC.filter(res => res != "HWC_FORM_NAME");
      this.dataSourceHWC = new MatTableDataSource(res);
      this.dataSourceHWC.paginator = this.paginator.toArray()[1];;
  }
  });
  }



  dbDownloadPub(projYear){

    let data = projYear.split("-");
    let recordPub = this.wildService.getPubDBByYear(data[0], data[1]);
    recordPub.subscribe(res => {
     this.pubData = res;
     if(res.length != 0 ){
      this.displayedColPub = Object.keys(Object.values(res)[0]);
//      this.displayedColPub.unshift("PUB_EDIT_BUTTON");
      // this.displayedColPub.pop();
      this.dataSourcePUB = new MatTableDataSource(res);
      this.dataSourcePUB.paginator = this.paginator.toArray()[3];;
     }
  });


  }

   applyFilterDC(filterValue: string) {
    this.dataSourceDC.filter = filterValue.trim().toLowerCase();

    if (this.dataSourceDC.paginator) {
      this.dataSourceDC.paginator.firstPage();
    }
  }

  applyFilterHWC(filterValue: string) {
    this.dataSourceHWC.filter = filterValue.trim().toLowerCase();

    if (this.dataSourceHWC.paginator) {
      this.dataSourceHWC.paginator.firstPage();
    }
  }

  applyFilterPub(filterValue: string ) {
    this.dataSourcePUB.filter = filterValue.trim().toLowerCase();


    if (this.dataSourcePUB.paginator) {
      this.dataSourcePUB.paginator.firstPage();
    }
  }

  applyFilterComp(filterValue: string ) {
    this.dataSourceCOMP.filter = filterValue.trim().toLowerCase();


    if (this.dataSourceCOMP.paginator) {
      this.dataSourceCOMP.paginator.firstPage();
    }
  }


  getImage(data,id){
    let dialogRef = this.dialog.open(ImageComponent, {
      data: {data,id}
    });

    dialogRef.afterClosed().subscribe(() => {
       this.dbDownloadHWC(this.selected1);
    });
  }

  editHWC(data){
    data.HWC_CASE_DATE = (data.HWC_CASE_DATE=== null) ? null : data.HWC_CASE_DATE.slice(0,10);
    data.HWC_FD_SUB_DATE = (data.HWC_FD_SUB_DATE=== null) ? null : data.HWC_FD_SUB_DATE.slice(0,10);
    data.HWC_START = (data.HWC_START=== null) ? null : data.HWC_START.slice(0,10);
    data.HWC_END = (data.HWC_END=== null) ? null : data.HWC_END.slice(0,10);
    data.HWC_METASUBMISSION_DATE = (data.HWC_METASUBMISSION_DATE=== null) ? null : data.HWC_METASUBMISSION_DATE.slice(0,10);
    let dialogRef = this.dialog.open(DBDetailsComponent, {
      width: '1000px',
       height: '450px',
      data: data
    });

    dialogRef.afterClosed().subscribe(() => {
       this.dbDownloadHWC(this.selected1);
    });

  }

  editDC(data){
    data.DC_CASE_DATE = (data.DC_CASE_DATE=== null) ? null : data.DC_CASE_DATE.slice(0,10);
    data.DC_FILLIN_DATE = (data.DC_FILLIN_DATE=== null) ? null : data.DC_FILLIN_DATE.slice(0,10);
    data.DC_METASUBMISSION_DATE = (data.DC_METASUBMISSION_DATE=== null) ? null : data.DC_METASUBMISSION_DATE.slice(0,10);
    let dialogRef = this.dialog.open(DBDetailsComponent, {
      width: '1000px',
       height: '450px',
      data: data
    });

    dialogRef.afterClosed().subscribe(() => {
       this.dbDownloadDC(this.selected);
    });

  }

  editComp(data){
      data.COM_OM_SHEET_ISSUED = (data.COM_OM_SHEET_ISSUED=== null) ? null : data.COM_OM_SHEET_ISSUED.slice(0,10);
      data.COM_OM_SHEET_UPLOADED = (data.COM_OM_SHEET_UPLOADED=== null) ? null : data.COM_OM_SHEET_UPLOADED.slice(0,10);
      data.COM_FORMEND_DATE = (data.COM_FORMEND_DATE=== null) ? null : data.COM_FORMEND_DATE.slice(0,10);
    data.COM_FORMSTART_DATE = (data.COM_FORMSTART_DATE=== null) ? null : data.COM_FORMSTART_DATE.slice(0,10);
   data.COM_METASUBMISSION_DATE = (data.COM_METASUBMISSION_DATE=== null) ? null : data.COM_METASUBMISSION_DATE.slice(0,10);
    let dialogRef = this.dialog.open(DBDetailsComponent, {
      width: '1000px',
       height: '450px',
      data: data
    });

    dialogRef.afterClosed().subscribe(() => {
       this.dbDownloadComp(this.selected2);
    });
  }

}

@Component({
  templateUrl: 'dbdetail.component.html',
  styleUrls: ['dbdetail.component.scss'],
})
export class DBDetailsComponent implements OnInit{


  constructor(
    private wildService: ConnectorService,
    public dialogRef: MatDialogRef<DbdownloadComponent>,
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any,
    ){
    console.log(data);
  }



  ngOnInit(){
    if(this.data.HWC_METAINSTANCE_ID){
    this.hwcMainForm.setValue(_.omit(this.data, 'HWC_FORM_NAME'));
    this.hwcMainForm.disable();
     this.openHWCDetails(this.data.HWC_METAINSTANCE_ID);
    }
    if(this.data.DC_METAINSTANCE_ID){
      this.dcMainForm.setValue(this.data);
      this.dcMainForm.disable();
    this.openDCDetails(this.data.DC_METAINSTANCE_ID,this.data.DC_CASE_ID);
    }
    if(this.data.COM_METAINSTANCE_ID){
     this.compMainForm.setValue(this.data);
      this.compMainForm.disable();
      this.openCompDetails(this.data.COM_METAINSTANCE_ID);
    }
  //  console.log(Object.keys(this.createForm.controls));
  }

  cropHeaders;
  cropHead;
  liveStockHeaders;
  liveStockHead;
  propertyHeaders;
  propertyHead;
  cropDetails: any;
  liveStockDetails: any;
  propertyDetails: any;

  dcDetails: any;
  dcCaseDetails:any;
  dcHeaders;
  openDCDetails(dcID,dcFID){
    let dcData = this.wildService.getDCByID(dcID,dcFID);
    dcData.subscribe(res => {
      this.dcDetails = res;
      this.dcHeaders = this.dcDetails.response[1].length != 0 ? Object.keys(this.dcDetails.response[1][0]):this.dcDetails.response[1][0];
      console.log(this.dcHeaders);
      this.dcCaseDetails = this.dcDetails.response[1];
    });
  }

  compDetails: any;
  compHeaders;
  compHead;
  compesationDetails: any;
  openCompDetails(compID){
    let compData = this.wildService.getCompByID(compID);
    compData.subscribe(res => {
      this.compDetails = res;
      this.compHeaders = this.compDetails.response[1].length != 0 ? Object.keys(this.compDetails.response[1][0]):this.compDetails.response[1][0];

      this.compHead = (this.compHeaders!=undefined) ? this.compHeaders.filter(e => e !== "COM_META_ID"):this.compHeaders;
      this.compHeaders = (this.compHeaders!=undefined) ? this.compHeaders.filter(e => e !== "COM_PARENT_ID"):this.compHeaders;
      //     console.log(res);
      this.compesationDetails = this.compDetails.response[1];
      this.compesationDetails.forEach(data => {
        data.COM_HWC_DATE = (data.COM_HWC_DATE=== null) ? null : data.COM_HWC_DATE.slice(0,10);
      });
    });
  }

  hwcDetails: any;
  openHWCDetails(hwcID){
    let hwcData = this.wildService.getHWCByID(hwcID);
    hwcData.subscribe(res => {
      this.hwcDetails = res;
   //   console.log(res);
      this.cropHeaders = this.hwcDetails.response[1].length != 0 ? Object.keys(this.hwcDetails.response[1][0]):this.hwcDetails.response[1][0];
      this.propertyHeaders =this.hwcDetails.response[2].length != 0 ? Object.keys(this.hwcDetails.response[2][0]):this.hwcDetails.response[2][0];
      this.liveStockHeaders =this.hwcDetails.response[3].length != 0 ? Object.keys(this.hwcDetails.response[3][0]):this.hwcDetails.response[3][0];
     // console.log(this.hwcDetails);

    this.cropHead = (this.cropHeaders!=undefined) ? this.cropHeaders.filter(e => e !== "HWC_META_ID"):this.cropHeaders;
    this.cropHeaders = (this.cropHeaders!=undefined) ? this.cropHeaders.filter(e => e !== "HWC_PARENT_ID"):this.cropHeaders;
    this.propertyHead =(this.propertyHeaders!=undefined)? this.propertyHeaders.filter(e => e !== "HWC_META_ID"):this.propertyHeaders;
    this.propertyHeaders = (this.propertyHeaders!=undefined)? this.propertyHeaders.filter(e => e !== "HWC_PARENT_ID"):this.propertyHeaders;
    this.liveStockHead = (this.liveStockHeaders!=undefined) ? this.liveStockHeaders.filter(e => e !== "HWC_META_ID"): this.liveStockHeaders;
    this.liveStockHeaders = (this.liveStockHeaders!=undefined) ? this.liveStockHeaders.filter(e => e !== "HWC_PARENT_ID"): this.liveStockHeaders;

      this.cropDetails = this.hwcDetails.response[1];
      this.cropDetails.HWC_CASE_DATE = (this.cropDetails.HWC_CASE_DATE=== null) ? null : this.cropDetails.HWC_CASE_DATE.slice(0,10);
      this.propertyDetails = this.hwcDetails.response[2];
      this.propertyDetails.HWC_CASE_DATE = (this.propertyDetails.HWC_CASE_DATE=== null) ? null : this.propertyDetails.HWC_CASE_DATE.slice(0,10);
      this.liveStockDetails = this.hwcDetails.response[3];
      this.liveStockDetails.HWC_CASE_DATE = (this.liveStockDetails.HWC_CASE_DATE=== null) ? null : this.liveStockDetails.HWC_CASE_DATE.slice(0,10);
  // console.log(this.cropHeaders);
  // console.log(this.cropHead);
    });
  }


  updateDCCaseData(data){
    console.log(data);

     this.wildService.updateDCCaseRecord(_.omit(data,'isEditable')).subscribe(res=>{
      console.log(res);
    });
  }

  updateCompData(data){


     this.wildService.updateCompCaseData(_.omit(data,'isEditable')).subscribe(res=>{
      console.log(res);
    });
  }

  updateCropData(data){


    this.wildService.updateCropRecord(_.omit(data,'isEditable')).subscribe(res=>{
      console.log(res);
    });
  }

  updateLivestockData(data){


    this.wildService.updateLiveStockRecord(_.omit(data,'isEditable')).subscribe(res=>{
      console.log(res);
    });
  }

  updatePropertyData(data){

    this.wildService.updatePropertyRecord(_.omit(data,'isEditable')).subscribe(res=>{
      console.log(res);
    });
  }
  hwcMainForm: FormGroup = this.fb.group({
    HWC_METAINSTANCE_ID: ['', Validators.required],
    HWC_METAMODEL_VERSION: ['', Validators.required],
    HWC_METAUI_VERSION: ['', Validators.required],
    HWC_METASUBMISSION_DATE: ['', Validators.required],
    HWC_WSID: ['',Validators.required],
    HWC_FIRST_NAME: ['', Validators.required],
    HWC_LAST_NAME: ['', Validators.required],
    HWC_PARENT_NAME: ['', Validators.required],
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
    HWC_ACCURACY:['', Validators.required],
    HWC_ALTITUDE:['', Validators.required],
    HWC_CASE_DATE:['', Validators.required],
    HWC_CASE_CATEGORY:['', Validators.required],
    HWC_ANIMAL:['', Validators.required],
    HWC_OTHER_ANIMAL:['', Validators.required],
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
    HWC_FD_NUM_DAYS:['', Validators.required],
    HWC_FD_COMMENT:['', Validators.required],
    HWC_START:['', Validators.required],
    HWC_END:['', Validators.required],
    HWC_DEVICE_ID:['', Validators.required],
    HWC_SIMCARD_ID:['', Validators.required],
    HWC_FA_PHONE_NUMBER:['', Validators.required],
    HWC_USER_NAME:['', Validators.required],
    HWC_CASE_TYPE:['', Validators.required],
    HWC_COMMENT_1: ['', Validators.required],
    HWC_COMMENT_2: ['', Validators.required],
  });

  dcMainForm: FormGroup = this.fb.group({
    DC_METAINSTANCE_ID: ['', Validators.required],
    DC_METAMODEL_VERSION: ['', Validators.required],
    DC_METAUI_VERSION: ['', Validators.required],
    DC_METASUBMISSION_DATE: ['', Validators.required],
    DC_FILLIN_DATE: ['',Validators.required],
    DC_BP_CASES: ['', Validators.required],
    DC_CASE_DATE: ['', Validators.required],
    DC_CASE_ID: ['', Validators.required],
    DC_DEVICE_ID:['', Validators.required],
    DC_NH_CASES:['', Validators.required],
    DC_PHONE_NUMBER:['', Validators.required],
    DC_SIMCARD_ID:['', Validators.required],
    DC_TOTAL_CASES: ['', Validators.required],
    DC_USER_NAME:['', Validators.required]
  });

  compMainForm: FormGroup = this.fb.group({
    COM_METAINSTANCE_ID: ['', Validators.required],
    COM_METAMODEL_VERSION: ['', Validators.required],
    COM_METAUI_VERSION: ['', Validators.required],
    COM_METASUBMISSION_DATE: ['', Validators.required],
    COM_INSTANCE_NAME: ['',Validators.required],
    COM_FORMSTART_DATE: ['', Validators.required],
    COM_FORMEND_DATE: ['', Validators.required],
    COM_OM_SHEET_ISSUED: ['', Validators.required],
    COM_DEVICE_ID:['', Validators.required],
    COM_SIM_ID:['', Validators.required],
    COM_FA_PHONE_NUM:['', Validators.required],
    COM_USER_NAME:['', Validators.required],
    COM_OM_SHEET_NUM: ['', Validators.required],
    COM_OM_RANGE:['', Validators.required],
    COM_OM_SHEET_UPLOADED:['', Validators.required],
    COM_OM_TOTAL_CASES:['', Validators.required],
    COM_OM_WS_CASES:['', Validators.required],
    COM_WSID_FORM_DATE: ['', Validators.required],
    COM_FORM_NAME:['', Validators.required]
  });

  updateHWCForm(data){
    this.wildService.updateHWCRecord(data).subscribe(res=>{
      console.log(res);
    });
  }

  updateDCForm(data){
    this.wildService.updateDCParentRecord(data).subscribe(res=>{
      console.log(res);
    });
  }


  updateCompForm(data){
    this.wildService.updateCompParentRecord(data).subscribe(res=>{
      console.log(res);
    });
  }


  // onNoClick(): void {
  //   this.dialogRef.close();
  // }

  // hwcForm1: FormGroup = this.fb.group({
  //   HWC_META_ID: ['', Validators.required],
  //   HWC_PARENT_ID: ['', Validators.required],
  //   HWC_CASE_DATE: ['', Validators.required],
  //   HWC_WSID: ['', Validators.required],
  //   HWC_CROP_NAME: ['',Validators.required],
  //   HWC_OTHER_CROP_NAME: ['', Validators.required],
  //   HWC_AREA_GROWN: ['', Validators.required],
  //   HWC_AREA_DAMAGE: ['', Validators.required],
  //   HWC_CROP_DAMAGE_AMOUNT:['', Validators.required],
  //   HWC_CROP_GEO_SHAPE:['', Validators.required],
  // });


//  this.inputvalue = this.createForm.get('HWC_METAINSTANCE_ID').value;
//  console.log(this.inputvalue);
// console.log(this.createForm);


  onNoClick(){
    this.dialogRef.close();
  }
}

@Component({
  templateUrl:'hwcimage.component.html',
  styleUrls: ['hwcimage.component.scss']
})
export class ImageComponent implements OnInit{
  constructor(
    private wildService: ConnectorService,
    public dialogRef: MatDialogRef<DbdownloadComponent>,
    private spinner: NgxSpinnerService,
    @Inject(MAT_DIALOG_DATA) public data: any
    ){}
  ngOnInit(){
    // this.spinner.show();
      this.getImage(this.data.data,this.data.id);
  }
  imagedata: any;
  image: any;
  loading: any = true;
  getImage(data,id){
    let hwcImages = this.wildService.getHWCImages("uuid:"+data.HWC_METAINSTANCE_ID,data.HWC_FORM_NAME,id);
    hwcImages.subscribe(res => {
      this.image = res.data;
      console.log(res);
      if(res.success){
      this.imagedata = 'data:image/png;base64,' + this.image;
    }
    this.loading = false;
    // this.spinner.hide();
    });
  }

  onNoClick(){
    this.dialogRef.close();
  }
}
