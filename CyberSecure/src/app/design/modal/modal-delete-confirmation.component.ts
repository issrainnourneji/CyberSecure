import { Component, EventEmitter, Input, Output } from '@angular/core'
@Component({
  selector: 'modal-delete-confirmation',
  templateUrl: './modal-delete-confirmation.component.html',
  styleUrl: './modal-delete-confirmation.component.css',
})

export class ModalDeleteConfirmationComponent {
  public hideModal: boolean = true
  @Input() modalParams?: any
  @Output() onSubmitModal = new EventEmitter()

  public open(): void {
    this.hideModal = false
  }

  public close(): void {
    this.hideModal = true
  }

  public submit(): void {
    this.onSubmitModal.emit(true)
  }
}
