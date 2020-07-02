import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ConfigHelpComponent } from './config-help.component';

describe('ConfigHelpComponent', () => {
	let component: ConfigHelpComponent;
	let fixture: ComponentFixture<ConfigHelpComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [ConfigHelpComponent],
			imports: [IonicModule.forRoot()]
		}).compileComponents();

		fixture = TestBed.createComponent(ConfigHelpComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	}));

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
