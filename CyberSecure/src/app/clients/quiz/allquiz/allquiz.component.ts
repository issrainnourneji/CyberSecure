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
  filteredQuizzes: any[] = [];
  formations: any[] = [];
  chapitres: any[] = [];

  selectedQuiz: any = null;
  history: any[] = [];

  // Pagination
  currentPage: number = 1;
  pageSize: number = 4;
  totalPages: number = 0;

  // Filtres
  selectedFormation: string = '';
  selectedChapitre: string = '';
  minScore: number | null = null;
scoreSortOrder: '' | 'asc' | 'desc' = '';
  constructor(private quizService: QuizService) {}

  ngOnInit(): void {
    this.quizService.getUserQuizzes().subscribe({
    next: (results: any[]) => {
      // Récupérer tous les quiz
      const allQuizzes = results.map(r => r.quiz);

      // Dédupliquer par id
      const uniqueQuizzesMap = new Map<number, any>();
      allQuizzes.forEach(q => {
        if (!uniqueQuizzesMap.has(q.id)) {
          uniqueQuizzesMap.set(q.id, q);
        }
      });

      this.quizzes = Array.from(uniqueQuizzesMap.values());
      this.filteredQuizzes = [...this.quizzes];

      // Récupérer formations et chapitres uniques pour les filtres
      this.formations = [...new Map(this.quizzes.map(q => [q.chapitre.formation.id, q.chapitre.formation])).values()];
      this.chapitres = [...new Map(this.quizzes.map(q => [q.chapitre.id, q.chapitre])).values()];

      this.updatePagination();
    },
    error: (err) => {
      console.error(err);
      this.quizzes = [];
      this.filteredQuizzes = [];
      this.formations = [];
      this.chapitres = [];
    }
  });
  }

 applyFilters(): void {
  this.filteredQuizzes = this.quizzes.filter(q => {
    const formationMatch = this.selectedFormation ? q.chapitre.formation.id == this.selectedFormation : true;
    const chapitreMatch = this.selectedChapitre ? q.chapitre.id == this.selectedChapitre : true;
    return formationMatch && chapitreMatch;
  });

  this.currentPage = 1;
  this.updatePagination();
}

  filteredQuizzesForCurrentPage(): any[] {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.filteredQuizzes.slice(start, start + this.pageSize);
  }

  updatePagination(): void {
    this.totalPages = Math.ceil(this.filteredQuizzes.length / this.pageSize);
  }

  goToPage(page: number) {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
  }

  getVisiblePages(): number[] {
    let start = Math.max(this.currentPage - 1, 1);
    let end = Math.min(start + 2, this.totalPages);
    if (end - start < 2) start = Math.max(end - 2, 1);

    const pages = [];
    for (let i = start; i <= end; i++) pages.push(i);
    return pages;
  }

getQuizzesForCurrentPage(): any[] {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.quizzes.slice(start, start + this.pageSize);
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
