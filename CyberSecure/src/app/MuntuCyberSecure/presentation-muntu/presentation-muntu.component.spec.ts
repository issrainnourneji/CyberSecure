import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PresentationMuntuComponent } from './presentation-muntu.component';

describe('PresentationMuntuComponent', () => {
  let component: PresentationMuntuComponent;
  let fixture: ComponentFixture<PresentationMuntuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PresentationMuntuComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PresentationMuntuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
