import { TestBed } from '@angular/core/testing';

import { RecepiesService } from './recepies.service';

describe('RecepiesService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: RecepiesService = TestBed.get(RecepiesService);
    expect(service).toBeTruthy();
  });
});
