import { Component, OnInit } from '@angular/core';
import { QuizService } from '../../../services/services/quiz/quiz.service';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { ActivatedRoute } from '@angular/router';
import { FormationServiceService } from '../../../services/services/Formation/formation-service.service';

@Component({
  selector: 'app-quiz-result',
  templateUrl: './quiz-result.component.html',
  styleUrl: './quiz-result.component.css'
})
export class QuizResultComponent implements OnInit {
  history: any[] = [];
  loading = true;
formationId!: number;
  constructor(private quizService: QuizService , private route: ActivatedRoute , private formationService : FormationServiceService) {}

ngOnInit(): void {
    const chapitreId = Number(this.route.snapshot.paramMap.get('chapitreId'));

  this.quizService.getUserQuizHistoryByChapitre(chapitreId).subscribe({
    next: (res) => {
      this.history = (res || []).map((r: any) => ({
        quiz: r.quiz || { questions: [] },
        score: r.score ?? 0,
        success: r.success ?? false,
        userAnswers: r.userAnswers || {},
        datePassed: r.datePassed ? new Date(r.datePassed) : new Date()
      }));

      this.history.sort((a, b) => b.datePassed.getTime() - a.datePassed.getTime());

      this.loading = false;
    },
    error: (err) => {
      console.error(err);
      this.loading = false;
    }
  });

   this.formationService.getFormationByChapitre(chapitreId).subscribe({
      next: (formation) => {
        this.formationId = formation.id;
      },
      error: (err) => console.error('Impossible de récupérer la formation :', err)
    });


}

isUserSelected(userAnswers: { [questionId: number]: number }, questionId: number, answer: any): boolean {
  if (!userAnswers) return false;
  return userAnswers[questionId] === answer.id;
}

isUserWrongAnswer(userAnswers: any, questionId: number, answer: any): boolean {
  return userAnswers && userAnswers[questionId] === answer.id && !answer.correct;
}

downloadPdf() {
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

    const title = "Résultats des Quiz"; 
    const titleFontSize = 16;
    const titleMargin = 10;

    pdf.setFontSize(titleFontSize);
    pdf.text(title, pdfWidth / 2, titleMargin, { align: 'center' });

    pdf.addImage(imgData, 'PNG', 0, titleMargin + 5, imgWidth, imgHeight);
    heightLeft -= pdfHeight;

    while (heightLeft > 0) {
      pdf.addPage();
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
