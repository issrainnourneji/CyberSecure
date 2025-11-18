import { Component, ElementRef, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { TokenService } from '../../services/services/token.service';
import { Router } from '@angular/router';
import { CertificationService } from '../../services/services/certificat/certification.service';
declare var bootstrap: any;

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent implements OnInit, OnDestroy {
  constructor(private readonly apiService: TokenService, private router: Router,private elementRef: ElementRef,
    private certificationService : CertificationService
  ) { }

  isAdmin: boolean = false;
  isClient: boolean = false;
  isAuthenticated: boolean = false;
  userInfo: any = null;
  error: any = null;
  isEditing: boolean = false;
  editForm: any = {};
 hasCertification: boolean = false;
  private authStatusSub: Subscription | null = null;



  ngOnInit(): void {

    this.isAuthenticated = this.apiService.isAuthenticated();
    this.isAdmin = this.apiService.isAdmin();
    this.isClient = this.apiService.isClient();


    this.authStatusSub = this.apiService.authStatuschanged.subscribe(() => {
      this.isAuthenticated = this.apiService.isAuthenticated();
      this.isAdmin = this.apiService.isAdmin();
      this.isClient = this.apiService.isClient();

    })
         this.fetchUserInfo();
    this.checkUserCertification();
  }

  fetchUserInfo(): void {
    this.apiService.getLoggedInUserInfo().subscribe({
      next: (response) => {
        this.userInfo = response.user;
        this.editForm = { ...this.userInfo };
      },
      error: (error) => {
        console.log(error);
        this.error = error?.error?.message || 'Unable to fetch user information';
      }
    });
  }

  checkUserCertification(): void {
    this.certificationService.getMyCertifications().subscribe({
      next: (certifs) => {
        this.hasCertification = certifs && certifs.length > 0;
      },
      error: (err) => {
        console.error("Erreur récupération certifications :", err);
      }
    });
  }


  editProfile(): void {
    this.isEditing = true;
  }

  cancelEdit(): void {
    this.isEditing = false;
    this.editForm = { ...this.userInfo };
  }

  updateProfile(): void {
    this.apiService.UpdateUser(this.editForm).subscribe({
      next: (response) => {
        this.isEditing = false;
        this.fetchUserInfo(); // Recharger les informations utilisateur

        // Afficher la modal
        const modalElement = document.getElementById('successModal');
        if (modalElement) {
          const modal = new bootstrap.Modal(modalElement);
          modal.show();
        }
      },
      error: (error) => {
        console.error(error);
        this.error = error?.error?.message || 'Unable to update profile';
      },
    });
  }


  confirmLogout() {
  this.apiService.logout();
  this.router.navigate(['home']);
  this.apiService.authStatuschanged.emit();
    window.location.reload();
}


  ngOnDestroy(): void {
    if (this.authStatusSub) {
      this.authStatusSub.unsubscribe();
    }
  }
}
