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
import { FormationListComponent } from './admin/formation/formation-list/formation-list.component';
import { HeaderAdminComponent } from './Components/header-admin/header-admin.component';
import { HomeComponent } from './pages/home/home.component';
import { DetailsFormationComponent } from './clients/formation/details-formation/details-formation.component';
import { SafeUrlPipe } from './safe-url.pipe';
import { ListChapitreComponent } from './clients/chapitre/list-chapitre/list-chapitre.component';
import { AddRdvComponent } from './clients/RDVs/add-rdv/add-rdv.component';
import { FullCalendarModule } from '@fullcalendar/angular';
import { FooterComponent } from "./Components/footer/footer.component";
import { HeaderUserComponent } from './Components/header-user/header-user.component';
import { MainAdminComponent } from './admin/main-admin/main-admin.component';
import { MainUserComponent } from './clients/main-user/main-user.component';
import { RdvListComponent } from './admin/rdv/rdv-list/rdv-list.component';
import { FormationClientListComponent } from './clients/formation/formation-client-list/formation-client-list.component';
import { HeaderHomeComponent } from './Components/header-home/header-home.component';
import { ChapterDetailsComponent } from './clients/chapitre/chapter-details/chapter-details.component';
import { ListSlidesComponent } from './admin/slide/list-slides/list-slides.component';
import { CartComponent } from './clients/panier/cart/cart.component';
import { SlidehtmlComponent } from './clients/slidehtml/slidehtml/slidehtml.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { QuizComponent } from './clients/quiz/quiz/quiz.component';
import { QuizResultComponent } from './clients/quiz/quiz-result/quiz-result.component';
import { QuizListComponent } from './admin/quiz/quiz-list/quiz-list.component';
import { AllquizComponent } from './clients/quiz/allquiz/allquiz.component';
import { CertificationComponent } from './clients/certificat/certification/certification.component';
import { UserCertifComponent } from './clients/certificat/user-certif/user-certif.component';
import { AboutComponent } from './info/about/about.component';
import { CourseComponent } from './info/course/course.component';
import { ContactComponent } from './info/contact/contact.component';
import { CertifListComponent } from './admin/certifications/certif-list/certif-list.component';
import { AccueilComponent } from './MuntuCyberSecure/accueil/accueil.component';
import { HeaderMuntuComponent } from './Components/header-muntu/header-muntu.component';
import { ContactMuntuComponent } from './MuntuCyberSecure/contact-muntu/contact-muntu.component';
import { RejoinMuntuComponent } from './MuntuCyberSecure/rejoin-muntu/rejoin-muntu.component';
import { PresentationMuntuComponent } from './MuntuCyberSecure/presentation-muntu/presentation-muntu.component';


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
    FormationListComponent,
    HeaderAdminComponent,
    HomeComponent,
    DetailsFormationComponent,
    SafeUrlPipe,
    ListChapitreComponent,
    AddRdvComponent,
    FooterComponent,
    HeaderUserComponent,
    MainAdminComponent,
    MainUserComponent,
    RdvListComponent,
    FormationClientListComponent,
    HeaderHomeComponent,
    ChapterDetailsComponent,
    SafeUrlPipe,
    ListSlidesComponent,
    CartComponent,
    SlidehtmlComponent,
    QuizComponent,
    QuizResultComponent,
    QuizListComponent,
    AllquizComponent,
    CertificationComponent,
    UserCertifComponent,
    AboutComponent,
    CourseComponent,
    ContactComponent,
    CertifListComponent,
    AccueilComponent,
    HeaderMuntuComponent,
    ContactMuntuComponent,
    RejoinMuntuComponent,
    PresentationMuntuComponent

  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    AppRoutingModule,
    CodeInputModule,
    HttpClientModule,
    FullCalendarModule,
    NgxPaginationModule,
    FullCalendarModule,

],
  providers: [HttpClient,
    NotificationService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
