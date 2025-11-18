import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactMuntuComponent } from './contact-muntu.component';

describe('ContactMuntuComponent', () => {
  let component: ContactMuntuComponent;
  let fixture: ComponentFixture<ContactMuntuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContactMuntuComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ContactMuntuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
