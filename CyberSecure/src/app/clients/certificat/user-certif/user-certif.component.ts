import { Component, OnInit } from '@angular/core';
import { CertificationService } from '../../../services/services/certificat/certification.service';

@Component({
  selector: 'app-user-certif',
  templateUrl: './user-certif.component.html',
  styleUrl: './user-certif.component.css'
})
export class UserCertifComponent implements OnInit {
 certifications: any[] = [];

  constructor(private certificationService: CertificationService) {}

// user-certif.component.ts
ngOnInit(): void {
  this.certificationService.getMyCertifications()
    .subscribe({
      next: res => this.certifications = res,
      error: err => console.error('Erreur récupération certifications', err)
    });
}


}
