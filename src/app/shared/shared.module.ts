import { NgModule } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { DialogService } from 'primeng/dynamicdialog';
import { ToolbarNavigationComponent } from './components/toolbar-navigation/toolbar-navigation.component';
import { ToolbarModule } from 'primeng/toolbar';
import { MenuNavigationComponent } from './components/menu-navigation/menu-navigation.component';
import { SpeedDialModule } from 'primeng/speeddial';

@NgModule({
  declarations: [
    ToolbarNavigationComponent,
    MenuNavigationComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    //PrimeNg
    ToolbarModule,
    CardModule,
    ButtonModule,
    SpeedDialModule
  ],
  exports:[ToolbarNavigationComponent, MenuNavigationComponent],
  providers: [DialogService, CurrencyPipe]
})
export class SharedModule { }
