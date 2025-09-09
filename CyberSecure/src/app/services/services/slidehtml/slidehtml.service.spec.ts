import { TestBed } from '@angular/core/testing';

import { SlidehtmlService } from './slidehtml.service';

describe('SlidehtmlService', () => {
  let service: SlidehtmlService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SlidehtmlService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
