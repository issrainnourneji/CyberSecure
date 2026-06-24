import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactvitrineComponent } from './contactvitrine.component';

describe('ContactvitrineComponent', () => {
  let component: ContactvitrineComponent;
  let fixture: ComponentFixture<ContactvitrineComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContactvitrineComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ContactvitrineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
