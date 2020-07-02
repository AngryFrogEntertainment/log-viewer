import { NotificationService } from '../notification.service';
import { Injectable } from '@angular/core';
import { ParserService } from '../base/parser.service';
import { ReplaySubject } from 'rxjs';
import { LogEntry } from '../../models/logEntry';

/**
 * Parser service for log files in json format.
 */
@Injectable({
	providedIn: 'root'
})
export class JsonParserService extends ParserService {

	constructor(private notificationService: NotificationService) {
		super('JSON');
	}

	/**
	 * Parses the given `fileContent` to `LogEntry`. Each line is interpreted
	 * as one entry.
	 *
	 * @param fileContent Content of file as string.
	 */
	async parse(fileContent: string) {
		// In case the parser is faster than the subscription we use a replay subject here so
		// the caller gets every entry for sure.
		const logEntrySubject = new ReplaySubject<LogEntry>();
		const lines = fileContent.split('\n');

		if (lines.length === 0) {
			await this.notificationService.showAlert({
				header: 'Info',
				message: 'File seems to be empty.',
				buttons: ['Okay']
			});
		}

		this.parseLines(lines, logEntrySubject).then(() => {
			logEntrySubject.complete();
		});

		return logEntrySubject.asObservable();
	}

	private parseLines(lines: string[], logEntrySubject: ReplaySubject<LogEntry>) {
		return new Promise((resolve, reject) => {
			try {
				let parseErrorCounter = 0;
				let index = 0;
				for (const line of lines) {
					if (!line) {
						console.log(`Line ${index} is empty. Skipping.`);
						continue;
					}

					try {
						const data = JSON.parse(line);
						const entry = new LogEntry(data);
						logEntrySubject.next(entry);
					} catch (error) {
						console.error(`'An unexpected error occured parsing line ${index}`, { error, line });
						parseErrorCounter++;
					}

					index++;
				}

				this._parseErrorCount = parseErrorCounter;
				resolve();
			} catch (error) {
				reject(error);
			}
		});
	}
}
