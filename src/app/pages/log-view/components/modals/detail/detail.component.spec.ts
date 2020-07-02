import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { DetailComponent } from './detail.component';

describe('DetailComponent', () => {
	let component: DetailComponent;
	let fixture: ComponentFixture<DetailComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [DetailComponent],
			imports: [IonicModule.forRoot()]
		}).compileComponents();

		fixture = TestBed.createComponent(DetailComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	}));

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
