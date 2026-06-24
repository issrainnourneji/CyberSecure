import { Component, OnInit } from '@angular/core';
import { TokenService } from '../../services/services/token.service';
import { FormationServiceService } from '../../services/services/Formation/formation-service.service';
import { User } from '../../services/models/user';
import { Role } from '../../services/models/role';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-course',
  templateUrl: './course.component.html',
  styleUrl: './course.component.css'
})
export class CourseComponent implements OnInit {

  users: any[] = [];
  error: any = null;

  formations: any[] = [];
  filteredFormations: any[] = [];
  chapitres: any[] = [];
  studentsCount: { [formationId: number]: number } = {};

  searchTerm: string = '';
  itemsPerPage = 6;
  p = 1;
  totalPages = 1;

  constructor(
    private readonly apiService: TokenService,
    private formationService: FormationServiceService,
     private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
      this.route.params.subscribe(params => {
    const cat = params['cat']; 

    if (cat) {
      this.formationService.getFormationsByCategory(cat).subscribe({
        next: (data) => {
          this.formations = data;
          this.filteredFormations = [...this.formations];
          this.p = 1;
          this.updatePagination();
        },
        error: (err) => console.error('Erreur lors du filtrage par catégorie', err)
      });
    } else {
    this.formationService.getAllFormations().subscribe({
      next: (response) => {
        this.formations = response;
        this.filteredFormations = [...this.formations];
        this.updatePagination();
      },
      error: (error) => console.error('Error fetching formations:', error)
    });
     }
  });

    this.formationService.getNumberOfStudentsForAllFormations().subscribe({
      next: (counts) => this.studentsCount = counts,
      error: (err) => console.error('Impossible de récupérer le nombre de students', err)
    });

    this.loadUsers();
  }

  loadUsers(): void {
    this.apiService.getAllUsers().subscribe({
      next: (response) => {
        this.users = (response.userList || []).filter((user: User) => user.role === Role.USER);
      },
      error: (err) => {
        this.error = err?.error?.message || 'unable to get users';
      }
    });
  }

  onSearchChange() {
    this.filteredFormations = this.formations.filter(f =>
      f.title.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
    this.p = 1;
    this.updatePagination();
  }

  get paginatedFormations() {
    const start = (this.p - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    this.totalPages = Math.ceil(this.filteredFormations.length / this.itemsPerPage);
    return this.filteredFormations.slice(start, end);
  }

  getVisiblePages() {
    const pages = [];
    const maxVisible = 3;
    let start = Math.max(this.p - 1, 1);
    let end = Math.min(start + maxVisible - 1, this.totalPages);
    for (let i = start; i <= end; i++) pages.push(i);
    return pages;
  }

  updatePagination() {
    this.totalPages = Math.ceil(this.filteredFormations.length / this.itemsPerPage);
  }
}
