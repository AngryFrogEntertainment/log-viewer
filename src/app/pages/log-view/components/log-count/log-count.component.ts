import { FilterService } from './../../../../services/filter.service';
import { LogService } from './../../../../services/log.service';
import { Component, OnInit } from '@angular/core';
import { LogEntry } from 'src/app/models/logEntry';

/**
 * Component to display the different log lovels and their count.
 */
@Component({
	selector: 'app-log-count',
	templateUrl: './log-count.component.html',
	styleUrls: ['./log-count.component.scss'],
})
export class LogCountComponent implements OnInit {

	getLevelIcon = LogEntry.getLevelIcon;
	getLevelColor = LogEntry.getLevelColor;

	logLevelCount = [];

	constructor(public logService: LogService, public filterService: FilterService) {
		console.log('Log levels', JSON.stringify(logService.logLevelCount));
	}

	ngOnInit() {
		this.logService.entriesCreatedAsObservable.subscribe(entries => {
			if (!entries || entries.length === 0) {
				return;
			}

			this.logLevelCount = [];
			this.logService.logLevelCount.forEach((count, key) => {
				this.logLevelCount.push({
					level: key,
					count: count
				});
			});
		});
	}
}
