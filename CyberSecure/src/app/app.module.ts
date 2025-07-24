import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { AppComponent } from './app.component';

// Importe ici tous tes composants manuellement
import { CodeInputModule } from 'angular-code-input';
import { AppRoutingModule } from './app-routing.module';
import { RegisterComponent } from './pages/register/register.component';
import { LoginComponent } from './pages/login/login.component';
import { ActivateAccountComponent } from './pages/activate-account/activate-account.component';
import { HomeAdminComponent } from './admin/home-admin/home-admin.component';
import { HomeUserComponent } from './clients/home-user/home-user.component';
import { UsersListComponent } from './admin/users-list/users-list.component';
import { NotificationService } from './design/notification/notification.service';
import { NotificationComponent } from './design/notification/notification.component';
import { ModalDeleteConfirmationComponent } from './design/modal/modal-delete-confirmation.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { ForgotPaswordComponent } from './pages/password/forgot-pasword/forgot-pasword.component';
import { ResetPasswordComponent } from './pages/password/reset-password/reset-password.component';
import { AddFormationComponent } from './admin/formation/add-formation/add-formation.component';
import { FormationListComponent } from './admin/formation/formation-list/formation-list.component';
import { HeaderAdminComponent } from './Components/header-admin/header-admin.component';
import { FooterAdminComponent } from './Components/footer-admin/footer-admin.component';
import { HomeComponent } from './pages/home/home.component';
import { DetailsFormationComponent } from './clients/formation/details-formation/details-formation.component';
import { SafeUrlPipe } from './safe-url.pipe';
import { ListChapitreComponent } from './clients/chapitre/list-chapitre/list-chapitre.component';
import { AddRdvComponent } from './clients/RDVs/add-rdv/add-rdv.component';

@NgModule({
  declarations: [
    AppComponent,
    RegisterComponent,
    LoginComponent,
    ActivateAccountComponent ,
    HomeAdminComponent,
    HomeUserComponent,
    UsersListComponent,
    NotificationComponent,
    ModalDeleteConfirmationComponent,
    ProfileComponent,
    ForgotPaswordComponent,
    ResetPasswordComponent,
    AddFormationComponent,
    FormationListComponent,
    HeaderAdminComponent,
    FooterAdminComponent,
    HomeComponent,
    DetailsFormationComponent,
    SafeUrlPipe,
    ListChapitreComponent,
    AddRdvComponent

  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    AppRoutingModule,
    CodeInputModule,
    HttpClientModule,
  ],
  providers: [HttpClient,
    NotificationService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
