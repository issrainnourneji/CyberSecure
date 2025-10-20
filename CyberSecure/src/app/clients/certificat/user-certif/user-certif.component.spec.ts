import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserCertifComponent } from './user-certif.component';

describe('UserCertifComponent', () => {
  let component: UserCertifComponent;
  let fixture: ComponentFixture<UserCertifComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserCertifComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UserCertifComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
