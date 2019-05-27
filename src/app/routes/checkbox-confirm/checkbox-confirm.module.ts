import { NgModule } from '@angular/core';
import { CheckboxConfirmComponent } from './checkbox-confirm.component';
import { OverlayModule } from '@angular/cdk/overlay';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [CheckboxConfirmComponent],
  imports: [OverlayModule, NgZorroAntdModule, CommonModule, FormsModule],
  exports: [CheckboxConfirmComponent],
})
export class CheckboxConfirmModule {}
