import { NgModule } from '@angular/core';

import { SharedModule } from '@shared';
import { RouteRoutingModule } from './routes-routing.module';
// dashboard pages
import { DashboardComponent } from './dashboard/dashboard.component';
import { NgxsComponent } from './ngxs/ngxs.component';
import { CheckboxComponent } from './checkbox/checkbox.component';
import { OverlayModule } from '@angular/cdk/overlay';
// passport pages
const COMPONENTS = [DashboardComponent];
const COMPONENTS_NOROUNT = [];

@NgModule({
  imports: [SharedModule, RouteRoutingModule, OverlayModule],
  declarations: [...COMPONENTS, ...COMPONENTS_NOROUNT, NgxsComponent, CheckboxComponent],
  entryComponents: COMPONENTS_NOROUNT,
})
export class RoutesModule {}
