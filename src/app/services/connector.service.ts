import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";

import { Data } from "../models/data.model";

import { map, catchError } from "rxjs/operators";
import { Observable, of } from "rxjs";
import { formatDate } from "@angular/common";

@Injectable()
// providedIn: 'root'
export class ConnectorService {

 // private uri = "https://wildseveproject.appspot.com/";
  private uri = "https://nodeapplication.azurewebsites.net/"


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
  // getcase_users(): Observable<any> {
  //   return this.http.get<any>(this.uri + "getcase_users");
  // }
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
  getoveralCompensation(): Observable<any> {
    return this.http.get<any>(this.uri + "getOverallCompensation");
  }
  getCompensationByCategoryProjectYear(fromDate,toDate): Observable<any> {
    return this.http.post<any>(this.uri + "getCompensation_ByCategory_ProjectYear", {
      fromdate: fromDate,
      todate: toDate
    });
  }
  getCompensationByProjectYearbyCategory(fromDate, toDate): Observable<any> {
    return this.http.post<any>(this.uri + "getCompensation_ByProjectYear_BYCategory",{
      fromdate: fromDate,
      todate: toDate
    });
  }
  getCompensationByProjectYearBYSheet(fromDate, toDate): Observable<any> {
    return this.http.post<any>(this.uri + "getCompensation_ByProjectYear_BYSheet", {
      fromdate: fromDate,
      todate: toDate
    });
  }
  getCompensationbyProjectYear(fromDate, toDate): Observable<any> {
    return this.http.post<any>(this.uri + "getCompensation_ByProjectYear", {
      fromdate: fromDate,
      todate: toDate
    });
  }

  getCompensationbyProjectYearByCatInSheet(fromDate, toDate): Observable<any> {
    return this.http.post<any>(this.uri + "getCompensation_ByProjectYear_ByCategoryInSheet", {
      fromdate: fromDate,
      todate: toDate
    });
  }


  getImages(metaid): Observable<any> {
    return this.http.get(this.uri +'getImage/' + metaid);

}

  getCompensationbyDate(fromDate, toDate): Observable<any> {
    return this.http.post<any>(this.uri + "getCompensation_ByDate", {
      fromdate: fromDate,
      todate: toDate
    });
  }
  getCompensationbyCategory(fromDate, toDate): Observable<any> {
    return this.http.post<any>(this.uri + "getCompensation_ByCategory", {
      fromdate: fromDate,
      todate: toDate
    });
  }
  getCompensationprocessedDays(fromDate, toDate): Observable<any> {
    return this.http.post<any>(this.uri + "getCompensation_ProcessedDays", {
      fromdate: fromDate,
      todate: toDate
    });
  }
  getCompensationtotalprocesseddays(fromDate, toDate): Observable<any> {
    return this.http.post<any>(this.uri + "getCompensation_TotalProcessedDays", {
      fromdate: fromDate,
      todate: toDate
    });
  }

