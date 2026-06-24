import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormationServiceService } from '../../../services/services/Formation/formation-service.service';
import { SlideService } from '../../../services/services/slide/slide.service';
import { QuizService } from '../../../services/services/quiz/quiz.service';
import { CertificationService } from '../../../services/services/certificat/certification.service';
import { TokenService } from '../../../services/services/token.service';

@Component({
  selector: 'app-list-chapitre',
  templateUrl: './list-chapitre.component.html',
  styleUrl: './list-chapitre.component.css'
})
export class ListChapitreComponent {
formation: any;
formations: any[] = [];
itemsPerPage: number = 6;
searchTerm: string = '';
p: number = 1;
slideCounts: { [chapitreId: number]: number } = {};
studentsCount: { [key: number]: number } = {};
passedChapitres: number[] = [];
quizResultsMap: { [chapitreId: number]: any } = {};
  currentUser: any;

  constructor(private tokenService : TokenService,private certificationService : CertificationService,private router: Router ,private quizService : QuizService,private slideService : SlideService,private route: ActivatedRoute, private formationService: FormationServiceService) {}
ngOnInit(): void {
  const id = this.route.snapshot.paramMap.get('id');
  if (id) {
    this.formationService.getFormationById(+id).subscribe(
      data => this.formation = data,

      error => console.error('Erreur de récupération formation', error)
    );
  }
  this.formationService.getAllFormations().subscribe(
      (response) => {
        this.formations = response;
        this.loadSlideCounts();
        this.formationService.getNumberOfStudentsForAllFormations().subscribe(counts => {
      this.studentsCount = counts;
    });
      },
      (error) => {
        console.error('Error fetching formations:', error);
      }
    );

    this.quizService.getPassedChapitres().subscribe({
  next: (ids) => this.passedChapitres = ids,
  error: (err) => console.error("Erreur récupération chapitres validés", err)
});
  this.loadChapitresAndResults();

  this.tokenService.getLoggedInUserInfo().subscribe(
    user => {
      this.currentUser = user;
      console.log("Utilisateur chargé :", this.currentUser);
    },
    err => {
      console.error("Erreur récupération user", err);
    }
  );

    this.loadCurrentUser();
  }

  loadCurrentUser() {
    this.tokenService.getLoggedInUserInfo().subscribe(
      (user) => {
        this.currentUser = user;
      },
      (err) => {
        console.error('Impossible de récupérer l’utilisateur courant', err);
      }
    );
  }

get filteredChapitres(): any[] {
  if (!this.formation?.chapitres) return [];
  return this.formation.chapitres.filter((chapitre:any) =>
    chapitre.titre.toLowerCase().includes(this.searchTerm.toLowerCase())
  );
}

get paginatedChapitres(): any[] {
  const startIndex = (this.p - 1) * this.itemsPerPage;
  const endIndex = startIndex + this.itemsPerPage;
  return this.filteredChapitres.slice(startIndex, endIndex);
}
onSearchChange() {
  this.p = 1;
}
showLockedAlert() {
  window.alert("⚠️ Vous devez terminer le chapitre précédent avec succès avant de pouvoir accéder à celui-ci.");
}
goToChapter(chapitre: any) {
  if (this.isChapterEnabled(chapitre)) {
    this.router.navigate(['/mainUser/chapitre', chapitre.id, 'slides']);
  } else {
    this.showLockedAlert();
  }
}


loadSlideCounts() {
  if (this.formation?.chapitres) {
    this.formation.chapitres.forEach((chapitre: { id: number; titre: string }) => {
      this.slideService.getSlides(chapitre.id).subscribe(slides => {
        this.slideCounts[chapitre.id] = slides.length;
      });
    });
  }
}
getGlobalIndex(localIndex: number): number {
  const itemsPerPage = 6;
  return localIndex + (this.p - 1) * itemsPerPage;
}
showChapitre(chapitre: any, event: Event) {
  if (!this.isChapterEnabled(chapitre)) {
    event.preventDefault();
    window.alert("⚠️ Vous devez terminer le chapitre précédent avec succès avant de pouvoir accéder à celui-ci.");
    return;
  }
  this.router.navigate(['/mainUser/chapitre', chapitre.id, 'slides']);
}


loadChapitresAndResults() {
  const id = this.route.snapshot.paramMap.get('id');
  if (id) {
    this.formationService.getFormationById(+id).subscribe({
      next: data => {
        this.formation = data;

        this.formation.chapitres.forEach((chapitre: any) => {
          this.quizService.getUserQuizHistoryByChapitre(chapitre.id).subscribe({
            next: (res: any[]) => {
              if (res.length > 0) {
                const lastResult = res.sort((a, b) =>
                  new Date(b.datePassed).getTime() - new Date(a.datePassed).getTime()
                )[0];
                this.quizResultsMap[chapitre.id] = lastResult;
              }
            },
            error: err => console.error('Erreur récupération quiz results', err)
          });
        });
      },
      error: err => console.error(err)
    });
  }
}
isChapterEnabled(chapitre: any): boolean {
  const chapitres = this.formation?.chapitres || [];
  const globalIndex = chapitres.findIndex((c:any) => c.id === chapitre.id);

  if (globalIndex === 0) return true;
  const previousChapter = chapitres[globalIndex - 1];
  return this.passedChapitres.includes(previousChapter.id);
}


areAllChapitresPassed(): boolean {
  if (!this.formation?.chapitres || this.formation.chapitres.length === 0) {
    return false;
  }

  return this.formation.chapitres.every((chapitre: any) =>
    this.quizResultsMap[chapitre.id]?.success
  );
}
shouldShowCertificationButton(): boolean {
  if (!this.formation?.chapitres || this.formation.chapitres.length === 0) {
    return false;
  }

  const allChaptersPassed = this.formation.chapitres.every((chapitre: any) =>
    this.quizResultsMap[chapitre.id]?.success === true
  );

  return allChaptersPassed;
}

obtenirCertification() {
  if (!this.currentUser || !this.currentUser.user) {
    console.error("Utilisateur non défini");
    return;
  }

  const userId = this.currentUser.user.id;
  const formationId = this.formation.id;

  this.certificationService.generateCertification(userId, formationId)
    .subscribe(
      res => {
        console.log("Certification générée :", res);
        this.router.navigate(['/mainUser/certification', res.id]);
      },
      err => {
        console.error("Erreur génération certification :", err);
      }
    );
}
get totalPages(): number {
  return Math.ceil(this.filteredChapitres.length / this.itemsPerPage);
}

getVisiblePages(): number[] {
  const pages: number[] = [];
  const start = Math.max(1, this.p - 2);
  const end = Math.min(this.totalPages, this.p + 2);

  for (let i = start; i <= end; i++) {
    pages.push(i);
  }

  return pages;
}



}
