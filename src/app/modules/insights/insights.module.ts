import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { InsightHomeComponent } from './insight-home/insight-home.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { RouterModule } from '@angular/router';
import { INSIGHTS_ROUTES } from './insights.routing';
import { InsightInfosComponent } from './components/insight-infos/insight-infos.component';
import { HttpClientModule } from '@angular/common/http';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { CardModule } from 'primeng/card';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DropdownModule } from 'primeng/dropdown';
import { DynamicDialogModule } from 'primeng/dynamicdialog';
import { InputMaskModule } from 'primeng/inputmask';
import { InputSwitchModule } from 'primeng/inputswitch';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { TableModule } from 'primeng/table';
import { TooltipModule } from 'primeng/tooltip';
import { ChartModule } from 'primeng/chart'
import { FormsModule } from '@angular/forms';




@NgModule({
  declarations: [
    InsightHomeComponent,
    InsightInfosComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(INSIGHTS_ROUTES),
    SharedModule,
    HttpClientModule,
    // PrimeNg
    ChartModule,
    CardModule,
    ButtonModule,
    TableModule,
    InputMaskModule,
    InputSwitchModule,
    InputTextModule,
    InputTextareaModule,
    DynamicDialogModule,
    DropdownModule,
    FormsModule,
    ConfirmDialogModule,
    TooltipModule,
    CalendarModule,
],
providers: [DatePipe]
})
export class InsightsModule { }
