import { TestBed } from '@angular/core/testing';

import { LocationCountriesService } from './location-countries.service';

describe('LocationCountriesService', () => {
  let service: LocationCountriesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LocationCountriesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
