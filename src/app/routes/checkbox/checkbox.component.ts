import { FocusMonitor } from '@angular/cdk/a11y';
import {
  forwardRef,
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  Renderer2,
  SimpleChanges,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

import { isEmpty, InputBoolean } from 'ng-zorro-antd/core';
import { CdkOverlayOrigin, ConnectedOverlayPositionChange, CdkConnectedOverlay } from '@angular/cdk/overlay';
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

  triggerWidth: number;
  //#region

  hostClick(e: MouseEvent): void {
    // console.log('xx', this.nzChecked);
    // e.preventDefault();
    // this.focus();
    //this.innerCheckedChange(!this.nzChecked);
  }

  closeDropDown(): void {
    this.onTouched();
    this.nzOpen = false;

    this.cdr.markForCheck();
  }

  onPositionChange(position: ConnectedOverlayPositionChange): void {
    debugger;
    this.dropDownPosition = position.connectionPair.originY;
  }

  openDropdown(): void {
    debugger;
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
    if (this.cdkConnectedOverlay && this.cdkConnectedOverlay.overlayRef) {
      this.cdkConnectedOverlay.overlayRef.updatePosition();
    }
  }

  innerCheckedChange(checked: boolean): void {
    if (!this.nzDisabled) {
      this.nzChecked = checked;
      this.onChange(this.nzChecked);
      this.nzCheckedChange.emit(this.nzChecked);
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
