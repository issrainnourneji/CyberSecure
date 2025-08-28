import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormationServiceService } from '../../../services/services/Formation/formation-service.service';
import { TokenService } from '../../../services/services/token.service';
import { User } from '../../../services/models/user';
import { Role } from '../../../services/models/role';
import { Subscription } from 'rxjs';
import { CartService } from '../../../services/services/cart/cart.service';

@Component({
  selector: 'app-details-formation',
  templateUrl: './details-formation.component.html',
  styleUrl: './details-formation.component.css'
})
export class DetailsFormationComponent {
formation: any;
users: any[] = [];
error:any = null;
formations: any[] = [];

formationId!: number;

numberOfStudents: number = 0;

  isAdmin: boolean = false;
  isClient: boolean = false;
  isAuthenticated: boolean = false;
  private authStatusSub: Subscription | null = null;

constructor(private cartService: CartService,private router: Router, private route: ActivatedRoute,private readonly apiService: TokenService, private formationService: FormationServiceService) {}

ngOnInit(): void {

   this.isAuthenticated = this.apiService.isAuthenticated();
    this.isAdmin = this.apiService.isAdmin();
    this.isClient = this.apiService.isClient();



    this.authStatusSub = this.apiService.authStatuschanged.subscribe(() => {
      this.isAuthenticated = this.apiService.isAuthenticated();
      this.isAdmin = this.apiService.isAdmin();
      this.isClient = this.apiService.isClient();

    })

    const id = Number(this.route.snapshot.paramMap.get('id'));
  if (id) {
    this.formationId = id;

    this.formationService.getFormationById(id).subscribe(
      data => this.formation = data,
      error => console.error('Erreur de récupération formation', error)
    );

    this.loadUsers();
    this.loadNumberOfStudents();
  }

  this.formationService.getAllFormations().subscribe(
      (response) => {
        this.formations = response;

      },
      (error) => {
        console.error('Error fetching formations:', error);
      }
    );
}
loadNumberOfStudents() {
  this.cartService.getNumberOfStudents(this.formationId).subscribe({
    next: (count) => this.numberOfStudents = count,
    error: (err) => console.error('Impossible de récupérer le nombre de students', err)
  });
}
loadUsers(): void {
  if (!this.formationId) return;

  this.formationService.getUsersByFormation(this.formationId).subscribe({
    next: (response) => {
      this.users = response;
    },
    error: (err) => {
      console.error('Impossible de récupérer les users', err);
    }
  });
}

enrollCourse(formationId: number) {
  const userToken = localStorage.getItem('token'); // ou utiliser ton authService
  if (!userToken) {
    alert("Vous devez être connecté pour vous inscrire à une formation !");
    this.router.navigate(['/login']);
    return;
  }
  this.cartService.addToCart(formationId).subscribe({
    next: (res: any) => {
       alert(res.message);
              this.router.navigate(['/panier']);


      // Rediriger seulement si déjà dans le panier
      if (res.message === "Formation déjà dans le panier") {
        this.router.navigate(['/panier']);
      }
    },
    error: err => {
      console.error(err);

      // En cas de 409 => déjà dans le panier
      if (err.status === 409) {
         alert(err.error?.message);
        this.router.navigate(['/panier']);
      } else {
         alert(err.error?.message || 'Impossible d’ajouter la formation au panier.');
      }
    }
  });
}

login(){
    if (this.isAuthenticated) {
      if (this.isAdmin) {
        this.router.navigate(['/homeAdmin']);
      } else if (this.isClient) {
        this.router.navigate(['/homeUser']);
      }
    } else {
      this.router.navigate(['/login']);
    }
  }

}
