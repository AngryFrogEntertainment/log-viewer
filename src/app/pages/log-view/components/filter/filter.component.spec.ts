import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { FilterComponent } from './filter.component';

describe('FilterComponent', () => {
	let component: FilterComponent;
	let fixture: ComponentFixture<FilterComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [FilterComponent],
			imports: [IonicModule.forRoot()]
		}).compileComponents();

		fixture = TestBed.createComponent(FilterComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	}));

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
