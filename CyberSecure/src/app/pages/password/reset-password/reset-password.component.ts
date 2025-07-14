import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TokenService } from '../../../services/services/token.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.css'
})
export class ResetPasswordComponent  {
  resetForm: FormGroup;
  message: string = '';
  error: string = '';
  token: string = '';

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private resetService: TokenService,
    private router: Router
  ) {
    this.token = this.route.snapshot.queryParamMap.get('token') || '';
    this.resetForm = this.fb.group({
      newPassword: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmit(): void {
    if (this.resetForm.valid) {
      const newPassword = this.resetForm.value.newPassword;
      this.resetService.resetPassword(this.token, newPassword).subscribe({
        next: () => {
          this.message = 'Mot de passe réinitialisé avec succès.';
          setTimeout(() => {
            this.router.navigate(['/login']);
          }, 2000);
        },
        error: () => {
          this.error = 'Erreur lors de la réinitialisation du mot de passe.';
        }
      });
    }
  }
}
