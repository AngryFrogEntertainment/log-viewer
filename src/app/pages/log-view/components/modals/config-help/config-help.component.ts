import { Component } from '@angular/core';
import { ModalController } from '@ionic/angular';

/**
 * This component contains the help text for the configuration.
 */
@Component({
	selector: 'app-config-help',
	templateUrl: './config-help.component.html',
	styleUrls: ['./config-help.component.scss'],
})
export class ConfigHelpComponent {

	constructor(private modalController: ModalController) { }

	/**
	 * Closes the curent help modal.
	 */
	close() {
		this.modalController.dismiss();
	}
}
