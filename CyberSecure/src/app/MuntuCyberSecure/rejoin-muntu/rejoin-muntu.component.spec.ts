import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RejoinMuntuComponent } from './rejoin-muntu.component';

describe('RejoinMuntuComponent', () => {
  let component: RejoinMuntuComponent;
  let fixture: ComponentFixture<RejoinMuntuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RejoinMuntuComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RejoinMuntuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
