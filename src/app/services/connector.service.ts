import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";

import { Data } from "../models/data.model";

import { map, catchError } from "rxjs/operators";
import { Observable, of } from "rxjs";
import { formatDate } from "@angular/common";

@Injectable()
// providedIn: 'root'
export class ConnectorService {
  // private uri = 'https://nodecleaner.azurewebsites.net/';
  // private uri = 'https://wildseve-node.appspot.com/';
  private uri = "https://wildseveproject.appspot.com/";
//  private uri = "https://odk-server-project.appspot.com/";

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
    return this.http.get<any>(this.uri + "getblock1")
    .pipe(
      catchError(this.handleError('getHwcGetBlock1', []))
    );
  }
  private handleError<T> (operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      // TODO: send the error to remote logging infrastructure
      console.log(error); // log to console instead

      // TODO: better job of transforming error for user consumption
    //  this.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

  getHwcCasesByHwcDate(fromDate, toDate): Observable<any>{
    return this.http.post<any>(this.uri + "getblock1_byhwcdate", {
      fromdate: fromDate,
      todate: toDate
    });
  }
  getHwcCasesByFDSubDate(fromDate, toDate): Observable<any>{
    return this.http.post<any>(this.uri + "getblock1_byfadate", {
      fromdate: fromDate,
      todate: toDate
    });
  }
  updateErrorRecord(did): Observable<any>{
    return this.http.get<any>(this.uri + "updateErrorRecord/" + did);
  }

  insertErrorRecord(did): Observable<any>{
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
  ): Observable<any>{
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
  getBlock2ByHwcDateFreq(fromDate, toDate): Observable<any>{
    return this.http.post<any>(this.uri + "getblock2_byhwcdate_freq", {
      fromdate: fromDate,
      todate: toDate
    });
  }
  getBlock2ByFaDateFreq(fromDate, toDate): Observable<any>{
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

  getwsidincidentsbycat(): Observable<any> {
    return this.http.get<any>(this.uri + "get_wsidincidents_bycat");
  }
  getvillageincidentsbycat(): Observable<any> {
    return this.http.get<any>(this.uri + "get_villageincidents_bycat");
  }

  getrangeincidentsbycat(): Observable<any> {
    return this.http.get<any>(this.uri + "get_rangeincidents_bycat");
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
  getpublicityvillagefreqbydate(fromDate, toDate): Observable<any> {
    return this.http.post<any>(this.uri + "getpublicity_village_freq_bydate", {
      fromdate: fromDate,
      todate: toDate
    });
  }
   getpublicityvillagefabydate(fromDate, toDate): Observable<any> {
    return this.http.post<any>(this.uri + "getpublicity_village_FA_bydate", {
      fromdate: fromDate,
      todate: toDate
    });
  }
  getTotalDC(): Observable<any> {
    return this.http.get<any>(this.uri + 'gettotaldc');
  }
  getTotalDCByDate(fromDate, toDate): Observable<any> {
    return this.http.post<any>(this.uri + 'getdc_total_hwc_bydate', {
      fromdate: fromDate,
      todate: toDate
    })
  }
  getPublicityTotal(): Observable<any> {
    return this.http.get<any>(this.uri + 'getpublicity_total');
  }
  getPublicityAll(): Observable<any> {
    return this.http.get<any>(this.uri + 'getpublicity_all');
  }
  getPublicityByDate(fromDate, toDate): Observable<any> {
    return this.http.post<any>(this.uri + 'getpublicity_bydate', {
      fromdate: fromDate,
      todate: toDate
    })
  }
  getSyncData(): Observable<any> {
    return this.http.get<any>(this.uri + 'syncdata');
  }
  getCasesByYear(): Observable<any> {
    return this.http.get<any>(this.uri+ 'getTotalCasesbyYear');
  }
  getCatByYear(): Observable<any> {
    return this.http.get<any>(this.uri + 'getCategorybyYear');
  }
  getTotalCasesByProject(): Observable<any> {
    return this.http.get<any>(this.uri + 'getpark_byProject');
  }
  getTopVillages(): Observable<any> {
    return this.http.get<any>(this.uri + 'gettopvillages');
  }
  getincidentsall(): Observable<any> {
    return this.http.get<any>(this.uri + 'get_incidents_all');
  }

  getpublicityvillagefreq(): Observable<any> {
    return this.http.get<any>(this.uri + 'getpublicity_village_freq');
  }

  getpublicityvillagefa():Observable<any> {
    return this.http.get<any>(this.uri + 'getpublicity_village_FA');
  }


  getincidentsallvillage(): Observable<any> {
    return this.http.get<any>(this.uri + 'get_incidents_all');
  }
  getincidentsallrange(): Observable<any> {
    return this.http.get<any>(this.uri + 'get_incidents_all');
  }
  getblock2totalcasesbyprojectyear(): Observable<any>{
    return this.http.get<any>(this.uri + 'getblock2_totalcases_byprojectyear')
  }
  getParkYearwise(): Observable<any> {
    return this.http.get<any>(this.uri + 'getpark_yearwise');
  }
  getTopVillagesByCat(): Observable<any> {
    return this.http.get<any>(this.uri + 'gettopvillages_bycategory');
  }
  getParkCatByProject(): Observable<any> {
    return this.http.get<any>(this.uri + 'getparkcategory_byProject');
  }
  getVillageIncidentsByCat(): Observable<any> {
    return this.http.get<any>(this.uri + 'get_villageincidents_bycat');
  }
  getparkCatYearwise(): Observable<any> {
    return this.http.get<any>(this.uri + 'getparkcategory_yearwise');
  }
  getCasesByRange():  Observable<any> {
    return this.http.get<any>(this.uri + 'getcases_byrange');
  }
  getBpNhProjectYear(): Observable<any> {
    return this.http.get<any>(this.uri + 'getBpNh_projectyr');
  }
  getCatProjectYear(): Observable<any> {
    return this.http.get<any>(this.uri + 'getBpNh_cat_projectyr');
  }
  getCatBpNhProjectYear(): Observable<any> {
    return this.http.get<any>(this.uri + 'getBp_Nh_cat_projectyr');
  }
  // pending
  getParkByMonthYear(): Observable<any> {
    return this.http.get<any>(this.uri + 'getpark_yearmonth');
  }
  getBpNhByDateAll(fromDate, toDate): Observable<any> {
    return this.http.post<any>(this.uri + "getBpNhByDate_all", {
      fromdate: fromDate,
      todate: toDate
    });
  }
  getPrevDayBpNh(): Observable<any> {
    return this.http.get<any>(this.uri + 'getBpNh_prevday_all');
  }
}
