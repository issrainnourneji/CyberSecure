import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormationClientListComponent } from './formation-client-list.component';

describe('FormationClientListComponent', () => {
  let component: FormationClientListComponent;
  let fixture: ComponentFixture<FormationClientListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormationClientListComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FormationClientListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
