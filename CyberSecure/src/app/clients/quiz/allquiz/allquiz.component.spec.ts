import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllquizComponent } from './allquiz.component';

describe('AllquizComponent', () => {
  let component: AllquizComponent;
  let fixture: ComponentFixture<AllquizComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AllquizComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AllquizComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
