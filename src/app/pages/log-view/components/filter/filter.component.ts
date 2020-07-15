import { ConfigService } from './../../../../services/config.service';
import { LogService } from './../../../../services/log.service';
import { Component, OnInit, Input } from '@angular/core';
import { LogEntry } from 'src/app/models/logEntry';
import { Filter } from 'src/app/models/filter';
import { FilterService } from 'src/app/services/filter.service';
import { ModalController } from '@ionic/angular';

/**
 * Component to display and apply the various filters.
 */
@Component({
	selector: 'app-filter',
	templateUrl: './filter.component.html',
	styleUrls: ['./filter.component.scss'],
})
export class FilterComponent implements OnInit {
	@Input() isModal = false;

	/**
	 * The currently selected log levels for display.
	 */
	selectedLoglevels: { level: string, isSelected: boolean }[] = [];
	/**
	 * Text to search all log entries.
	 */
	searchText = '';
	/**
	 * Starting date for the timespan that is supposed to be displayed.
	 */
	from = '';
	/**
	 * End date for the timespan that is supposed to be displayed.
	 */
	to = '';
	/**
	 * Minimum date of all log entries.
	 */
	min = '';
	/**
	 * Maximum date of all log entries.
	 */
	max = '';
	/**
	 * If same messages that directly follow each other should be groupped
	 */
	groupSameMsg = false;

	// Make static functions and properties available to the view
	getLevelIcon = LogEntry.getLevelIcon;
	getLevelColor = LogEntry.getLevelColor;
	dateFormat = ConfigService.appConfig.dateFormat;

	constructor(public logService: LogService, public filterService: FilterService, private modalController: ModalController) { }

	ngOnInit() {
		this.logService.entriesCreatedAsObservable.subscribe(entries => {
			if (!entries || entries.length === 0) {
				return;
			}

			this.selectedLoglevels = [];
			this.logService.logLevelCount.forEach((_, key) => {
				this.selectedLoglevels.push({
					level: key,
					isSelected: true
				});
			});

			this.from = this.logService.startDate;
			this.to = this.logService.endDate;
			this.min = this.logService.startDate;
			this.max = this.logService.endDate;
		});

		this.filterService.filterAsObservable.subscribe(filter => {
			if (filter.searchText !== this.searchText) {
				this.searchText = filter.searchText;
			}

			this.selectedLoglevels.forEach(selectedLevel => {
				if (!filter.logLevels || filter.logLevels.length === 0) {
					selectedLevel.isSelected = true;
					return;
				}
				// Only change values that are not the same
				if (selectedLevel.isSelected && !filter.logLevels.includes(selectedLevel.level)) {
					selectedLevel.isSelected = false;
				}
				if (!selectedLevel.isSelected && filter.logLevels.includes(selectedLevel.level)) {
					selectedLevel.isSelected = true;
				}
			});

			if (!filter.from) {
				this.from = this.logService.startDate;
				this.min = this.logService.startDate;
			}

			if (!filter.to) {
				this.to = this.logService.endDate;
				this.max = this.logService.endDate;
			}

			this.groupSameMsg = !!filter.groupSameMsg;
		});
	}

	/**
	 * Creates a new filter from the current input and applies it to the list.
	 */
	createAndApplyFilter() {
		const filter = new Filter();
		filter.logLevels = [];
		this.selectedLoglevels.forEach((value) => {
			if (value.isSelected) {
				filter.logLevels.push(value.level);
			}
		});

		filter.searchText = this.searchText;
		filter.from = this.from;
		filter.to = this.to;
		filter.groupSameMsg = this.groupSameMsg;

		this.filterService.applyFilter(filter);
	}

	/**
	 * Closes the modal if the filters are in modal view.
	 */
	async closeModal() {
		await this.modalController.dismiss();
	}

	/**
	 * Returns if the given `selectedLogLevel` is disabled.
	 *
	 * @param selectedLogLevel The selected log level that is to be checked.
	 */
	isDisabled(selectedLogLevel: { level: string, isSelected: boolean }) {
		const isDisabled = selectedLogLevel.isSelected && this.filterService.filter.logLevels.length === 1;
		return isDisabled;
	}

	/**
	 * Resets the filters back to default
	 */
	reset() {
		this.filterService.reset();
	}
}
