import { TestBed } from '@angular/core/testing';

import { Dati } from './dati';

describe('Dati', () => {
  let service: Dati;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Dati);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
