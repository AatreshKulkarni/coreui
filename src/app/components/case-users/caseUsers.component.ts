import { Component, OnInit, ViewChild } from '@angular/core';

import { MatTableDataSource, MatPaginator } from '@angular/material';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';

import { ConnectorService } from '../../services/connector.service';
import { ExcelService } from '../../services/excel.service';

@Component({
  selector: 'app-caseUsers',
  templateUrl: './caseUsers.component.html',
  styleUrls: ['./caseUsers.component.scss'],
  providers: [ConnectorService]
})
export class CaseUsersComponent implements OnInit {

  record: any;
  dataSource: any;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  totalPost = 10;
  postPerPage = 10;
  pageSizeOptions = [5, 10, 20, 50, 100];
  constructor(private wildService: ConnectorService, private excelService: ExcelService, private spinnerService: Ng4LoadingSpinnerService) { }



  displayedCol = [
    "HWC_WSID",
    "HWC_FIRST_NAME",
    "HWC_LAST_NAME",
    "HWC_FULL_NAME",
    "HWC_FAMILY_NAME",
    "HWC_PARENTS_NAME",
    "HWC_PARK_NAME",
    "HWC_TALUK_NAME",
    "HWC_VILLAGE_NAME",
    "HWC_OLDPHONE_NUMBER",
    "HWC_NEWPHONE_NUMBER",
    "HWC_SURVEY_NUMBER",
        ]
  ngOnInit() {
    this.spinnerService.show();
    this.record = this.wildService.getcase_users();
    this.record.subscribe(res => {
      if (!res) {
        this.spinnerService.hide();
        return;
      }
      this.dataSource = new MatTableDataSource(res.response);
      this.dataSource.paginator = this.paginator;
      this.spinnerService.hide();
    });
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  xlsxReport() {
    this.excelService.exportAsExcelFile(this.dataSource.data,  "Wild Seve Users Database");
    return 'success';
  }

}
