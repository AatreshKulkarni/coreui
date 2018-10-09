import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";

import { Data } from "../models/data.model";

import { map } from "rxjs/operators";
import { Observable } from "rxjs";

@Injectable()
// providedIn: 'root'
export class ConnectorService {
  // private uri = 'https://nodecleaner.azurewebsites.net/';
  // private uri = 'https://wildseve-node.appspot.com/';
  private uri = "https://wildseveproject.appspot.com/";

  constructor(private http: HttpClient) {}

  getDailyCountUsers(): Observable<any> {
    // console.log('Hello World');
    return this.http.get<any>(this.uri + "getallDC");
  }
  getCompensation_OM(): Observable<any> {
    // console.log('Hello World');
    return this.http.get<any>(this.uri + "getCompensation_OM");
  }
  getReport(): Observable<any> {
    return this.http.get<any>(this.uri);
  }
  getPublicity(): Observable<any> {
    return this.http.get<any>(this.uri + "getpublicity");
  }
  getDCreportbyrange(fromDate, toDate): Observable<any> {
    return this.http.post<any>(this.uri + "getDCreportbyrange", {
      fromdate: fromDate,
      todate: toDate
    });
  }
  getDCreportbyMonth(): Observable<any> {
    return this.http.get<any>(this.uri + "getDCreportbyMonth");
  }
  getDCreportbyday(): Observable<any> {
    return this.http.get<any>(this.uri + "getDCreportbyday");
  }
  getHWC(): Observable<any> {
    return this.http.get<any>(this.uri + "gethwc");
  }
  getcase_users(): Observable<any> {
    return this.http.get<any>(this.uri + "getcase_users");
  }
  getHWCreport_bycases(): Observable<any> {
    return this.http.get<any>(this.uri + "getHWCreport_bycases");
  }
  getHWCreport_byday(): Observable<any> {
    return this.http.get<any>(this.uri + "getHWCreport_byday");
  }
  getHWCreport_bycases_range(fromDate, toDate): Observable<any> {
    return this.http.post<any>(this.uri + "getHWCreport_bycases_range", {
      fromdate: fromDate,
      todate: toDate
    });
  }
  getHWCreport_byday_range(fromDate, toDate): Observable<any> {
    return this.http.post<any>(this.uri + "getHWCreport_byday_range", {
      fromdate: fromDate,
      todate: toDate
    });
  }
  getHWCreport_byspacial_range(fromDate, toDate): Observable<any> {
    return this.http.post<any>(this.uri + "getHWCreport_byspacial_range", {
      fromdate: fromDate,
      todate: toDate
    });
  }
  getHWCreport_byCat(): Observable<any> {
    return this.http.get<any>(this.uri + "getHWCreport_byCat");
  }
  getBpNhByRange(fromDate, toDate): Observable<any> {
    return this.http.post<any>(this.uri + "getBpNhByRange", {
      fromdate: fromDate,
      todate: toDate
    });
  }
  getPreviousBpNhCount(): Observable<any> {
    return this.http.get<any>(this.uri + "getPreviousBpNhCount");
  }
  getBpNhByCategory(fromDate, toDate) {
    return this.http.post<any>(this.uri + "getBpNhByCategory", {
      fromdate: fromDate,
      todate: toDate
    });
  }
  getBpNhYearly() {
    return this.http.get<any>(this.uri + "getBpNhYearly");
  }
  getBpByCategory(fromDate, toDate) {
    return this.http.post<any>(this.uri + "getBpByCategory", {
      fromdate: fromDate,
      todate: toDate
    });
  }
  getNhByCategory(fromDate, toDate) {
    return this.http.post<any>(this.uri + "getNhByCategory", {
      fromdate: fromDate,
      todate: toDate
    });
  }
  getErrorRecords() {
    return this.http.get<any>(this.uri + "getErrorRecords");
  }
  getParentRecord(pid) {
    return this.http.get<any>(this.uri + "getParentRecord/" + pid);
  }
  getDuplicateRecord(did) {
    return this.http.get<any>(this.uri + "getDuplicateRecord/" + did);
  }

  getHwcGetBlock1(): Observable<any> {
    return this.http.get<any>(this.uri + "getblock1");
  }
  getHwcCasesByHwcDate(fromDate, toDate) {
    return this.http.post<any>(this.uri + "getblock1_byhwcdate", {
      fromdate: fromDate,
      todate: toDate
    });
  }
  getHwcCasesByFDSubDate(fromDate, toDate) {
    return this.http.post<any>(this.uri + "getblock1_byfadate", {
      fromdate: fromDate,
      todate: toDate
    });
  }
  updateErrorRecord(did) {
    return this.http.get<any>(this.uri + "updateErrorRecord/" + did);
  }

  insertErrorRecord(did) {
    return this.http.get<any>(this.uri + "insertErrorRecord/" + did);
  }

