import { NgModule } from '@angular/core';

import { SharedModule } from '@shared';
import { RouteRoutingModule } from './routes-routing.module';
// dashboard pages
import { DashboardComponent } from './dashboard/dashboard.component';
import { NgxsComponent } from './ngxs/ngxs.component';
import { CheckboxConfirmModule } from './checkbox-confirm/checkbox-confirm.module';

// passport pages
const COMPONENTS = [DashboardComponent];
const COMPONENTS_NOROUNT = [];

@NgModule({
  imports: [SharedModule, RouteRoutingModule, CheckboxConfirmModule],
  declarations: [...COMPONENTS, ...COMPONENTS_NOROUNT, NgxsComponent],
  entryComponents: COMPONENTS_NOROUNT,
})
export class RoutesModule {}
