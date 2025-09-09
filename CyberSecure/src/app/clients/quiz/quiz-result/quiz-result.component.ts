import { Component, OnInit } from '@angular/core';
import { QuizService } from '../../../services/services/quiz/quiz.service';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

@Component({
  selector: 'app-quiz-result',
  templateUrl: './quiz-result.component.html',
  styleUrl: './quiz-result.component.css'
})
export class QuizResultComponent implements OnInit {
  history: any[] = [];
  loading = true;

  constructor(private quizService: QuizService) {}
ngOnInit(): void {
  this.quizService.getUserQuizHistory().subscribe({
    next: (res) => {
      this.history = (res || []).map((r: any) => ({
        quiz: r.quiz || { questions: [] },
        score: r.score ?? 0,
        success: r.success ?? false,
        userAnswers: r.userAnswers || {},
        datePassed: r.datePassed ? new Date(r.datePassed) : new Date()
      }));

      // 🔹 Trier par date décroissante (dernier en haut)
      this.history.sort((a, b) => b.datePassed.getTime() - a.datePassed.getTime());

      this.loading = false;
    },
    error: (err) => {
      console.error(err);
      this.loading = false;
    }
  });
}


isUserWrongAnswer(userAnswers: any, questionId: number, answer: any): boolean {
  return userAnswers && userAnswers[questionId] === answer.id && !answer.correct;
}

downloadPdf() {
  const element = document.getElementById('quiz-results'); // ⚡ maintenant ça existe
  if (!element) return;

  html2canvas(element, { scale: 2 }).then(canvas => {
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
    pdf.save('quiz_results.pdf');
  });
}


}
