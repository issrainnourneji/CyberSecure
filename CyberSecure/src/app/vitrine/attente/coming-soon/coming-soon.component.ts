import { AfterViewInit, Component, OnInit } from '@angular/core';
declare var particlesJS: any;

@Component({
  selector: 'app-coming-soon',
  templateUrl: './coming-soon.component.html',
  styleUrls: ['./coming-soon.component.css']
})
export class ComingSoonComponent implements OnInit, AfterViewInit {

  ngOnInit(): void {
    this.loadParticles();
  }

  ngAfterViewInit(): void {
    this.startTypingEffect();
  }

  loadParticles() {
    particlesJS('particles-js', {
      particles: {
        number: { value: 80 },
        color: { value: '#ffffff' },
        shape: { type: 'circle' },
        opacity: { value: 0.5 },
        size: { value: 3 },
        line_linked: {
          enable: true,
          distance: 140,
          color: '#ffffff',
          opacity: 0.3,
          width: 1
        },
        move: { enable: true, speed: 1.8 }
      },
      interactivity: {
        detect_on: 'canvas',
        events: {
          onhover: { enable: true, mode: 'repulse' },
          onclick: { enable: true, mode: 'push' }
        },
        modes: {
          repulse: { distance: 120 },
          push: { particles_nb: 3 }
        }
      },
      retina_detect: true
    });
  }


  startTypingEffect() {
    const message = "De la sécurité numérique à la confiance digitale !";
    const textElement = document.getElementById('typed-text');
    let idx = 0;

    const type = () => {
      if (!textElement || idx >= message.length) return;
      textElement.textContent += message.charAt(idx);
      idx++;
      setTimeout(type, 60);
    };

    type();
  }
}
