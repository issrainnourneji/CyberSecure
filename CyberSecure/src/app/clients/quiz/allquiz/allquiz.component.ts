import { Component, OnInit } from '@angular/core';
import { QuizService } from '../../../services/services/quiz/quiz.service';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';
declare var bootstrap: any;

@Component({
  selector: 'app-allquiz',
  templateUrl: './allquiz.component.html',
  styleUrl: './allquiz.component.css'
})
export class AllquizComponent implements OnInit {
  quizzes: any[] = [];
  selectedQuiz: any = null;
  history: any[] = [];
  currentPage: number = 1;   // Page actuelle
  pageSize: number = 4;      // Quiz par page
  totalPages: number = 0;
  constructor(private quizService: QuizService) {}

ngOnInit(): void {
  this.quizService.getAllQuizzes().subscribe((allQuizzes: any[]) => {
    // Pour chaque quiz, on fait un appel pour récupérer son historique
    const requests = allQuizzes.map((quiz: any) =>
      this.quizService.getUserQuizHistoryByQuiz(quiz.id).pipe(
        map((history: any[]) => {
          const hasSuccess = history.some(h => h.success === true);
          return hasSuccess ? quiz : null;
        })
      )
    );

    // Typage explicite pour éviter "unknown"
    forkJoin(requests).subscribe((results: (any | null)[]) => {
      this.quizzes = results.filter((q): q is any => q !== null);

        // Calculer le nombre total de pages
        this.totalPages = Math.ceil(this.quizzes.length / this.pageSize);
    });
  });
}

getQuizzesForCurrentPage(): any[] {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.quizzes.slice(start, start + this.pageSize);
  }

  // Aller à une page spécifique
  goToPage(page: number) {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
  }

  // Pages visibles (limitées à 3)
  getVisiblePages(): number[] {
    let start = Math.max(this.currentPage - 1, 1);
    let end = Math.min(start + 2, this.totalPages);
    if (end - start < 2) start = Math.max(end - 2, 1);

    const pages = [];
    for (let i = start; i <= end; i++) pages.push(i);
    return pages;
  }

  openDetails(quiz: any): void {
    this.selectedQuiz = quiz;

    // Charger l'historique du quiz pour l'utilisateur
   this.quizService.getUserQuizHistoryByQuiz(quiz.id).subscribe({
  next: (res) => {
    this.history = (res || []).map((r: any) => ({
      quiz: r.quiz || { questions: [] },
      score: r.score ?? 0,
      success: r.success ?? false,
      userAnswers: r.userAnswers || {},
      datePassed: r.datePassed ? new Date(r.datePassed) : new Date()
    }));
    this.history.sort((a, b) => b.datePassed.getTime() - a.datePassed.getTime());
  },
  error: (err) => {
    console.error(err);
    this.history = [];
  }
});

    // Ouvrir la modal
    const modalElement = document.getElementById('quizDetailsModal');
    if (modalElement) {
      const modal = new bootstrap.Modal(modalElement);
      modal.show();
    }
  }

  isUserWrongAnswer(userAnswers: any, questionId: number, answer: any): boolean {
    return userAnswers && userAnswers[questionId] === answer.id && !answer.correct;
  }

downloadPdf(): void {
  const element = document.getElementById('quiz-results');
  if (!element) return;

  html2canvas(element, { scale: 2 }).then(canvas => {
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();

    const imgProps = pdf.getImageProperties(imgData);
    const imgWidth = pdfWidth;
    const imgHeight = (imgProps.height * pdfWidth) / imgProps.width;

    let heightLeft = imgHeight;
    let position = 0;

    const title = "Résultats des Quiz"; // Ton titre ici
    const titleFontSize = 16;
    const titleMargin = 10;

    // Ajouter le titre sur la première page
    pdf.setFontSize(titleFontSize);
    pdf.text(title, pdfWidth / 2, titleMargin, { align: 'center' });

    // Ajouter l'image avec décalage pour le titre
    pdf.addImage(imgData, 'PNG', 0, titleMargin + 5, imgWidth, imgHeight);
    heightLeft -= pdfHeight;

    while (heightLeft > 0) {
      pdf.addPage();
      // Ajouter le titre sur chaque nouvelle page
      pdf.setFontSize(titleFontSize);
      pdf.text(title, pdfWidth / 2, titleMargin, { align: 'center' });

      position = heightLeft - imgHeight + titleMargin + 5;
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pdfHeight;
    }

    pdf.save('quiz_results.pdf');
  });
}

}