  getCompensationTotalProcessedDaysByCategory(fromDate, toDate): Observable<any> {
    return this.http.post<any>(this.uri + "getCompensation_TotalProcessedDays_ByCategory", {
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

  getDCvsHWC(fromDate, toDate): Observable<any> {
    return this.http.post<any>(this.uri + "getdcvshwc", {
      fromdate: fromDate,
      todate: toDate
    });
  }

  getDCHWCBycat(fromDate, toDate): Observable<any> {
    return this.http.post<any>(this.uri + "getdcvshwc_category", {
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
  // getDuplicateRecord(did,fname) {
  //   return this.http.get<any>(this.uri + "getDuplicateRecord/" + did + "/" + fname);
  // }

getFlaggedRecord(did){
  return this.http.get<any>(this.uri + "getFlaggedRecord/" + did);
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
    return this.http.get<any>(this.uri + "updateErrorRecord/" + did + "/Y");
  }
  insertFlaggedRecord(did): Observable<any>{
    return this.http.get<any>(this.uri + "insertFlaggedRecord/" + did );
  }

  insertErrorRecord(did): Observable<any>{
    return this.http.get<any>(this.uri + "insertErrorRecord/" + did+"/Y");
  }

  updateFlaggedRecord(data): Observable<any>{
    const updateHwc = {
    HWC_METAINSTANCE_ID: data.HWC_METAINSTANCE_ID,
    HWC_METAMODEL_VERSION: data.HWC_METAMODEL_VERSION,
    HWC_METAUI_VERSION: data.HWC_METAUI_VERSION,
    HWC_METASUBMISSION_DATE: data.HWC_METASUBMISSION_DATE,
    HWC_WSID: data.HWC_WSID,
    HWC_FIRST_NAME: data.HWC_FIRST_NAME,
    HWC_LAST_NAME: data.HWC_LAST_NAME,
    HWC_FULL_NAME: data.HWC_FULL_NAME,
    HWC_PARK_NAME: data.HWC_PARK_NAME,
    HWC_TALUK_NAME: data.HWC_TALUK_NAME,
    HWC_VILLAGE_NAME: data.HWC_VILLAGE_NAME,
    HWC_OLDPHONE_NUMBER: data.HWC_OLDPHONE_NUMBER,
    HWC_NEWPHONE_NUMBER: data.HWC_NEWPHONE_NUMBER,
    HWC_SURVEY_NUMBER: data.HWC_SURVEY_NUMBER,
    HWC_RANGE: data.HWC_RANGE,
    HWC_LATITUDE: data.HWC_LATITUDE,
    HWC_LONGITUDE: data.HWC_LONGITUDE,
    HWC_ACCURACY: data.HWC_ACCURACY,
    HWC_CASE_DATE: data.HWC_CASE_DATE,
    HWC_CASE_CATEGORY: data.HWC_CASE_CATEGORY,
    HWC_ANIMAL: data.HWC_ANIMAL,
    HWC_HI_NAME: data.HWC_HI_NAME,
    HWC_HI_VILLAGE: data.HWC_HI_VILLAGE,
    HWC_HI_AREA: data.HWC_HI_AREA,
    HWC_HI_DETAILS: data.HWC_HI_DETAILS,
    HWC_HD_NAME: data.HWC_HD_NAME,
    HWC_HD_VILLAGE: data.HWC_HD_VILLAGE,
    HWC_HD_DETAILS: data.HWC_HD_DETAILS,
    HWC_COMMENT: data.HWC_COMMENT,
    HWC_FD_SUB_DATE: data.HWC_FD_SUB_DATE,
    HWC_FD_SUB_RANGE: data.HWC_FD_SUB_RANGE,
    HWC_FD_NUM_FORMS: data.HWC_FD_NUM_FORMS,
    HWC_FD_COMMENT: data.HWC_FD_COMMENT,
    HWC_START: data.HWC_START,
    HWC_END: data.HWC_END,
    HWC_DEVICE_ID: data.HWC_DEVICE_ID,
    HWC_SIMCARD_ID: data.HWC_SIMCARD_ID,
    HWC_FA_PHONE_NUMBER: data.HWC_FA_PHONE_NUMBER,
    HWC_USER_NAME: data.HWC_USER_NAME,
    HWC_CASE_TYPE: data.HWC_CASE_TYPE,
    HWC_ALTITUDE: data.HWC_ALTITUDE
  };
  console.log(updateHwc);
    return this.http.post<any>(this.uri + "updateFlaggedRecord", updateHwc);
  }

  updateParentRecord(
    HWC_METAINSTANCE_ID,
    HWC_METAMODEL_VERSION,
    HWC_METAUI_VERSION,
    HWC_METASUBMISSION_DATE,
    HWC_WSID,
    HWC_FIRST_NAME,
    HWC_LAST_NAME,
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
      HWC_LAST_NAME: HWC_LAST_NAME,
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
    console.log(update_hwc);
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
  getTotalCompByCat(): Observable<any> {
    return this.http.get<any>(this.uri + "gettotalcomp_bycategory");
  }

  getcompomsheet(): Observable<any> {
    return this.http.get<any>(this.uri + "getcomp_omsheet");
  }

  getcompomsheetBydate(fromDate, toDate): Observable<any> {
    return this.http.post<any>(this.uri + "getcomp_omsheet_bydate", {
      fromdate: fromDate,
      todate: toDate
    });
  }

  getcompamtomsheetdate(fromDate, toDate): Observable<any> {
    return this.http.post<any>(this.uri + "getcomp_amt_omsheetdate", {
      fromdate: fromDate,
      todate: toDate
    });
  }

  getcompamtomsheetdatebycategory(fromDate, toDate): Observable<any> {
    return this.http.post<any>(this.uri + "getcomp_amt_omsheetdate_bycategory", {
      fromdate: fromDate,
      todate: toDate
    });
  }

  getcompbyomsheet(fromDate, toDate): Observable<any> {
    return this.http.post<any>(this.uri + "getcomp_byomsheet", {
      fromdate: fromDate,
      todate: toDate
    });
  }

  getcompbyomsheetdate(fromDate, toDate): Observable<any> {
    return this.http.post<any>(this.uri + "getcomp_byomsheetdate", {
      fromdate: fromDate,
      todate: toDate
    });
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
  getCasesByYear(year): Observable<any> {
    return this.http.post<any>(this.uri+ 'getTotalCasesbyYear', {
      year: year
     });
  }
  getCatByYear(year): Observable<any> {
    return this.http.post<any>(this.uri + 'getCategorybyYear', {
      year: year
     });
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
  getCasesByRange(year):  Observable<any> {
    return this.http.post<any>(this.uri + 'getcases_byrange', {
     year: year
    });
  }
  getBpNhProjectYear(): Observable<any> {
    return this.http.get<any>(this.uri + 'getBpNh_projectyr');
  }
  getCatProjectYear(): Observable<any> {
    return this.http.get<any>(this.uri + 'getBpNh_cat_projectyr');
  }
  getCatBpNhProjectYear(fromDate,toDate): Observable<any> {
    return this.http.post<any>(this.uri + 'getBp_Nh_cat_projectyr', {
      fromdate: fromDate,
      todate: toDate
    });
  }
  // pending
  getParkByMonthYear(year): Observable<any> {
    return this.http.post<any>(this.uri + 'getpark_yearmonth', {
      year: year
     });
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
  getHWCDBByYear(fromDate, toDate): Observable<any> {
    return this.http.post<any>(this.uri + "get_HWC_DB", {
      fromdate: fromDate,
      todate: toDate
    });
  }
  getDCDBByYear(fromDate, toDate): Observable<any> {
    return this.http.post<any>(this.uri + "get_DC_DB", {
      fromdate: fromDate,
      todate: toDate
    });
  }
  getPubDBByYear(fromDate, toDate): Observable<any> {
    return this.http.post<any>(this.uri + "get_PUB_DB", {
      fromdate: fromDate,
      todate: toDate
    });
  }

  getCompDBByYear(fromDate, toDate): Observable<any> {
    return this.http.post<any>(this.uri + "get_COMP_DB", {
      fromdate: fromDate,
      todate: toDate
    });
  }

  // Publicity Map
  getMapAllPub() : Observable<any> {
    return this.http.get<any>(this.uri + "getpublicity_mapincidents");
  }
  getMapPubByDate(fromDate, toDate): Observable<any> {
    return this.http.post<any>(this.uri + "getpublicity_mapincidents_bydate", {
      fromdate: fromDate,
      todate: toDate
    });
  }

  // HWC Map
  getMapByAnimal(fromDate, toDate): Observable<any> {
    return this.http.post<any>(this.uri + "get_MAP_byanimal", {
      fromdate: fromDate,
      todate: toDate
    });
  }
  getMapByCategory(fromDate, toDate): Observable<any> {
    return this.http.post<any>(this.uri + "get_MAP_bycategory", {
      fromdate: fromDate,
      todate: toDate
    });
  }
  getMapByCatCR(fromDate, toDate): Observable<any> {
    return this.http.post<any>(this.uri + "get_MAP_bycat_CR", {
      fromdate: fromDate,
      todate: toDate
    });
  }
  getMapByCatCRPD(fromDate, toDate): Observable<any> {
    return this.http.post<any>(this.uri + "get_MAP_bycat_CRPD", {
      fromdate: fromDate,
      todate: toDate
    });
  }
  getMapByCatPD(fromDate, toDate): Observable<any> {
    return this.http.post<any>(this.uri + "get_MAP_bycat_PD", {
      fromdate: fromDate,
      todate: toDate
    });
  }
  getMapByCatLP(fromDate, toDate): Observable<any> {
    return this.http.post<any>(this.uri + "get_MAP_bycat_LP", {
      fromdate: fromDate,
      todate: toDate
    });
  }
  getMapByCatHI(fromDate, toDate): Observable<any> {
    return this.http.post<any>(this.uri + "get_MAP_bycat_HI", {
      fromdate: fromDate,
      todate: toDate
    });
  }
  getMapByCatHD(fromDate, toDate): Observable<any> {
    return this.http.post<any>(this.uri + "get_MAP_bycat_HD", {
      fromdate: fromDate,
      todate: toDate
    });
  }
  getMapByFA(fromDate, toDate): Observable<any> {
    return this.http.post<any>(this.uri + "get_MAP_byFA", {
      fromdate: fromDate,
      todate: toDate
    });
  }
  getFAbyDatebyCat(fromDate, toDate): Observable<any> {
    return this.http.post<any>(this.uri + "get_FA_ByDate_Category", {
      fromdate: fromDate,
      todate: toDate
    });
  }
  getCompbyRange(fromDate, toDate): Observable<any> {
    return this.http.post<any>(this.uri + "getcomp_byFDrange", {
      fromdate: fromDate,
      todate: toDate
    });
  }
  getTimeBtwHWCFD(fromDate, toDate): Observable<any> {
    return this.http.post<any>(this.uri + "getTimeTaken_HWCdate_FDdate", {
      fromdate: fromDate,
      todate: toDate
    });
  }
  getAvgTimeBtwHWCFD(fromDate, toDate): Observable<any> {
    return this.http.post<any>(this.uri + "getAvgTimeTaken_HWCdate_FDdate", {
      fromdate: fromDate,
      todate: toDate
    });
  }
  getCasesDCvsHWC(fromDate, toDate): Observable<any> {
    return this.http.post<any>(this.uri + "getcases_DCvsHWC", {
      fromdate: fromDate,
      todate: toDate
    });
  }
  getCasesDCvsHWCByCat(fromDate, toDate): Observable<any> {
    return this.http.post<any>(this.uri + "getFAcases_DCvsHWC", {
      fromdate: fromDate,
      todate: toDate
    });
  }
  getAvgSubByFA(fromDate, toDate): Observable<any> {
    return this.http.post<any>(this.uri + "get_AVG_SubTime_ByFA", {
      fromdate: fromDate,
      todate: toDate
    });
  }
  getFlaggedId(orgId,flagId): Observable<any> {
    return this.http.post<any>(this.uri + "getMarked", {
      orgid: orgId,
      flagid: flagId
    });
  }

  // Individual HWC record by ID
  getHWCByID(id): Observable<any> {
    return this.http.get<any>(this.uri + "gethwc/" + id);
  }

  updateCropRecord(data): Observable<any> {
    return this.http.post<any>(this.uri + "updateCropRecord", data);
}
updatePropertyRecord(data):Observable<any> {
  return this.http.post<any>(this.uri + "updatePropertyRecord", data);
}
updateLiveStockRecord(data):Observable<any> {
  return this.http.post<any>(this.uri + "updateLivestockRecord", data);
}
updateHWCRecord(data):Observable<any> {
  return this.http.post<any>(this.uri + "updateParentRecord", data);
}
getSyncData(id): Observable<any> {
  console.log(id);
  return this.http.get<any>(this.uri + 'syncdata/' + id);
}

// Individual DC record by ID
getDCByID(id,fid): Observable<any> {
  return this.http.get<any>(this.uri + "getDCParentRecord/" + id + "/" + fid);
}

updateDCParentRecord(data): Observable<any>{
  return this.http.post<any>(this.uri + "updateDCParentRecord", data);
}

updateDCCaseRecord(data): Observable<any>{
  return this.http.post<any>(this.uri + "updateDCCaseData", data);
}

// Individual Comp record by ID
getCompByID(id): Observable<any> {
  return this.http.get<any>(this.uri + "getCompParentRecord/" + id );
}

updateCompParentRecord(data): Observable<any>{
  return this.http.post<any>(this.uri + "updateCompParentRecord", data);
}

updateCompCaseData(data): Observable<any>{
  return this.http.post<any>(this.uri + "updateCompCaseData", data);
}

// get Images by HWC ID
getHWCImages(metaid,form,index){
  console.log(this.uri + "getImage/"+metaid+"/"+form+"/"+index);
  return this.http.get<any>(this.uri + "getImage/"+metaid+"/"+form+"/"+index);
}

getHWCSubImages(metaid,form,index){
  console.log(this.uri + "getFDSubImage/"+metaid+"/"+form+"/"+index);
  return this.http.get<any>(this.uri + "getFDSubImage/"+metaid+"/"+form+"/"+index);
}

getHWCRespImage(metaid,form){
  console.log(this.uri + "getRespImage/"+metaid+"/"+form);
  return this.http.get<any>(this.uri + "getRespImage/"+metaid+"/"+form);
}

getHWCRespSignImage(metaid,form){
  console.log(this.uri + "getRespSignImage/"+metaid+"/"+form);
  return this.http.get<any>(this.uri + "getRespSignImage/"+metaid+"/"+form);
}

getHWCFDAckImage(metaid,form){
  console.log(this.uri + "getFDAckImage/"+metaid+"/"+form);
  return this.http.get<any>(this.uri + "getFDAckImage/"+metaid+"/"+form);
}

// get Images by Comp ID
getCompImages(metaid,form,index){
  console.log(this.uri + "getCompImage/"+metaid+"/"+form+"/"+index);
  return this.http.get<any>(this.uri + "getCompImage/"+metaid+"/"+form+"/"+index);
}

updatePubRecord(data): Observable<any>{
  return this.http.post<any>(this.uri + "updatePublicityRecord", data);
}

getWildSeveUsers(): Observable<any>{
  return this.http.get<any>(this.uri + "getwildseve_users");
}

updateWildSeveRecord(data): Observable<any>{
  return this.http.post<any>(this.uri + "updateWildseveRecord", data);
}

getPubImage(metaid,index){
console.log(this.uri + "getPublicImage/"+metaid+"/"+index);
  return this.http.get<any>(this.uri + "getPublicImage/"+metaid+"/"+index);
}

// New APIs
getCompByWSIDAll(): Observable<any>{
  return this.http.get<any>(this.uri + "getcomp_bywsid_all");
}

getCompFilterAll(): Observable<any>{
  return this.http.get<any>(this.uri + "getcomp_filter_all");
}

getCompensationByWSIDByDate(fromDate, toDate):Observable<any>{
return this.http.post<any>(this.uri + "getCompensation_ByWSID_ByDate", {
  fromdate: fromDate,
  todate: toDate
  });
}

getTotalCompByDate(fromDate, toDate):Observable<any>{
  return this.http.post<any>(this.uri + "getCompensation_ByDate", {
    fromdate: fromDate,
    todate: toDate
    });
  }

  getCompByWSIDAllByDate(fromDate, toDate):Observable<any>{
    return this.http.post<any>(this.uri + "getcomp_bywsid_bydate", {
      fromdate: fromDate,
      todate: toDate
      });
    }


getTotalCasesByFA_DCvsHWC(): Observable<any>{
  return this.http.get<any>(this.uri + "getTotalcasesByFA_DCvsHWC");
}

getTotalCasesByFACat_DCvsHWC(): Observable<any>{
  return this.http.get<any>(this.uri + "getTotalcasesByFACategory_DCvsHWC");
}

getFAByHWCCaseFrequency(fromDate, toDate):Observable<any>{
  return this.http.post<any>(this.uri + "getFA_byHWC_cases", {
    fromdate: fromDate,
    todate: toDate
    });
  }

getHWCvsCompCases(): Observable<any>{
  return this.http.get<any>(this.uri + "getHWCvsCOMPcases");
}


getTotalAvgTimeTakenHWCDateFDDate(fromDate, toDate):Observable<any>{
  return this.http.post<any>(this.uri + "getTotalAvgTimeTaken_HWCdate_FDdate", {
    fromdate: fromDate,
    todate: toDate
    });
  }


getCatProjYearMonthByPark(fromDate, toDate): Observable<any>{
  return this.http.post<any>(this.uri + "getCat_projectyr_month_bypark", {
    fromdate: fromDate,
    todate: toDate
    });
}

getCompByOMSheetDate():Observable<any>{
  return this.http.get<any>(this.uri + "getcomp_byOM_sheetnum_date");
}

}
