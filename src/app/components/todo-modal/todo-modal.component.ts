import { Component } from '@angular/core';
import { ModalModule } from 'carbon-components-angular';

@Component({
    selector: 'app-todo-modal',
    imports: [ModalModule],
    templateUrl: './todo-modal.component.html',
    styleUrl: './todo-modal.component.scss',
})
export class TodoModalComponent {
    isModalOpen = false;

    openModal() {
        this.isModalOpen = true;
    }

    closeModal() {
        this.isModalOpen = false;
    }

    onConfirm() {
        console.log('Confirmed!');
        this.closeModal();
    }
}
