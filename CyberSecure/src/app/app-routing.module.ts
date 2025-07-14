import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { HomeComponent } from './pages/home/home.component';
import { RegisterComponent } from './pages/register/register.component';
import { ActivateAccountComponent } from './pages/activate-account/activate-account.component';
import { HomeUserComponent } from './clients/home-user/home-user.component';
import { HomeAdminComponent } from './admin/home-admin/home-admin.component';
import { adminGuard, clientGuard } from './services/guards/auth.guard';

const routes: Routes = [
    {path:"",redirectTo:"home", pathMatch:"full"},
    {path: "home" , component:HomeComponent},
    {path: "login" , component:LoginComponent},
    {path: "register" , component:RegisterComponent},
    {path: "activate-account" , component:ActivateAccountComponent},
    {path: "homeUser" , component:HomeUserComponent ,canActivate: [clientGuard]},
    {path: "homeAdmin" , component:HomeAdminComponent ,canActivate: [adminGuard]},




];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
