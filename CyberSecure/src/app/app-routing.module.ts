import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { HomeComponent } from './pages/home/home.component';
import { RegisterComponent } from './pages/register/register.component';
import { ActivateAccountComponent } from './pages/activate-account/activate-account.component';
import { HomeUserComponent } from './clients/home-user/home-user.component';
import { HomeAdminComponent } from './admin/home-admin/home-admin.component';
import { adminGuard, clientGuard, userGuard } from './services/guards/auth.guard';
import { UsersListComponent } from './admin/users-list/users-list.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { ForgotPaswordComponent } from './pages/password/forgot-pasword/forgot-pasword.component';
import { ResetPasswordComponent } from './pages/password/reset-password/reset-password.component';
import { AddFormationComponent } from './admin/formation/add-formation/add-formation.component';
import { FormationListComponent } from './admin/formation/formation-list/formation-list.component';

const routes: Routes = [
    {path:"",redirectTo:"home", pathMatch:"full"},
    {path: "home" , component:HomeComponent},
    {path: "login" , component:LoginComponent},
    {path: "register" , component:RegisterComponent},
    {path: "activate-account" , component:ActivateAccountComponent},
    {path: 'forgot-password', component: ForgotPaswordComponent},
    {path: 'reset-password', component: ResetPasswordComponent},
    {path: "homeUser" , component:HomeUserComponent ,canActivate: [clientGuard]},
    {path: "homeAdmin" , component:HomeAdminComponent ,canActivate: [adminGuard]},
    {path: 'usersList', component: UsersListComponent,canActivate: [adminGuard]},
    {path: 'profile', component: ProfileComponent,canActivate: [userGuard]},
    {path: 'formationAdminList', component: FormationListComponent,canActivate: [adminGuard]},
    {path: 'addFormation', component: AddFormationComponent,canActivate: [adminGuard]},







];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
