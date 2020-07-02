import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { LogViewPage } from './log-view.page';

describe('LogViewPage', () => {
	let component: LogViewPage;
	let fixture: ComponentFixture<LogViewPage>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [LogViewPage],
			imports: [IonicModule.forRoot()]
		}).compileComponents();

		fixture = TestBed.createComponent(LogViewPage);
		component = fixture.componentInstance;
		fixture.detectChanges();
	}));

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
