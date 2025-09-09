import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormationServiceService } from '../../../services/services/Formation/formation-service.service';
import { SlideService } from '../../../services/services/slide/slide.service';

@Component({
  selector: 'app-list-chapitre',
  templateUrl: './list-chapitre.component.html',
  styleUrl: './list-chapitre.component.css'
})
export class ListChapitreComponent {
formation: any;
formations: any[] = [];

searchTerm: string = '';
p: number = 1;
slideCounts: { [chapitreId: number]: number } = {};
studentsCount: { [key: number]: number } = {};


  constructor(private slideService : SlideService,private route: ActivatedRoute, private formationService: FormationServiceService) {}
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
        this.loadSlideCounts();
        this.formationService.getNumberOfStudentsForAllFormations().subscribe(counts => {
      this.studentsCount = counts;
    });
      },
      (error) => {
        console.error('Error fetching formations:', error);
      }
    );

}

get filteredChapitres() {
  if (!this.formation?.chapitres) return [];
  return this.formation.chapitres.filter((c: { titre: string }) =>
    c.titre.toLowerCase().includes(this.searchTerm.toLowerCase())
  );
}
loadSlideCounts() {
  if (this.formation?.chapitres) {
    this.formation.chapitres.forEach((chapitre: { id: number; titre: string }) => {
      this.slideService.getSlides(chapitre.id).subscribe(slides => {
        this.slideCounts[chapitre.id] = slides.length;
      });
    });
  }
}

}
