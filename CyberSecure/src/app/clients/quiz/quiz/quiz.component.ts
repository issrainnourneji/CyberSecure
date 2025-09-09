import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { QuizService } from '../../../services/services/quiz/quiz.service';

@Component({
  selector: 'app-quiz',
  templateUrl: './quiz.component.html',
  styleUrls: ['./quiz.component.css']
})
export class QuizComponent implements OnInit, OnDestroy {
  chapitreId!: number;
  quiz: any = null;
  selectedAnswers: { [questionId: number]: number } = {};
  submitted = false;
  result: any = null;
  timeLeft!: number;
  timerInterval: any;
  currentQuestionIndex: number = 0;
  alreadyPassed: boolean = false;

  constructor(private route: ActivatedRoute, private quizService: QuizService) {}

  ngOnInit(): void {
    this.chapitreId = Number(this.route.snapshot.paramMap.get('chapitreId'));

    // Vérifier si le user a déjà un résultat
    this.quizService.getUserQuizResult(this.chapitreId).subscribe({
      next: (res) => {
        if (res && res.success !== undefined) {
          // ⚡ L'utilisateur a déjà passé le quiz
          this.result = res;
          this.submitted = true;
          if (res.success) this.alreadyPassed = true;

          // Charger le quiz seulement pour afficher les questions si nécessaire
          if (!this.alreadyPassed) this.loadQuiz();
        } else {
          // Aucun résultat → charger le quiz
          this.loadQuiz();
        }
      },
      error: (err) => {
        console.error('Erreur récupération résultat', err);
        this.loadQuiz();
      }
    });
  }

  ngOnDestroy(): void {
    if (this.timerInterval) clearInterval(this.timerInterval);
  }

  loadQuiz() {
    this.quizService.getQuizByChapitre(this.chapitreId).subscribe({
      next: (data) => {
        this.quiz = data;
        this.timeLeft = this.quiz.timeLimit;
        if (!this.alreadyPassed) this.startTimer();
      },
      error: (err) => console.error('Erreur chargement quiz', err)
    });
  }

  startTimer() {
    if (this.timeLeft > 0) {
      this.timerInterval = setInterval(() => {
        this.timeLeft--;
        if (this.timeLeft <= 0) {
          clearInterval(this.timerInterval);
          this.submitQuiz();
        }
      }, 1000);
    }
  }

  getFormattedTime(): string {
    const minutes = Math.floor(this.timeLeft / 60);
    const seconds = this.timeLeft % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }

  nextQuestion(answerId: number) {
  const questionId = this.quiz.questions[this.currentQuestionIndex].id;
  this.selectedAnswers[questionId] = answerId; // <-- stocke la réponse sélectionnée

  if (this.currentQuestionIndex < this.quiz.questions.length - 1) {
    this.currentQuestionIndex++;
  } else {
    this.submitQuiz();
  }
}

submitQuiz() {
  if (!this.quiz || this.submitted) return;

  this.quizService.submitQuiz(this.quiz.id, this.selectedAnswers).subscribe({
    next: (res) => {
      this.result = {
        ...res,
        datePassed: res.datePassed ? new Date(res.datePassed) : new Date()
      };
      this.submitted = true;
      this.alreadyPassed = res.success;
    },
    error: (err) => console.error('Erreur soumission quiz', err)
  });
}

  restartQuiz() {
    if (this.alreadyPassed) {
      alert("Vous avez déjà réussi ce quiz, vous ne pouvez plus le refaire ✅");
      return;
    }
    this.currentQuestionIndex = 0;
    this.submitted = false;
    this.selectedAnswers = {};
    this.result = null;
    this.timeLeft = this.quiz.timeLimit;
    this.startTimer();
  }
}
