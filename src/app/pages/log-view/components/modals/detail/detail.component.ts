import { Component, Input } from '@angular/core';
import { LogEntry } from 'src/app/models/logEntry';
import { ModalController } from '@ionic/angular';
import { FilterService } from 'src/app/services/filter.service';

/**
 * This component is used to display a log entries details.
 */
@Component({
	selector: 'app-detail',
	templateUrl: './detail.component.html',
	styleUrls: ['./detail.component.scss'],
})
export class DetailComponent {

	@Input() logEntry: LogEntry;

	getLevelIcon = LogEntry.getLevelIcon;
	getLevelColor = LogEntry.getLevelColor;

	constructor(private modalController: ModalController, private filterService: FilterService) { }

	/**
	 * Closes the modal this component is displayed in.
	 */
	close() {
		this.modalController.dismiss();
	}

	/**
	 * Removes the message of the underlying log entry from the list.
	 */
	removeFromList() {
		this.filterService.addMessageFilter(this.logEntry.message);
		this.close();
	}

	/**
	 * Searches the list for the underlying log entries message.
	 */
	searchForMessage() {
		this.filterService.search(this.logEntry.message);
		this.close();
	}
}
