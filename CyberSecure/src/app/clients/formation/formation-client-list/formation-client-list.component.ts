import { Component, OnInit } from '@angular/core';
import { FormationServiceService } from '../../../services/services/Formation/formation-service.service';
import { TokenService } from '../../../services/services/token.service';
import { User } from '../../../services/models/user';
import { Role } from '../../../services/models/role';
import { CartService } from '../../../services/services/cart/cart.service';

@Component({
  selector: 'app-formation-client-list',

  templateUrl: './formation-client-list.component.html',
  styleUrl: './formation-client-list.component.css'
})
export class FormationClientListComponent implements OnInit {
  formations: any[] = [];
  error: any = null;
studentsCount: { [formationId: number]: number } = {};
 filteredFormations: any[] = [];

  p: number = 1;
  itemsPerPage: number = 6;
  totalPages: number = 0;

  constructor(private formationService: FormationServiceService, private cartService: CartService) {}

  ngOnInit(): void {
    this.loadMyFormations();

  }

  loadMyFormations(): void {
    this.formationService.getMyFormations().subscribe({
      next: (response) => {
        this.formations = response;
        this.updatePagination();
      },
      error: (err) => {
        console.error('Error fetching formations:', err);
        this.error = err?.error?.message || 'Impossible de récupérer les formations';
      }
    });
    this.formationService.getNumberOfStudentsForAllFormations().subscribe({
  next: (counts) => {
    this.studentsCount = counts;
  },
  error: (err) => console.error('Impossible de récupérer le nombre de students', err)
});
  }

  updatePagination() {
    this.totalPages = Math.ceil(this.formations.length / this.itemsPerPage);
    const startIndex = (this.p - 1) * this.itemsPerPage;
    this.filteredFormations = this.formations.slice(startIndex, startIndex + this.itemsPerPage);
  }

  onPageChange(page: number) {
    this.p = page;
    this.updatePagination();
  }

  getVisiblePages(): number[] {
    let pages = [];
    let start = Math.max(1, this.p - 1);
    let end = Math.min(this.totalPages, start + 2);

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  }

}

