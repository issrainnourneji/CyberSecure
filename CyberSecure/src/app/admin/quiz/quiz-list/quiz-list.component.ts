import { AfterViewInit, Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FormationServiceService } from '../../../services/services/Formation/formation-service.service';
import { ChapterService } from '../../../services/services/Chapiters/chapter.service';
import { QuizService } from '../../../services/services/quiz/quiz.service';

declare var bootstrap: any;

@Component({
  selector: 'app-quiz-list',
  templateUrl: './quiz-list.component.html',
  styleUrls: ['./quiz-list.component.css']
})
export class QuizListComponent implements OnInit, AfterViewInit {
  quizForm: FormGroup;
  quizzes: any[] = [];
  filteredQuizzes: any[] = [];
  formations: any[] = [];
  chapitres: any[] = [];
  addQuizModal: any;
selectedQuiz: any = null;
viewQuizModal: any;
   isEditing: boolean = false;
     p: number = 1;
     selectedFormationId: number | null = null;
selectedChapitreId: number | null = null;
totalPages: number = 0;
itemsPerPage: number = 6;

  constructor(
    private fb: FormBuilder,
    private formationService: FormationServiceService,
    private chapitreService: ChapterService,
    private quizService: QuizService
  ) {
    this.quizForm = this.fb.group({
  id: [null],
  formationId: [null, Validators.required],
  chapitreId: [null, Validators.required],
  titre: ['', Validators.required],
  timeLimit: [30, [Validators.required, Validators.min(1)]],
  questions: this.fb.array([])
});

  }

  ngOnInit(): void {
    this.loadFormations();
    this.loadQuizzes();
  }

ngAfterViewInit(): void {
  const addModalEl = document.getElementById('addQuizModal');
  if (addModalEl) this.addQuizModal = new bootstrap.Modal(addModalEl);

  const viewModalEl = document.getElementById('viewQuizModal');
  if (viewModalEl) this.viewQuizModal = new bootstrap.Modal(viewModalEl);
}

openQuizModal(quiz: any) {
  this.selectedQuiz = quiz;

  setTimeout(() => {
    if (this.viewQuizModal) this.viewQuizModal.show();
  }, 0);
}


  get questions(): FormArray {
    return this.quizForm.get('questions') as FormArray;
  }

  getReponses(qIndex: number): FormArray {
    return this.questions.at(qIndex).get('reponses') as FormArray;
  }

  loadFormations(): void {
    this.formationService.getAllFormations().subscribe({
      next: res => this.formations = res,
      error: err => console.error(err)
    });
  }

onFormationChange(): void {
  const formationId = this.selectedFormationId ?? this.quizForm.get('formationId')?.value;

  if (!formationId) {
    this.chapitres = [];
    this.selectedChapitreId = null;
    this.quizForm.get('chapitreId')?.setValue(null);

    if (this.selectedFormationId !== null) {
      this.applyFilter();
    }
    return;
  }

  this.chapitreService.getChapitresByFormation(formationId).subscribe({
    next: data => {
      this.chapitres = data;
      this.selectedChapitreId = null;
      this.quizForm.get('chapitreId')?.setValue(null);

      if (this.selectedFormationId !== null) {
        this.applyFilter();
      }
    },
    error: err => console.error('Erreur chargement chapitres', err)
  });
}


onChapitreChange(): void {
  this.applyFilter();
}

applyFilter(): void {
  this.filteredQuizzes = this.quizzes.filter(quiz =>
    (!this.selectedFormationId || quiz.chapitre?.formation?.id === this.selectedFormationId) &&
    (!this.selectedChapitreId || quiz.chapitre?.id === this.selectedChapitreId)
  );
  this.p = 1;
}


  loadQuizzes(): void {
    this.quizService.getAllQuizzes().subscribe({
      next: data => {
        this.quizzes = data;
        this.filteredQuizzes = data;
            this.totalPages = Math.ceil(this.filteredQuizzes.length / this.itemsPerPage);

      },
      error: err => console.error(err)
    });
  }

  addQuestion(): void {
    this.questions.push(this.fb.group({
      texte: ['', Validators.required],
      reponses: this.fb.array([])
    }));
  }

  removeQuestion(index: number): void {
    this.questions.removeAt(index);
  }

  addReponse(qIndex: number): void {
    this.getReponses(qIndex).push(this.fb.group({
      texte: ['', Validators.required],
      correct: [false]
    }));
  }

  removeReponse(qIndex: number, rIndex: number): void {
    this.getReponses(qIndex).removeAt(rIndex);
  }

submitQuiz(): void {
  if (!this.quizForm.valid) {
    alert('Veuillez remplir tous les champs requis !');
    return;
  }

  const payload = this.quizForm.value;
  const chapitreId = payload.chapitreId;

  if (payload.id) {
    this.quizService.updateQuiz(payload.id, payload).subscribe({
      next: () => {
        this.loadQuizzes();
        alert('Quiz mis à jour ✅');
        this.quizForm.reset({ timeLimit: 30, questions: [] });
        if (this.addQuizModal) this.addQuizModal.hide();
      },
      error: err => console.error(err)
    });
  } else {
    this.quizService.addQuiz(chapitreId, payload.titre, payload.timeLimit).subscribe({
      next: quizResp => {
        const quizId = quizResp.id;
        const questionObservables = payload.questions.map((q: any) =>
          this.quizService.addQuestion(quizId, q)
        );

        Promise.all(questionObservables.map((obs:any) => obs.toPromise()))
          .then(() => {
            this.loadQuizzes();
            this.quizForm.reset({ timeLimit: 30, questions: [] });
            if (this.addQuizModal) this.addQuizModal.hide();
          })
          .catch(err => console.error(err));
      },
      error: err => console.error(err)
    });
  }
}



editQuiz(quiz: any) {
  this.quizForm.patchValue({
    id: quiz.id,
    formationId: quiz.chapitre?.formation?.id,
    chapitreId: quiz.chapitre?.id,
    titre: quiz.titre,
    timeLimit: quiz.timeLimit
  });

  this.questions.clear();
  quiz.questions.forEach((q: any) => {
    const qGroup = this.fb.group({
      id: [q.id],
      texte: [q.texte, Validators.required],
      reponses: this.fb.array([])
    });

    q.reponses.forEach((r: any) => {
      (qGroup.get('reponses') as FormArray).push(this.fb.group({
        id: [r.id],
        texte: [r.texte, Validators.required],
        correct: [r.correct]
      }));
    });

    this.questions.push(qGroup);
  });

  if (this.addQuizModal) this.addQuizModal.show();
}
getVisiblePages(): number[] {
  const pages: number[] = [];

  if (this.totalPages <= 3) {
    for (let i = 1; i <= this.totalPages; i++) {
      pages.push(i);
    }
  } else {
    if (this.p === 1) {
      pages.push(1, 2, 3);
    } else if (this.p === this.totalPages) {
      pages.push(this.totalPages - 2, this.totalPages - 1, this.totalPages);
    } else {
      pages.push(this.p - 1, this.p, this.p + 1);
    }
  }

  return pages;
}


}
