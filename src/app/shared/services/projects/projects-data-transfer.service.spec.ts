import { TestBed } from '@angular/core/testing';

import { ProjectsDataTransferService } from './projects-data-transfer.service';

describe('ProjectsDataTransferService', () => {
  let service: ProjectsDataTransferService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProjectsDataTransferService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
