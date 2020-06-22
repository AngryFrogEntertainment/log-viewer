import { LogService } from './../../../../services/log.service';
import { FilterService } from './../../../../services/filter.service';
import { DetailComponent } from '../modals/detail/detail.component';
import { LogEntry } from '../../../../models/logEntry';
import { Component, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
	selector: 'app-log-viewer',
	templateUrl: './log-viewer.component.html',
	styleUrls: ['./log-viewer.component.scss'],
})
export class LogViewerComponent {

	@Input() page: LogEntry[] = [];

	constructor(private modalController: ModalController, public filterService: FilterService, public logService: LogService) { }

	/**
	 *
	 * @param index
	 */
	async showDetails(index: number) {
		console.log(index);
		const modal = await this.modalController.create({
			component: DetailComponent,
			componentProps: {
				'logEntry': this.page[index]
			}
		});
		await modal.present();
	}
}
