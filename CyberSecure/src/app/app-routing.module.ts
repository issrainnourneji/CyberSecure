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
import { SlidehtmlComponent } from './clients/slidehtml/slidehtml/slidehtml.component';
import { QuizComponent } from './clients/quiz/quiz/quiz.component';
import { QuizListComponent } from './admin/quiz/quiz-list/quiz-list.component';
import { AllquizComponent } from './clients/quiz/allquiz/allquiz.component';
import { CertificationComponent } from './clients/certificat/certification/certification.component';
import { UserCertifComponent } from './clients/certificat/user-certif/user-certif.component';
import { AboutComponent } from './info/about/about.component';
import { CourseComponent } from './info/course/course.component';
import { ContactComponent } from './info/contact/contact.component';
import { CertifListComponent } from './admin/certifications/certif-list/certif-list.component';
import { AccueilComponent } from './MuntuCyberSecure/accueil/accueil.component';
import { ContactMuntuComponent } from './MuntuCyberSecure/contact-muntu/contact-muntu.component';
import { RejoinMuntuComponent } from './MuntuCyberSecure/rejoin-muntu/rejoin-muntu.component';
import { PresentationMuntuComponent } from './MuntuCyberSecure/presentation-muntu/presentation-muntu.component';

const routes: Routes = [
    {path:"",redirectTo:"home", pathMatch:"full"},
    {path: "home" , component:HomeComponent},
    {path: "login" , component:LoginComponent},
    {path: "register" , component:RegisterComponent},
    {path: "activate-account" , component:ActivateAccountComponent},
    {path: 'forgot-password', component: ForgotPaswordComponent},
    {path: 'reset-password', component: ResetPasswordComponent},

    // infos
    {path: 'about', component: AboutComponent},
    {path: 'courses', component: CourseComponent},
    {path: 'courses/:cat', component: CourseComponent },
    {path: 'contact', component: ContactComponent},


// User paths
    {path: "mainUser" , component:MainUserComponent ,canActivate: [clientGuard], children: [
    {path: "home" , component:HomeUserComponent ,canActivate: [clientGuard]},
    {path: 'profile', component: ProfileComponent,canActivate: [userGuard]},
    {path: "addRdv" , component:AddRdvComponent , canActivate : [clientGuard]},
    {path: "formations" , component:FormationClientListComponent, canActivate : [clientGuard]},
    {path: "allQuiz", component: AllquizComponent , canActivate:[clientGuard] },
    {path: 'allCertif', component: UserCertifComponent ,  canActivate : [clientGuard] },
    {path: "panier", component: CartComponent,  canActivate : [clientGuard] },
    {path: 'certification/:id', component: CertificationComponent ,  canActivate : [clientGuard] },
    {path: "chapterList/:id" , component:ListChapitreComponent ,  canActivate : [clientGuard]},
    {path: "chapitre/:id/slides", component: ChapterDetailsComponent ,  canActivate : [clientGuard]},
    {path: "quiz/:chapitreId" , component:QuizComponent,  canActivate : [clientGuard] },
  ]
  },

//  Admin paths
     {path: "mainAdmin" , component:MainAdminComponent ,canActivate: [adminGuard], children : [
     {path: 'profile', component: ProfileComponent,canActivate: [userGuard]},
     {path: "home" , component:HomeAdminComponent ,canActivate: [adminGuard]},
     {path: 'usersList', component: UsersListComponent,canActivate: [adminGuard]},
     {path: 'formationList', component: FormationListComponent,canActivate: [adminGuard]},
     {path: 'rdvList', component: RdvListComponent, canActivate:[adminGuard] },
     {path: "slideList", component: ListSlidesComponent , canActivate:[adminGuard] },
     {path: "quizList", component: QuizListComponent , canActivate:[adminGuard] },
     {path: "allCertifications", component: CertifListComponent , canActivate:[adminGuard] }
    ]},
// Visitor paths
    {path: "formationDetails/:id" , component:DetailsFormationComponent},

//Muntu CyberSecure paths

{path: "accueil" , component : AccueilComponent},
{path: "contactMuntu" , component : ContactMuntuComponent},
{path: "joindrenous" , component : RejoinMuntuComponent},
{path: "presentationMuntu" , component : PresentationMuntuComponent},


















];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
