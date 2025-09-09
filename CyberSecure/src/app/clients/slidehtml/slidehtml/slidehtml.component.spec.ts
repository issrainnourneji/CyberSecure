import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SlidehtmlComponent } from './slidehtml.component';

describe('SlidehtmlComponent', () => {
  let component: SlidehtmlComponent;
  let fixture: ComponentFixture<SlidehtmlComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SlidehtmlComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SlidehtmlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
