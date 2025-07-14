import { Component } from '@angular/core';
import { TokenService } from '../../services/services/token.service';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-login',

  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  message: any = null;
  formData: any = {
      email: '',
      password: ''
    }
  showPassword: boolean = false;

    constructor(private readonly apiService: TokenService, private router: Router) { }


  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }
  async handleSubmit() {
    if (!this.formData.email || !this.formData.password) {
      this.showMessage("Email and Password are required");
      return;
    }

    const emailRegex = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/;
    if (!emailRegex.test(this.formData.email)) {
      this.showMessage("Please enter a valid email address");
      return;
    }

    if (this.formData.password.length < 8) {
      this.showMessage("Password must be at least 8 characters long");
      return;
    }

    try {
      const response: any = await firstValueFrom(this.apiService.loginUser(this.formData));
      if (response.status === 200) {
        this.showMessage('User Successfully logged in');

        localStorage.setItem('token', response.token);
        localStorage.setItem('role', response.role);

        this.apiService.authStatuschanged.emit();

        if (response.role === 'USER') {
          this.router.navigate(['/homeUser']);
        } else if (response.role === 'ADMIN') {
          this.router.navigate(['/homeAdmin']);
        }
      }
    } catch (error: any) {
      console.log(error);
      if (error.message.includes('Account not activated')) {
        this.showMessage('Please activate your account by checking your email.');
      } else {
        this.showMessage(error.error?.message || error.message || 'Unable to login');
      }
    }
  }

    showMessage(message: string) {
    this.message = message;
    setTimeout(() => {
      this.message = null;
    }, 3000);
  }
}