  updateParentRecord(
    HWC_METAINSTANCE_ID,
    HWC_METAMODEL_VERSION,
    HWC_METAUI_VERSION,
    HWC_METASUBMISSION_DATE,
    HWC_WSID,
    HWC_FIRST_NAME,
    HWC_FULL_NAME,
    HWC_PARK_NAME,
    HWC_TALUK_NAME,
    HWC_VILLAGE_NAME,
    HWC_OLDPHONE_NUMBER,
    HWC_NEWPHONE_NUMBER,
    HWC_SURVEY_NUMBER,
    HWC_RANGE,
    HWC_LATITUDE,
    HWC_LONGITUDE,
    HWC_ALTITUDE,
    HWC_ACCURACY,
    HWC_CASE_DATE,
    HWC_CASE_CATEGORY,
    HWC_ANIMAL,
    HWC_HI_NAME,
    HWC_HI_VILLAGE,
    HWC_HI_AREA,
    HWC_HI_DETAILS,
    HWC_HD_NAME,
    HWC_HD_VILLAGE,
    HWC_HD_DETAILS,
    HWC_COMMENT,
    HWC_FD_SUB_DATE,
    HWC_FD_SUB_RANGE,
    HWC_FD_NUM_FORMS,
    HWC_FD_COMMENT,
    HWC_START,
    HWC_END,
    HWC_DEVICE_ID,
    HWC_SIMCARD_ID,
    HWC_FA_PHONE_NUMBER,
    HWC_USER_NAME,
    HWC_CASE_TYPE
  ) {
    const update_hwc = {
      HWC_METAINSTANCE_ID: HWC_METAINSTANCE_ID,
      HWC_METAMODEL_VERSION: HWC_METAMODEL_VERSION,
      HWC_METAUI_VERSION: HWC_METAUI_VERSION,
      HWC_METASUBMISSION_DATE: HWC_METASUBMISSION_DATE,
      HWC_WSID: HWC_WSID,
      HWC_FIRST_NAME: HWC_FIRST_NAME,
      HWC_FULL_NAME: HWC_FULL_NAME,
      HWC_PARK_NAME: HWC_PARK_NAME,
      HWC_TALUK_NAME: HWC_TALUK_NAME,
      HWC_VILLAGE_NAME: HWC_VILLAGE_NAME,
      HWC_OLDPHONE_NUMBER: HWC_OLDPHONE_NUMBER,
      HWC_NEWPHONE_NUMBER: HWC_NEWPHONE_NUMBER,
      HWC_SURVEY_NUMBER: HWC_SURVEY_NUMBER,
      HWC_RANGE: HWC_RANGE,
      HWC_LATITUDE: HWC_LATITUDE,
      HWC_LONGITUDE: HWC_LONGITUDE,
      HWC_ACCURACY: HWC_ACCURACY,
      HWC_CASE_DATE: HWC_CASE_DATE,
      HWC_CASE_CATEGORY: HWC_CASE_CATEGORY,
      HWC_ANIMAL: HWC_ANIMAL,
      HWC_HI_NAME: HWC_HI_NAME,
      HWC_HI_VILLAGE: HWC_HI_VILLAGE,
      HWC_HI_AREA: HWC_HI_AREA,
      HWC_HI_DETAILS: HWC_HI_DETAILS,
      HWC_HD_NAME: HWC_HD_NAME,
      HWC_HD_VILLAGE: HWC_HD_VILLAGE,
      HWC_HD_DETAILS: HWC_HD_DETAILS,
      HWC_COMMENT: HWC_COMMENT,
      HWC_FD_SUB_DATE: HWC_FD_SUB_DATE,
      HWC_FD_SUB_RANGE: HWC_FD_SUB_RANGE,
      HWC_FD_NUM_FORMS: HWC_FD_NUM_FORMS,
      HWC_FD_COMMENT: HWC_FD_COMMENT,
      HWC_START: HWC_START,
      HWC_END: HWC_END,
      HWC_DEVICE_ID: HWC_DEVICE_ID,
      HWC_SIMCARD_ID: HWC_SIMCARD_ID,
      HWC_FA_PHONE_NUMBER: HWC_FA_PHONE_NUMBER,
      HWC_USER_NAME: HWC_USER_NAME,
      HWC_CASE_TYPE: HWC_CASE_TYPE,
      HWC_ALTITUDE: HWC_ALTITUDE
    };
    return this.http.post<any>(this.uri + "updateParentRecord", update_hwc);
  }
  getBlock2TotalCasesByYearMonth(): Observable<any> {
    return this.http.get<any>(this.uri + "getblock2_totalcases_byyear_month");
  }
  getBlock2ByHwcDateFreq(fromDate, toDate) {
    return this.http.post<any>(this.uri + "getblock2_byhwcdate_freq", {
      fromdate: fromDate,
      todate: toDate
    });
  }
  getBlock2ByFaDateFreq(fromDate, toDate) {
    return this.http.post<any>(this.uri + "getblock2_byfadate_freq", {
      fromdate: fromDate,
      todate: toDate
    });
  }
  getBlock2Top20CasesBycat(): Observable<any> {
    return this.http.get<any>(this.uri + "getblock2_top20cases_bycat");
  }
  getBlock2Top50CasesByWsid(): Observable<any> {
    return this.http.get<any>(this.uri + "getblock2_top50cases_bywsid");
  }
  getBlock3TopCases(): Observable<any> {
    return this.http.get<any>(this.uri + "getblock3_topcases");
  }
  getTotalComp(): Observable<any> {
    return this.http.get<any>(this.uri + "gettotalcomp");
  }
  getCompFilter(fromDate, toDate): Observable<any> {
    return this.http.post<any>(this.uri + "getcomp_filter", {
      fromdate: fromDate,
      todate: toDate
    });
  }
  getTopComp(fromDate, toDate): Observable<any> {
    return this.http.post<any>(this.uri + "get_top_comp", {
      fromdate: fromDate,
      todate: toDate
    });
  }
}
