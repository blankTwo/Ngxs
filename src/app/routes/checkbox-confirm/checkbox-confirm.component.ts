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
  selector: 'checkbox-confirm',
  exportAs: 'nzCheckbox',
  preserveWhitespaces: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  templateUrl: './checkbox-confirm.component.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CheckboxConfirmComponent),
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
export class CheckboxConfirmComponent implements OnInit, ControlValueAccessor, OnChanges, AfterViewInit, OnDestroy {
  constructor(
    private elementRef: ElementRef<HTMLElement>,
    private renderer: Renderer2,
    private cdr: ChangeDetectorRef,
    private focusMonitor: FocusMonitor,
  ) {
    renderer.addClass(elementRef.nativeElement, 'ant-checkbox-wrapper');
  }

  @ViewChild('inputElement') private inputElement: ElementRef;
  @ViewChild('contentElement') private contentElement: ElementRef;

  @ViewChild(CdkOverlayOrigin) cdkOverlayOrigin: CdkOverlayOrigin;
  @ViewChild(CdkConnectedOverlay) cdkConnectedOverlay: CdkConnectedOverlay;

  @Output() readonly nzCheckedChange = new EventEmitter<boolean>();
  @Output() hlOnCancel = new EventEmitter();
  @Output() hlOnConfirm = new EventEmitter();
  @Output() OverlayClose = new EventEmitter();

  @Input() nzValue: string;
  @Input() @InputBoolean() nzAutoFocus = false;
  @Input() @InputBoolean() nzDisabled = false;
  @Input() @InputBoolean() nzIndeterminate = false;
  @Input() @InputBoolean() nzChecked = true;

  @Input() @InputBoolean() isCancelShowTootip = false;
  @Input() hlCancelTitle: string | TemplateRef<{}>;
  @Input() hlOkTitle: string | TemplateRef<{}>;
  @Input() hlCancelText = '取消';
  @Input() hlOkText = '确定';
  @Input() hlIcon: TemplateRef<{}>;
  @Input() hlWidth = 300;

  onChange: (value: any) => void = () => null;
  onTouched: () => any = () => null;
  nzOpen = false;
  ConfirmPosition: 'top' | 'center' | 'bottom' = 'bottom';
  _positions: ConnectionPositionPair[] = [...DEFAULT_TOOLTIP_POSITIONS];
  triggerWidth: number;
  _isCheck = false;

  hostClick(e: MouseEvent): void {}

  _onCancel() {
    this.hlOnCancel.emit();
    this.closeConfirm();
  }
  _onOk() {
    this._isCheck = !this._isCheck;
    this.nzChecked = this._isCheck;
    this.onChange(this.nzChecked);
    this.nzCheckedChange.emit(this.nzChecked);

    this.hlOnConfirm.emit(this.nzChecked);
    this.closeConfirm();
  }

  closeConfirm(): void {
    this.onTouched();
    this.nzOpen = false;
    this.cdr.markForCheck();
    this.OverlayClose.emit();
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
    this.ConfirmPosition = position.connectionPair.originY;
  }

  openConfirm(): void {
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
    }
  }

  clickOk() {
    this._isCheck = false;
    this.nzChecked = this._isCheck;
    this.openConfirm();
  }

  clickCancle() {
    if (!this.isCancelShowTootip) {
      this._isCheck = false;
      this.nzChecked = this._isCheck;
      this.onChange(this.nzChecked);
      this.nzCheckedChange.emit(this.nzChecked);
    } else {
      this.openConfirm();
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
}
