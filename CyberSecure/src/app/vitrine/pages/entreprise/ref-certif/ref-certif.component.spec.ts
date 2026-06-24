import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RefCertifComponent } from './ref-certif.component';

describe('RefCertifComponent', () => {
  let component: RefCertifComponent;
  let fixture: ComponentFixture<RefCertifComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RefCertifComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RefCertifComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
