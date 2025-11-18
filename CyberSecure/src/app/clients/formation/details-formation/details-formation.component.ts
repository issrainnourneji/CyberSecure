import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormationServiceService } from '../../../services/services/Formation/formation-service.service';
import { TokenService } from '../../../services/services/token.service';
import { User } from '../../../services/models/user';
import { Role } from '../../../services/models/role';
import { Subscription } from 'rxjs';
import { CartService } from '../../../services/services/cart/cart.service';
import { CertificationService } from '../../../services/services/certificat/certification.service';

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

modalVisible = false;
  modalMessage = '';
  modalCallback: (() => void) | null = null;

  isAdmin: boolean = false;
  isClient: boolean = false;
  isAuthenticated: boolean = false;
  private authStatusSub: Subscription | null = null;

constructor(private cartService: CartService,private router: Router,
   private route: ActivatedRoute,private readonly apiService: TokenService,
    private formationService: FormationServiceService,
  private certificationService :  CertificationService) {}

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

 showModal(message: string, callback?: () => void) {
    this.modalMessage = message;
    this.modalVisible = true;
    this.modalCallback = callback || null;
  }

  closeModal() {
    this.modalVisible = false;
    if (this.modalCallback) {
      this.modalCallback(); // exécute la redirection ou autre action
    }
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

      // 🔹 Vérifier pour chaque user si il a une certif pour cette formation
      this.users.forEach(user => {
        this.certificationService.getCertificationsByUserAndFormation(user.id, this.formationId)
          .subscribe({
            next: (certifs) => {
              user.hasCertification = certifs && certifs.length > 0;
            },
            error: (err) => console.error("Erreur certif user pour formation:", err)
          });
      });

    },
    error: (err) => console.error('Impossible de récupérer les users', err)
  });
}



enrollCourse(formationId: number) {
  const userToken = localStorage.getItem('token');
  if (!userToken) {
    this.showModal("Vous devez être connecté pour vous inscrire à une formation !", () => {
      this.router.navigate(['/login']);
    });
    return;
  }

  if (this.apiService.isAdmin()) {
    this.showModal("Un administrateur ne peut pas s'inscrire à une formation !");
    return;
  }

  this.cartService.addToCart(formationId).subscribe({
    next: (res: any) => {
      this.showModal(res.message, () => {
        this.router.navigate(['/mainUser/panier']);
      });
    },
    error: err => {
      console.error(err);
      if (err.status === 409) {
        this.showModal(err.error?.message || 'Formation déjà dans le panier.', () => {
          this.router.navigate(['/mainUser/panier']);
        });
      } else {
        this.showModal(err.error?.message || 'Impossible d’ajouter la formation au panier.');
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
