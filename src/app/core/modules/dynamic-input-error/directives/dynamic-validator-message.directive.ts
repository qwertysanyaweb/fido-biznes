import {
  ComponentFactoryResolver,
  ComponentRef,
  Directive,
  ElementRef,
  HostBinding,
  OnDestroy,
  OnInit,
  Self,
  ViewContainerRef,
} from '@angular/core';
import {fromEvent, merge, Subscription} from 'rxjs';
import {NgControl, NgModel} from '@angular/forms';
import {skip, startWith} from 'rxjs/operators';
import {DynamicInputErrorComponent} from '../dynamic-input-error.component';


@Directive({
  selector: '[appDynamicValidatorMessage]',
  standalone: true
})
export class DynamicValidatorMessageDirective implements OnInit, OnDestroy {

  @HostBinding('class.formGroup-error-input') invalid: boolean = false;

  private errorMessagesTrigger!: Subscription;
  private componentRef: ComponentRef<DynamicInputErrorComponent> | null = null;


  constructor(
    @Self() private readonly ngControl: NgControl,
    private readonly viewContainerRef: ViewContainerRef,
    private readonly componentFactoryResolver: ComponentFactoryResolver,
    private readonly elementRef: ElementRef,
  ) {
  }

  ngOnInit() {
    if (!this.ngControl.control) throw Error('Не указан control');
    this.errorMessagesTrigger = merge(
      this.ngControl.control?.statusChanges,
      fromEvent(this.elementRef.nativeElement, 'blur'),
    ).pipe(
      startWith(this.ngControl.control?.status),
      skip(this.ngControl instanceof NgModel ? 1 : 0),
    ).subscribe(() => {
      if (this.ngControl.errors && this.ngControl.control?.touched) {
        if (!this.componentRef) {
          const componentFactory = this.componentFactoryResolver.resolveComponentFactory(DynamicInputErrorComponent);
          this.componentRef = this.viewContainerRef.createComponent(componentFactory);
          this.invalid = true;
          this.componentRef.changeDetectorRef.markForCheck();
        }
        this.componentRef.instance.errors = this.ngControl.errors;
      } else {
        this.invalid = false;
        this.componentRef?.destroy();
        this.componentRef = null;
      }
    });
  }

  ngOnDestroy() {
    this.errorMessagesTrigger.unsubscribe();
  }

}
