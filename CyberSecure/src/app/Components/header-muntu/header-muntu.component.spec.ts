import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeaderMuntuComponent } from './header-muntu.component';

describe('HeaderMuntuComponent', () => {
  let component: HeaderMuntuComponent;
  let fixture: ComponentFixture<HeaderMuntuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeaderMuntuComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(HeaderMuntuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
