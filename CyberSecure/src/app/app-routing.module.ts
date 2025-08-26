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
import { FormationListComponent } from './admin/formation/formation-list/formation-list.component';
import { DetailsFormationComponent } from './clients/formation/details-formation/details-formation.component';
import { ListChapitreComponent } from './clients/chapitre/list-chapitre/list-chapitre.component';
import { AddRdvComponent } from './clients/RDVs/add-rdv/add-rdv.component';
import { MainAdminComponent } from './admin/main-admin/main-admin.component';
import { MainUserComponent } from './clients/main-user/main-user.component';
import { RdvListComponent } from './admin/rdv/rdv-list/rdv-list.component';
import { FormationClientListComponent } from './clients/formation/formation-client-list/formation-client-list.component';
import { ChapterDetailsComponent } from './clients/chapitre/chapter-details/chapter-details.component';
import { ListSlidesComponent } from './admin/slide/list-slides/list-slides.component';
import { CartComponent } from './clients/panier/cart/cart.component';

const routes: Routes = [
    {path:"",redirectTo:"home", pathMatch:"full"},
    {path: "home" , component:HomeComponent},
    {path: "login" , component:LoginComponent},
    {path: "register" , component:RegisterComponent},
    {path: "activate-account" , component:ActivateAccountComponent},
    {path: 'forgot-password', component: ForgotPaswordComponent},
    {path: 'reset-password', component: ResetPasswordComponent},
// User paths
    {path: "mainUser" , component:MainUserComponent ,canActivate: [clientGuard], children: [
    {path: "home" , component:HomeUserComponent ,canActivate: [clientGuard]},
    {path: 'profile', component: ProfileComponent,canActivate: [userGuard]},
    {path: "addRdv" , component:AddRdvComponent , canActivate : [clientGuard]},
    {path: "formations" , component:FormationClientListComponent, canActivate : [clientGuard]},
    ]},
//  Admin paths
     {path: "mainAdmin" , component:MainAdminComponent ,canActivate: [adminGuard], children : [
     {path: 'profile', component: ProfileComponent,canActivate: [userGuard]},
     {path: "home" , component:HomeAdminComponent ,canActivate: [adminGuard]},
     {path: 'usersList', component: UsersListComponent,canActivate: [adminGuard]},
     {path: 'formationList', component: FormationListComponent,canActivate: [adminGuard]},
     {path: 'rdvList', component: RdvListComponent, canActivate:[adminGuard] },
     {path: "slideList", component: ListSlidesComponent , canActivate:[adminGuard] }

    ]},
// Visitor paths
    {path: "formationDetails/:id" , component:DetailsFormationComponent},
    {path: "chapterList/:id" , component:ListChapitreComponent},
    {path: "chapitre/:id/slides", component: ChapterDetailsComponent },
    {path: "panier", component: CartComponent },














];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
