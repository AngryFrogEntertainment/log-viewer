import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { LogCountComponent } from './log-count.component';

describe('LogCountComponent', () => {
	let component: LogCountComponent;
	let fixture: ComponentFixture<LogCountComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [LogCountComponent],
			imports: [IonicModule.forRoot()]
		}).compileComponents();

		fixture = TestBed.createComponent(LogCountComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	}));

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
