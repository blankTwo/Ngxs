import { FocusMonitor } from '@angular/cdk/a11y';
import {
  CdkConnectedOverlay,
  CdkOverlayOrigin,
  ConnectedOverlayPositionChange,
  ConnectionPositionPair,
} from '@angular/cdk/overlay';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  forwardRef,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  Renderer2,
  SimpleChanges,
  TemplateRef,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { DEFAULT_TOOLTIP_POSITIONS, InputBoolean, isEmpty } from 'ng-zorro-antd/core';

@Component({
  selector: 'app-checkbox',
  exportAs: 'nzCheckbox',
  preserveWhitespaces: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  templateUrl: './checkbox.component.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CheckboxComponent),
      multi: true,
    },
  ],
  host: {
    '(click)': 'hostClick($event)',
  },
  styles: [
    `
      .ant-checkbox-checked::after {
        animation: none;
        border: 0;
      }
      .ant-checkbox-inner {
        disable: inline-block;
      }
    `,
  ],
})
export class CheckboxComponent implements OnInit, ControlValueAccessor, OnChanges, AfterViewInit, OnDestroy {
  constructor(
    private elementRef: ElementRef<HTMLElement>,
    private renderer: Renderer2,
    private cdr: ChangeDetectorRef,
    private focusMonitor: FocusMonitor,
  ) {
    renderer.addClass(elementRef.nativeElement, 'ant-checkbox-wrapper');
  }
  // tslint:disable-next-line:member-ordering
  @ViewChild('inputElement') private inputElement: ElementRef;

  // tslint:disable-next-line:member-ordering
  @ViewChild('contentElement') private contentElement: ElementRef;

  // tslint:disable-next-line:member-ordering
  @Output() readonly nzCheckedChange = new EventEmitter<boolean>();

  // tslint:disable-next-line:member-ordering
  @Input() nzValue: string;

  // tslint:disable-next-line:member-ordering
  @Input() @InputBoolean() nzAutoFocus = false;
  // tslint:disable-next-line:member-ordering
  @Input() @InputBoolean() nzDisabled = false;
  // tslint:disable-next-line:member-ordering
  @Input() @InputBoolean() nzIndeterminate = false;
  // tslint:disable-next-line:member-ordering
  @Input() @InputBoolean() nzChecked = true;

  onChange: (value: any) => void = () => null;
  // tslint:disable-next-line:no-any
  onTouched: () => any = () => null;

  @ViewChild(CdkOverlayOrigin) cdkOverlayOrigin: CdkOverlayOrigin;
  // tslint:disable-next-line:member-ordering
  @ViewChild(CdkConnectedOverlay) cdkConnectedOverlay: CdkConnectedOverlay;

  nzOpen = false;
  dropDownPosition: 'top' | 'center' | 'bottom' = 'bottom';

  _positions: ConnectionPositionPair[] = [...DEFAULT_TOOLTIP_POSITIONS];

  triggerWidth: number;
  //#region

  _isCheck = false;
  /* 取消时是否提示 */
  @Input() @InputBoolean() isCancelShowTootip = false;

  @Input() hlCancelTitle: string | TemplateRef<{}>;
  @Input() hlOkTitle: string | TemplateRef<{}>;
  @Input() hlCancelText = '取消';
  @Input() hlOkText = '确定';

  hostClick(e: MouseEvent): void {}

  @Output() hlOnCancel = new EventEmitter();
  @Output() hlOnConfirm = new EventEmitter();
  @Input() hlIcon: TemplateRef<{}>;
  @Input() hlWidth = 300;

  /* 取消 */
  _onCancel() {
    this.hlOnCancel.emit();
    this.closeDropDown();
  }

  /* 确定 */
  _onOk() {
    this._isCheck = !this._isCheck;
    this.nzChecked = this._isCheck;
    this.onChange(this.nzChecked);
    this.nzCheckedChange.emit(this.nzChecked);

    this.hlOnConfirm.emit(this.nzChecked);
    this.closeDropDown();
  }

  closeDropDown(): void {
    this.onTouched();
    this.nzOpen = false;

    this.cdr.markForCheck();
  }

  isCTootipTemplateRef() {
    return this.hlCancelTitle instanceof TemplateRef;
  }
  isOTootipTemplateRef() {
    return this.hlOkTitle instanceof TemplateRef;
  }
  isIconTemplateRef() {
    return this.hlIcon instanceof TemplateRef;
  }

  onPositionChange(position: ConnectedOverlayPositionChange): void {
    this.dropDownPosition = position.connectionPair.originY;
  }

  openDropdown(): void {
    if (!this.nzDisabled) {
      this.nzOpen = true;
      this.updateCdkConnectedOverlayStatus();
      this.updatePosition();
    }
  }

  updateCdkConnectedOverlayStatus(): void {
    this.triggerWidth = this.cdkOverlayOrigin.elementRef.nativeElement.getBoundingClientRect().width;
  }

  updatePosition(): void {
    setTimeout(() => {
      if (this.cdkConnectedOverlay && this.cdkConnectedOverlay.overlayRef) {
        this.cdkConnectedOverlay.overlayRef.updatePosition();
      }
    });
  }

  innerCheckedChange(checked: boolean): void {
    if (!this.nzDisabled) {
      if (!this._isCheck) {
        this.clickOk();
      } else {
        this.clickCancle();
      }

      // this.nzChecked = checked;
      // this.onChange(this.nzChecked);
      // this.nzCheckedChange.emit(this.nzChecked);

      // this._onOk(checked);
    }
  }

  /* 点击勾上时 */
  clickOk() {
    this._isCheck = false;
    this.nzChecked = this._isCheck;
    this.openDropdown();
  }
  /* 点击取消时 */
  clickCancle() {
    if (!this.isCancelShowTootip) {
      this._isCheck = false;
      this.nzChecked = this._isCheck;
      this.onChange(this.nzChecked);
      this.nzCheckedChange.emit(this.nzChecked);
    } else {
      this.openDropdown();
    }
  }

  updateAutoFocus(): void {
    setTimeout(() => {
      if (this.inputElement && this.nzAutoFocus) {
        this.renderer.setAttribute(this.inputElement.nativeElement, 'autofocus', 'autofocus');
      } else {
        this.renderer.removeAttribute(this.inputElement.nativeElement, 'autofocus');
      }
    }, 500);
  }

  writeValue(value: boolean): void {
    this._isCheck = value;
    this.nzChecked = value;
    this.cdr.markForCheck();
  }

  registerOnChange(fn: (_: boolean) => {}): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => {}): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.nzDisabled = isDisabled;
    this.cdr.markForCheck();
  }

  focus(): void {
    this.focusMonitor.focusVia(this.inputElement, 'keyboard');
  }

  blur(): void {
    this.inputElement.nativeElement.blur();
  }

  checkContent(): void {
    if (isEmpty(this.contentElement.nativeElement)) {
      this.renderer.setStyle(this.contentElement.nativeElement, 'display', 'none');
    } else {
      this.renderer.removeStyle(this.contentElement.nativeElement, 'display');
    }
  }

  ngOnInit(): void {
    this.focusMonitor.monitor(this.elementRef, true).subscribe(focusOrigin => {
      if (!focusOrigin) {
        Promise.resolve().then(() => this.onTouched());
      }
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.nzAutoFocus) {
      this.updateAutoFocus();
    }
  }

  ngAfterViewInit(): void {
    this.updateAutoFocus();
    this.checkContent();
  }

  ngOnDestroy(): void {
    this.focusMonitor.stopMonitoring(this.elementRef);
  }
  //#endregion
}
