import { TestBed } from '@angular/core/testing';

import { Banca } from './banca';

describe('Banca', () => {
  let service: Banca;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Banca);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
