import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface SelectorOption {
  label: string;
  value: string;
}

@Component({
  selector: 'app-selector',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="relative z-[230] w-full">
      <button type="button" (click)="toggleDropdown($event)" (keydown)="onTriggerKeydown($event)" [attr.aria-expanded]="isOpen" aria-haspopup="listbox" [ngClass]="{'border-primary-400': isOpen, 'shadow-lg': isOpen, 'shadow-primary-400/20': isOpen}" class="w-full h-14 px-5 bg-gradient-to-r from-dark-800 to-dark-900 border border-primary-400/40 rounded-xl text-cream font-bold uppercase tracking-widest text-sm flex items-center justify-between hover:border-primary-400/70 transition-all duration-300 hover:shadow-lg hover:shadow-primary-400/10 focus:outline-none focus:border-primary-400 focus:shadow-lg focus:shadow-primary-400/20">
        <span [ngClass]="{'text-cream/60': !selectedLabel}">{{ selectedLabel || placeholder }}</span>
        <svg class="w-5 h-5 text-primary-400 transition-transform duration-300" [class.rotate-180]="isOpen" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
        </svg>
      </button>

      <div *ngIf="isOpen" role="listbox" [attr.aria-label]="placeholder" class="absolute top-full left-0 right-0 mt-2 bg-dark-800 border border-primary-400/40 rounded-xl shadow-2xl shadow-dark-900/50 z-[240] overflow-hidden animate-slideInDown" (click)="$event.stopPropagation()">
        <div class="max-h-64 overflow-y-auto no-scrollbar">
          <button *ngFor="let option of options; let i = index" type="button" role="option" [attr.aria-selected]="option.value === selectedValue" (click)="selectOption(option)" (keydown)="onOptionKeydown($event, option)" [ngClass]="{'bg-primary-400/25': option.value === selectedValue, 'text-primary-400': option.value === selectedValue}" [style.animation-delay]="(i * 50) + 'ms'" class="w-full px-5 py-3.5 text-left text-cream font-bold uppercase tracking-widest text-sm hover:bg-primary-400/15 transition-all duration-200 flex items-center justify-between group">
            <span>{{ option.label }}</span>
            <svg *ngIf="option.value === selectedValue" class="w-5 h-5 text-primary-400 group-hover:scale-110 transition-transform duration-200" fill="currentColor" viewBox="0 0 24 24">
              <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"></path>
            </svg>
          </button>
        </div>
      </div>
    </div>
  `,
})
export class SelectorComponent {
  @Input() options: SelectorOption[] = [];
  @Input() placeholder: string = 'Select an option...';
  @Input() selectedValue: string = '';
  @Output() selectionChange = new EventEmitter<string>();

  isOpen = false;
  private clickListener: ((event: MouseEvent) => void) | null = null;

  constructor(private cdr: ChangeDetectorRef) {}

  get selectedLabel(): string {
    return this.options.find(opt => opt.value === this.selectedValue)?.label || '';
  }

  toggleDropdown(event?: Event): void {
    event?.stopPropagation();
    this.isOpen = !this.isOpen;
    this.isOpen ? this.addOutsideListener() : this.removeOutsideListener();
  }

  onTriggerKeydown(event: KeyboardEvent): void {
    if (event.key === 'ArrowDown' || event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      this.isOpen = true;
      this.addOutsideListener();
    } else if (event.key === 'Escape') {
      this.closeDropdown();
    }
  }

  onOptionKeydown(event: KeyboardEvent, option: SelectorOption): void {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      this.selectOption(option);
    } else if (event.key === 'Escape') {
      event.preventDefault();
      this.closeDropdown();
    }
  }

  closeDropdown(): void {
    this.isOpen = false;
    this.removeOutsideListener();
    this.cdr.markForCheck();
  }

  selectOption(option: SelectorOption): void {
    this.selectedValue = option.value;
    this.selectionChange.emit(option.value);
    this.isOpen = false;
    this.removeOutsideListener();
  }

  /** Only listen for outside clicks while the dropdown is open. */
  private addOutsideListener(): void {
    if (this.clickListener) return;
    this.clickListener = (event: MouseEvent) => {
      const target = event.target;
      if (target instanceof Element && !target.closest('app-selector')) {
        this.closeDropdown();
      }
    };
    document.addEventListener('click', this.clickListener);
  }

  private removeOutsideListener(): void {
    if (this.clickListener) {
      document.removeEventListener('click', this.clickListener);
      this.clickListener = null;
    }
  }
}
