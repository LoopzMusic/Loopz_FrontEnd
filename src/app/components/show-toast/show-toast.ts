import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './show-toast.html',
  styleUrl: './show-toast.scss'
})
export class ShowToast {
  @Input() show: boolean = false;
  @Input() message: string = '';
  @Input() type: 'success' | 'error' = 'success';
  @Output() closed = new EventEmitter<void>();

  getIconClass(): string {
    return this.type === 'success' ? 'bi bi-check-circle-fill' : 'bi bi-exclamation-circle-fill';
  }

  onClose(): void {
    this.closed.emit();
  }
}