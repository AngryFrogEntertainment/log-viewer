import { TestBed } from '@angular/core/testing';

import { JsonParserService } from './json-parser.service';

describe('JsonParserService', () => {
	let service: JsonParserService;

	beforeEach(() => {
		TestBed.configureTestingModule({});
		service = TestBed.inject(JsonParserService);
	});

	it('should be created', () => {
		expect(service).toBeTruthy();
	});
});
