import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TokenService } from '../../services/services/token.service';
import { firstValueFrom } from 'rxjs';
import { CommonModule, NgClass } from '@angular/common';
import { FormationServiceService } from '../../services/services/Formation/formation-service.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup ;
  message: string | null = null;
  showPassword: boolean = false;
categories : String[] = []

  constructor(
    private readonly apiService: TokenService,
    private formationService : FormationServiceService,
    private router: Router,
    private fb: FormBuilder
  ) {
    this.registerForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      name: ['', [Validators.required]],
      phoneNumber: ['', [Validators.required, Validators.pattern(/^\d{8,10}$/)]],
      address: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(8)]]
    });
  }
ngOnInit() {
  this.formationService.getCategories().subscribe(res => {
    this.categories = res;
  });
}
  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }
    async handleSubmit() {
    if (this.registerForm.invalid) {
      this.showMessage("Veuillez remplir correctement tous les champs.");
      return;
    }

    try {
      const response: any = await firstValueFrom(this.apiService.registerUser(this.registerForm.value));
      if (response.status === 200) {
        this.showMessage('Utilisateur enregistré avec succès');
        this.router.navigate(['activate-account']);
      }
    } catch (error: any) {
      console.log(error);
      this.showMessage(error.error?.message || error.message || 'Impossible de s’enregistrer');
    }
  }
    showMessage(message: string) {
    this.message = message;
    setTimeout(() => (this.message = null), 3000);
  }
}
