import { Component, OnInit } from '@angular/core';
import { CertificationService } from '../../../services/services/certificat/certification.service';
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-certification',
  templateUrl: './certification.component.html',
  styleUrl: './certification.component.css'
})
export class CertificationComponent implements OnInit {
  certification: any;

  constructor(
    private route: ActivatedRoute,
    private certificationService: CertificationService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.params['id'];
    this.certificationService.getCertificationById(id).subscribe(
      data => this.certification = data,
      err => console.error(err)
    );
  }
async downloadCertification() {
  const element = document.getElementById('certification-content');
  if (!element) return;

  const html2pdf = (await import('html2pdf.js')).default;

  const options = {
    margin: 0.5,
    filename: 'certification.pdf',
    image: { type: 'jpeg' as const, quality: 0.98 },
    html2canvas: { scale: 2 },
    jsPDF: { unit: 'in', format: 'letter', orientation: 'landscape' as const } 
  };

  html2pdf().set(options).from(element).save();
}


}
