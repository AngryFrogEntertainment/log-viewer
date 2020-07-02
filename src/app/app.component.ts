import { environment } from './../environments/environment';
import { NotificationService } from './services/notification.service';
import { ConfigComponent } from './pages/log-view/components/config/config.component';
import { ConfigHelpComponent } from './pages/log-view/components/modals/config-help/config-help.component';
import { Component, OnInit, ViewChild } from '@angular/core';

import { Platform, ModalController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

@Component({
	selector: 'app-root',
	templateUrl: 'app.component.html',
	styleUrls: ['app.component.scss']
})
export class AppComponent implements OnInit {

	@ViewChild('config') configComponent: ConfigComponent;

	version = environment.version;

	constructor(
		private platform: Platform,
		private splashScreen: SplashScreen,
		private statusBar: StatusBar,
		private modalController: ModalController
	) {
		this.initializeApp();
	}

	initializeApp() {
		this.platform.ready().then(() => {
			this.statusBar.styleDefault();
			this.splashScreen.hide();
		});
	}

	ngOnInit() {
		console.log('Platforms: ', this.platform.platforms());
	}

	async showConfigHelp() {
		const modal = await this.modalController.create({
			component: ConfigHelpComponent
		});
		await modal.present();
	}
}
