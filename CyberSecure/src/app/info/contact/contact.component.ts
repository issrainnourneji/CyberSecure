import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ContactService } from '../../services/services/contact/contact.service';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.css'
})
export class ContactComponent {
 contactForm: FormGroup;
  successMessage = '';
  errorMessage = '';

  constructor(private fb: FormBuilder, private contactService: ContactService) {
    this.contactForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      subject: ['', Validators.required],
      message: ['', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.contactForm.valid) {
      this.contactService.sendMessage(this.contactForm.value).subscribe({
        next: (response) => {
          this.successMessage = response;
          this.errorMessage = '';
          this.contactForm.reset();
        },
        error: (err) => {
          this.errorMessage = 'Erreur lors de l’envoi du message';
          this.successMessage = '';
        }
      });
    }
  }
}
