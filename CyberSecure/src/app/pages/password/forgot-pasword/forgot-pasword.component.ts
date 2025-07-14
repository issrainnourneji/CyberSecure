import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TokenService } from '../../../services/services/token.service';

@Component({
  selector: 'app-forgot-pasword',
  templateUrl: './forgot-pasword.component.html',
  styleUrl: './forgot-pasword.component.css'
})
export class ForgotPaswordComponent {
 resetForm: FormGroup;
  message: string = '';
  error: string = '';

  constructor(private fb: FormBuilder, private resetService: TokenService) {
    this.resetForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  onSubmit(): void {
    if (this.resetForm.valid) {
      this.resetService.requestPasswordReset(this.resetForm.value.email)
        .subscribe({
          next: (res) => this.message = 'Un lien de réinitialisation a été envoyé à votre adresse e-mail.',
          error: (err) => this.error = 'Erreur lors de l\'envoi de l\'e-mail. Veuillez réessayer.'
        });
    }
  }
}

