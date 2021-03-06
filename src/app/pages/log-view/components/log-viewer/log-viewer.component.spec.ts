import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { LogViewerComponent } from './log-viewer.component';

describe('LogViewerComponent', () => {
	let component: LogViewerComponent;
	let fixture: ComponentFixture<LogViewerComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [LogViewerComponent],
			imports: [IonicModule.forRoot()]
		}).compileComponents();

		fixture = TestBed.createComponent(LogViewerComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	}));

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
