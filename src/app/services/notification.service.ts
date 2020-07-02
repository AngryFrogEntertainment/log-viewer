import { Injectable } from '@angular/core';
import { LoadingController, AlertController } from '@ionic/angular';
import { AlertOptions } from '@ionic/core';

/**
 * Wrapper service for the used ionic user notifications.
 */
@Injectable({
	providedIn: 'root'
})
export class NotificationService {

	constructor(private loadingController: LoadingController, private alertController: AlertController) { }

	/**
	 * Creates and shows a loading indication with the given `message`.
	 *
	 * @param message The message that is to be displayed.
	 */
	async showLoadingIndication(message?: string) {
		const loading = await this.loadingController.create();
		loading.message = message;

		await loading.present();
		return loading;
	}

	/**
	 * Shows an alert with the given `opts`.
	 *
	 * @param opts The ionic alert options.
	 */
	async showAlert(opts?: AlertOptions) {
		const alert = await this.alertController.create(opts);
		await alert.present();
	}
}
