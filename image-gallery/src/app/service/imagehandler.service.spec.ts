import { TestBed } from '@angular/core/testing';

import { ImagehandlerService } from './imagehandler.service';

describe('ImagehandlerService', () => {
  let service: ImagehandlerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ImagehandlerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
