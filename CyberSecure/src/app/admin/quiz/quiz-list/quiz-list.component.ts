import { AfterViewInit, Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FormationServiceService } from '../../../services/services/Formation/formation-service.service';
import { ChapterService } from '../../../services/services/Chapiters/chapter.service';
import { QuizService } from '../../../services/services/quiz/quiz.service';

declare var bootstrap: any;

@Component({
  selector: 'app-quiz-list',
  templateUrl: './quiz-list.component.html',
  styleUrl: './quiz-list.component.css'
})
export class QuizListComponent implements OnInit , AfterViewInit {
  quizForm: FormGroup;
  quizzes: any[] = [];
  filteredQuizzes: any[] = [];
  formations: any[] = [];
  chapitres: any[] = [];
  selectedFormationId: number | null = null;
  selectedChapitreId: number | null = null;
  addQuizModal: any;
  p: number = 1;
  quiz: any = null; // Quiz créé affiché en dessous du formulaire

  constructor(
    private fb: FormBuilder,
    private formationService: FormationServiceService,
    private chapitreService: ChapterService,
    private quizService: QuizService
  ) {
    // Initialisation du formulaire avec FormBuilder
    this.quizForm = this.fb.group({
      formationId: [null, Validators.required],
      chapitreId: [null, Validators.required],
      titre: ['', Validators.required],
      timeLimit: [30, [Validators.required, Validators.min(1)]],
      questions: this.fb.array([]) // FormArray pour questions
    });
  }

  ngOnInit(): void {
    this.loadQuizzes();
    this.loadFormations();
  }

ngAfterViewInit(): void {
  const modalEl = document.getElementById('addQuizModal');
  if(modalEl) {
    this.addQuizModal = new bootstrap.Modal(modalEl);
  } else {
    console.error('addQuizModal introuvable !');
  }
}


  // 🔹 FormArray getter
  get questions(): FormArray {
    return this.quizForm.get('questions') as FormArray;
  }

  getReponses(qIndex: number): FormArray {
    return this.questions.at(qIndex).get('reponses') as FormArray;
  }

  // 🔹 Chargement des données
  loadQuizzes(): void {
    this.quizService.getAllQuizzes().subscribe({
      next: (data) => {
        this.quizzes = data;
        this.filteredQuizzes = data;
      },
      error: (err) => console.error('Erreur chargement quiz', err)
    });
  }

  loadFormations(): void {
    this.formationService.getAllFormations().subscribe({
      next: (res) => (this.formations = res),
      error: (err) => console.error('Erreur chargement formations', err)
    });
  }

// Lorsqu'on change la formation
onFormationChange(): void {
  const formationId = this.quizForm.get('formationId')?.value; // récupère la formation sélectionnée

  if (formationId) {
    this.chapitreService.getChapitresByFormation(formationId).subscribe({
      next: (data) => {
        this.chapitres = data;                   // remplis les chapitres disponibles
        this.quizForm.get('chapitreId')?.setValue(null); // reset le chapitre sélectionné
      },
      error: (err) => console.error('Erreur chargement chapitres', err)
    });
  } else {
    this.chapitres = [];
    this.quizForm.get('chapitreId')?.setValue(null);
  }
}

// Optionnel si tu veux juste récupérer le chapitre sélectionné
onChapitreChange(): void {
  const chapitreId = this.quizForm.get('chapitreId')?.value;
  console.log('Chapitre sélectionné :', chapitreId);
  // Tu peux ajouter ici d'autres actions si nécessaire
}


  // 🔹 Ajouter / Supprimer questions et réponses
  addQuestion(): void {
    const questionGroup = this.fb.group({
      texte: ['', Validators.required],
      reponses: this.fb.array([])
    });
    this.questions.push(questionGroup);
  }

  removeQuestion(index: number): void {
    this.questions.removeAt(index);
  }

  addReponse(qIndex: number): void {
    const reponsesArray = this.getReponses(qIndex);
    const reponseGroup = this.fb.group({
      texte: ['', Validators.required],
      correct: [false]
    });
    reponsesArray.push(reponseGroup);
  }

  removeReponse(qIndex: number, rIndex: number): void {
    const reponsesArray = this.getReponses(qIndex);
    reponsesArray.removeAt(rIndex);
  }

// 🔹 Soumettre le quiz complet
submitQuiz(): void {
  const chapitreId = this.quizForm.get('chapitreId')?.value; // <- récupérer depuis le form

  if (!chapitreId) {
    alert('Veuillez sélectionner un chapitre !');
    return;
  }

  if (this.quizForm.invalid) {
    alert('Veuillez remplir tous les champs requis !');
    return;
  }

  const quizPayload = this.quizForm.value;

  this.quizService.addQuiz(chapitreId, quizPayload.titre, quizPayload.timeLimit)
    .subscribe({
      next: (quizResp) => {
        const quizId = quizResp.id;

        // Ajouter les questions une par une
        const questionObservables = quizPayload.questions.map((q: any) => {
          q.quizId = quizId; // Ajouter l'ID du quiz pour le backend
          return this.quizService.addQuestion(quizId, q);
        });

        // Attendre toutes les requêtes questions
       Promise.all(questionObservables.map((obs: any) => obs.toPromise()))
  .then(() => {
    this.loadQuizzes();
    if (this.addQuizModal) {
      this.addQuizModal.hide();  // <-- sécurité ajoutée
    }
    this.quizForm.reset({ timeLimit: 30, questions: [] });
  })

          .catch(err => console.error('Erreur ajout questions', err));
      },
      error: (err) => console.error('Erreur ajout quiz', err)
    });
}

  // 🔹 Filtrage (optionnel)
applyFilter(): void {
  const formationId = this.quizForm.get('formationId')?.value;
  const chapitreId = this.quizForm.get('chapitreId')?.value;

  this.filteredQuizzes = this.quizzes.filter(quiz =>
    (!formationId || quiz.chapitre?.formation?.id === formationId) &&
    (!chapitreId || quiz.chapitre?.id === chapitreId)
  );
}


  // 🔹 Edition / suppression (placeholder)
  editQuiz(quiz: any): void { console.log('Edit quiz', quiz); }
  deleteQuiz(id: number): void { console.log('Delete quiz', id); }
}
