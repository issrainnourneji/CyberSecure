import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomevitrineComponent } from './homevitrine.component';

describe('HomevitrineComponent', () => {
  let component: HomevitrineComponent;
  let fixture: ComponentFixture<HomevitrineComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomevitrineComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(HomevitrineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
