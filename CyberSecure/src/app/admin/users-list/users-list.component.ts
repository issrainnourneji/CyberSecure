import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { TokenService } from '../../services/services/token.service';
import { Router } from '@angular/router';
import { NotificationService } from '../../design/notification/notification.service';
import { ModalDeleteConfirmationComponent } from '../../design/modal/modal-delete-confirmation.component';

@Component({
  selector: 'app-users-list',
  templateUrl: './users-list.component.html',
  styleUrl: './users-list.component.css'
})
export class UsersListComponent implements OnInit{
  constructor(private readonly apiService: TokenService, private notifService : NotificationService) { }
  users: any[] = [];
  error:any = null;
  idUserToDelete : number = 0
  @ViewChild(ModalDeleteConfirmationComponent) modalDelete? : ModalDeleteConfirmationComponent ;
  params : any = {title : "Delete User", content : "voulez vous vraiment supprimer le user!"}



  ngOnInit(): void {
        this.loadUsers();
  }

  loadUsers(): void {
    this.apiService.getAllUsers().subscribe({
      next: (response) => {
        this.users = response.userList || [];
      },
      error: (err) =>{
        this.error = err?.error?.message || 'unable to get users'
      }
    });
  }

   delete(): void {

      this.apiService.deleteUser(this.idUserToDelete).subscribe({
        next: () => {
          this.modalDelete?.close();
          this.notifService.success('User deleted successfully.')
          this.loadUsers();
        },
        error: (err) => {
          console.error(err);
          this.error = err?.error?.message || 'Unable to delete user';
          this.modalDelete?.close();
          this.notifService.warn('Unable to delete user! Please delete the related documents first before deleting this user.')

        }
      });

  }
  confirmDelete(id : any) {
    this.idUserToDelete = id ;
    this.modalDelete?.open();
      }

}
