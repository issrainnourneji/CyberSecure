import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormationServiceService } from '../../../services/services/Formation/formation-service.service';

@Component({
  selector: 'app-list-chapitre',
  templateUrl: './list-chapitre.component.html',
  styleUrl: './list-chapitre.component.css'
})
export class ListChapitreComponent {
formation: any;
formations: any[] = [];


  constructor(private route: ActivatedRoute, private formationService: FormationServiceService) {}
ngOnInit(): void {
  const id = this.route.snapshot.paramMap.get('id');
  if (id) {
    this.formationService.getFormationById(+id).subscribe(
      data => this.formation = data,
      error => console.error('Erreur de récupération formation', error)
    );
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
}
