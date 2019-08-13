import { TestBed } from '@angular/core/testing';

import { PublishSubcribeService } from './publish-subcribe.service';

describe('PublishSubcribeService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PublishSubcribeService = TestBed.get(PublishSubcribeService);
    expect(service).toBeTruthy();
  });
});
