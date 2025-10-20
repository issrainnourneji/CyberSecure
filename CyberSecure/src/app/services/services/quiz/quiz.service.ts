import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class QuizService {

 private apiUrl = 'http://localhost:8080/quiz';

  constructor(private http: HttpClient) { }

  getQuizByChapitre(chapitreId: number): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': 'Bearer ' + localStorage.getItem('token')
    });
    return this.http.get(`${this.apiUrl}/chapitre/${chapitreId}`, { headers });
  }

  // Soumettre le quiz
  submitQuiz(quizId: number, answers: { [questionId: number]: number }): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': 'Bearer ' + localStorage.getItem('token')
    });
    return this.http.post(`${this.apiUrl}/${quizId}/submit`, answers, { headers });
  }

  // Récupérer le résultat si l'utilisateur a déjà passé le quiz
  getUserQuizResult(chapitreId: number): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': 'Bearer ' + localStorage.getItem('token')
    });
    return this.http.get(`${this.apiUrl}/chapitre/${chapitreId}/result`, { headers });
  }
getUserQuizHistoryByChapitre(chapitreId: number): Observable<any[]> {
  const headers = new HttpHeaders({
    'Authorization': 'Bearer ' + localStorage.getItem('token')
  });
   return this.http.get<any[]>(`${this.apiUrl}/user/history/${chapitreId}`, { headers });
}
  addQuiz(chapitreId: number, titre: string, timeLimit: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/add/${chapitreId}?titre=${titre}&timeLimit=${timeLimit}`, {});
  }

  addQuestion(quizId: number, question: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/${quizId}/addQ`, question);
  }

getAllQuizzes(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/all`);
  }

  // 🔹 Récupérer un quiz par son ID
  getQuizById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  getPassedChapitres(): Observable<number[]> {
  const headers = new HttpHeaders({
    'Authorization': 'Bearer ' + localStorage.getItem('token')
  });
  return this.http.get<number[]>(`${this.apiUrl}/user/passed-chapitres`, { headers });
}

  getUserQuizzes(): Observable<any[]> {
      const headers = new HttpHeaders({
    'Authorization': 'Bearer ' + localStorage.getItem('token')
  });
    return this.http.get<any[]>(`${this.apiUrl}/my`, { headers }); // endpoint backend à créer
  }

  getUserQuizHistoryByQuiz(quizId: number) {
     const headers = new HttpHeaders({
    'Authorization': 'Bearer ' + localStorage.getItem('token')
  });
  return this.http.get<any[]>(`${this.apiUrl}/user/${quizId}/history`, { headers });
}

updateQuiz(quizId: number, quizData: any): Observable<any> {
  const headers = new HttpHeaders({
    'Authorization': 'Bearer ' + localStorage.getItem('token'),
    'Content-Type': 'application/json'
  });
  return this.http.put(`${this.apiUrl}/update/${quizId}`, quizData, { headers });
}



deleteQuiz(quizId: number): Observable<any> {
    const headers = new HttpHeaders({
    'Authorization': 'Bearer ' + localStorage.getItem('token'),
    'Content-Type': 'application/json'
  });
  return this.http.delete(`${this.apiUrl}/${quizId}`, {headers});
}


}


