import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';


interface Testimonial {
  name: string;
  role: string;
  text: string;
  image: string;
}
@Component({
  selector: 'app-homevitrine',
  templateUrl: './homevitrine.component.html',
  styleUrl: './homevitrine.component.css'
})
export class HomevitrineComponent implements OnInit {
  currentLang: 'fr' | 'en' = 'fr';

  constructor(private translate: TranslateService) {}

  ngOnInit() {
    this.currentLang = (localStorage.getItem('lang') as 'fr' | 'en') || 'fr';
    this.translate.use(this.currentLang);
  }

  changeLang(lang: 'fr' | 'en') {
    this.currentLang = lang;
    this.translate.use(lang);
    localStorage.setItem('lang', lang);
  }

isMenuOpen = false;

  openSubmenu: { [key: string]: boolean } = {
    solutions: false,
    entreprise: false,
    contenus: false,
    temoignages: false
  };

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  closeMenu() {
    this.isMenuOpen = false;
  }

  toggleSubmenu(key: string) {
    this.openSubmenu[key] = !this.openSubmenu[key];
  }
  current = 0;

  testimonials: Testimonial[] = [
    {
      name: "Nicolas Chabanoles",
      role: "CTO chez Bonitasoft",
      text: `Nous apprécions beaucoup l’expertise apportée par Saghar dans
             ses conseils et son approche. […] Une vraie éducation des
             collaborateurs a été mise en place et cela a été très apprécié
             par les équipes.`,
      image: "assets/images/news/client.jpg"
    },
    {
      name: "Alexis Morel",
      role: "Directeur IT chez Softlabs",
      text: `Un accompagnement extrêmement professionnel, une pédagogie
             exemplaire, et des résultats mesurables.`,
      image: "assets/images/news/client2.jpg"
    },
    {
      name: "Marie Dupont",
      role: "Responsable Qualité chez TechData",
      text: `Une expertise indiscutable et une capacité rare à s’adapter
             au contexte du client.`,
      image: "assets/images/news/client3.jpg"
    }
  ];

  goNext() {
    this.current = (this.current + 1) % this.testimonials.length;
  }

  goPrev() {
    this.current = (this.current - 1 + this.testimonials.length) % this.testimonials.length;
  }

  goToSlide(index: number) {
    this.current = index;
  }
}
