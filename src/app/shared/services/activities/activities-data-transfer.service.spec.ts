import { TestBed } from '@angular/core/testing';

import { ActivitiesDataTransferService } from './activities-data-transfer.service';

describe('ActivitiesDataTransferService', () => {
  let service: ActivitiesDataTransferService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ActivitiesDataTransferService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
