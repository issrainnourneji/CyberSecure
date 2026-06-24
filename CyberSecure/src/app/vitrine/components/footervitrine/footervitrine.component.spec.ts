import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FootervitrineComponent } from './footervitrine.component';

describe('FootervitrineComponent', () => {
  let component: FootervitrineComponent;
  let fixture: ComponentFixture<FootervitrineComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FootervitrineComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FootervitrineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
