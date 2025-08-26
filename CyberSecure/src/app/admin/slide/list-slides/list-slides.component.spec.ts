import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListSlidesComponent } from './list-slides.component';

describe('ListSlidesComponent', () => {
  let component: ListSlidesComponent;
  let fixture: ComponentFixture<ListSlidesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListSlidesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ListSlidesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
