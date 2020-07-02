import { FilterComponent } from './components/filter/filter.component';
import { ModalController } from '@ionic/angular';
import { ConfigService } from './../../services/config.service';
import { LogEntry } from './../../models/logEntry';
import { NotificationService } from './../../services/notification.service';
import { LogService } from './../../services/log.service';
import { Component } from '@angular/core';

/**
 * This is the main page for the log view.
 */
@Component({
	selector: 'app-log-view',
	templateUrl: './log-view.page.html',
	styleUrls: ['./log-view.page.scss'],
})
export class LogViewPage {
	/**
	 * Current page
	 */
	page = 1;
	/**
	 * Is there a file dragged over the dropzone?
	 */
	isDraggedOver = false;

	// Let the view know about the static functions
	getLevelIcon = LogEntry.getLevelIcon;
	getLevelColor = LogEntry.getLevelColor;

	constructor(public logService: LogService,
		private notificationService: NotificationService,
		public configService: ConfigService,
		private modalController: ModalController) {
		this.subscribeObservables();
	}

	/**
	 * Sets the current page of the paged logentries.
	 *
	 * @param page The page that is supposed to be displayed.
	 */
	async setPage(page: number) {
		const loading = await this.notificationService.showLoadingIndication(`Loading page ${page}`);
		this.page = page <= this.logService.pageCount
			? (page > 0 ? page : 1)
			: this.logService.pageCount;
		await loading.dismiss();
	}

	/**
	 * Event handler for a file drag.
	 *
	 * @param ev DragEvent
	 * @param isOver Is the the cursor over the dropzone?
	 */
	onDrag(ev: DragEvent, isOver: boolean) {
		ev.preventDefault();
		ev.stopPropagation();
		this.isDraggedOver = isOver;
	}

	/**
	 * Event handler for a file drop.
	 *
	 * @param ev DragEvent.
	 */
	async onDrop(ev: DragEvent) {
		ev.preventDefault();
		ev.stopPropagation();
		this.isDraggedOver = false;

		if (ev.dataTransfer.files.length === 0) {
			console.warn('No file dropped');
			return;
		}

		await this.logService.openLogFile(ev.dataTransfer.files[0]);
	}

	/**
	 * Opens the filter options as modal dialog.
	 */
	async openFilterModal() {
		const modal = await this.modalController.create({
			component: FilterComponent,
			componentProps: {
				'isModal': true
			},
			cssClass: 'filter-modal'
		});
		await modal.present();
	}

	private subscribeObservables() {
		this.logService.pagesCreatedAsObservable.subscribe(pages => {
			if (pages.length > 0 && pages.length < this.page) {
				this.page = pages.length;
			}
		});
		this.logService.entriesCreatedAsObservable.subscribe(() => {
			this.page = 1;
		});
	}
}
