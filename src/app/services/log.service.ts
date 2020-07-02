import { async } from '@angular/core/testing';
import { AppConfig } from './../models/appConfig';
import { BehaviorSubject } from 'rxjs';
import { FilterService } from './filter.service';
import { NotificationService } from './notification.service';
import { ConfigService } from './config.service';
import { FileService } from './file.service';
import { Injectable, Inject } from '@angular/core';
import { LogEntry } from '../models/logEntry';
import { Filter } from '../models/filter';
import { ParserService } from './base/parser.service';

@Injectable({
	providedIn: 'root'
})
export class LogService {

	private $pagesCreated = new BehaviorSubject<LogEntry[][]>([]);
	private $entriesCreated = new BehaviorSubject<LogEntry[]>([]);

	private _logEntries: LogEntry[] = [];
	private _filteredCount = 0;
	private _logEntryPages: LogEntry[][] = [];
	private _logLevelCount = new Map<string, number>();
	private _pageCount = 0;
	private _parseErrorCount = 0;
	private _hasParsedFile = false;
	private _isParsing = false;
	private _startDate: string;
	private _endDate: string;
	private _lastConfig: AppConfig;

	/**
	 * Returns the current paged log entries.
	 */
	get logEntryPages() {
		return this._logEntryPages;
	}

	/**
	 * Returns the current page count.
	 */
	get pageCount() {
		return this._pageCount;
	}

	/**
	 * Returns the current page size.
	 */
	get pageSize() {
		return ConfigService.appConfig.pageSize;
	}

	/**
	 * Returns all used log levels and their appearance count.
	 */
	get logLevelCount() {
		return this._logLevelCount;
	}

	/**
	 * The created pages as observable.
	 */
	get pagesCreatedAsObservable() {
		return this.$pagesCreated.asObservable();
	}

	/**
	 * All created log entries as observable.
	 */
	get entriesCreatedAsObservable() {
		return this.$entriesCreated.asObservable();
	}

	/**
	 * Total count of log entries.
	 */
	get totalCount() {
		return this._logEntries ? this._logEntries.length : 0;
	}

	/**
	 * Total count of filtered log entries.
	 */
	get filteredCount() {
		return this._filteredCount;
	}

	/**
	 * Total count of lines that could not be parsed. Hopefully none ;)
	 */
	get parseErrorCount() {
		return this._parseErrorCount;
	}

	/**
	 * Returns if there is a parsed logfile or not.
	 */
	get hasParsedFile() {
		return this._hasParsedFile;
	}

	/**
	 * True while parsing otherwise false.
	 */
	get isParsing() {
		return this._isParsing;
	}

	/**
	 * The start date of all log entries.
	 */
	get startDate() {
		return this._startDate;
	}

	/**
	 * The end date of all log entries.
	 */
	get endDate() {
		return this._endDate;
	}

	/**
	 * Returns the list of available parser formats.
	 */
	get parserFormats() {
		const formats: string[] = [];
		this.parsers.forEach(value => formats.push(value.format));
		return formats;
	}

	constructor(
		private fileService: FileService,
		private notificationService: NotificationService,
		private filterService: FilterService,
		private configService: ConfigService,
		@Inject(ParserService) private parsers: ParserService[]) {
		this.subscribeObservables();
	}

	/**
	 * Opens and reads the given `log-`file` and parses its contents to log entries
	 * which will be organized in pages.
	 *
	 * @param file The log file that is to be parsed.
	 */
	async openLogFile(file: File | string) {
		this._isParsing = true;
		this._hasParsedFile = false;
		this._parseErrorCount = 0;
		this._logEntries = [];
		this._logEntryPages = [];
		this.filterService.applyFilter(new Filter()); // Reset filters in case we had a previously filtered file

		let loading;
		try {
			const format = await this.getFormat();
			loading = await this.notificationService.showLoadingIndication('Reading log file. Depending on file size this might take some time ;)');
			const content = await this.fileService.readAsText(file);
			loading.message = 'Parsing file...';
			await this.parse(content, format);
			await loading.dismiss();
			this.setDates();
			this.$entriesCreated.next(this._logEntries);
			await this.createPages();
			this._hasParsedFile = true;
		} catch (error) {
			if (loading) { await loading.dismiss(); }
			console.error('An unexpected error occured reading log file.', error);
			await this.notificationService.showAlert({
				header: 'Error',
				message: 'Oooops. Sorry, that did not work as expected.',
				buttons: ['Okay']
			});
			this._hasParsedFile = false;
		}
		if (this._parseErrorCount > 0) {
			await this.notificationService.showAlert({
				header: 'Warning',
				message: `Oooops. ${this._parseErrorCount} line${this._parseErrorCount > 1 ? 's' : ''} could not be parsed.
				 See console for further information.`,
				buttons: ['Okay']
			});
		}

		this._isParsing = false;
	}

	/**
	 * Creates pages for the current log entries under consideration of the given `filter`.
	 *
	 * @param filter Filter that is to be applied to the log entries.
	 */
	async createPages(filter?: Filter) {
		const loading = await this.notificationService.showLoadingIndication('Applying filters to list');
		const entries = this.getFilteredEntries(filter);
		this._filteredCount = entries.length;
		this._pageCount = Math.ceil(entries.length / this.pageSize);
		loading.message = `Creating ${this.pageCount} pages for ${entries.length} entries.`;
		console.log(`Creating ${this.pageCount} pages with ${this.pageSize} elements from ${entries.length} entries.`);

		let elementCount = 0;
		this._logEntryPages = [];
		for (let i = 0; i < this.pageCount; i++) {
			const start = i * this.pageSize;
			const end = start + this.pageSize < entries.length ? start + this.pageSize : entries.length;
			const page = entries.slice(start, end);
			console.log(`Start: ${start}, End: ${end}, Pagelength: ${page.length}`);
			elementCount += page.length;
			console.log(`Created page ${i} of ${this.pageCount}. Element count = ${elementCount}`);
			this._logEntryPages.push(page);
		}

		this.$pagesCreated.next(this._logEntryPages);
		await loading.dismiss();
	}

	private subscribeObservables() {
		this.filterService.filterAsObservable.subscribe(async filter => {
			if (!this._logEntries || this._logEntries.length === 0) {
				return;
			}

			await this.createPages(filter);
		});

		this.configService.configAsObservable.subscribe(async config => {
			if (this._lastConfig && this.logEntryPages && this.logEntryPages.length > 0) {
				// If the level changed, we need to get the different log levels again
				if (this._lastConfig.level !== config.level) {
					await this.recountLogLevels();
					this.$pagesCreated.next(this._logEntryPages);
				}

				// Page size change? Then we need to create the pages again
				if (this._lastConfig.pageSize !== config.pageSize) {
					await this.createPages();
				}

				// Timestamp changed? We need to reset the start and end dates
				if (this._lastConfig.timestamp !== config.timestamp) {
					this.setDates();
					this.$pagesCreated.next(this._logEntryPages);
				}
			}


			this._lastConfig = config;
		});
	}

	private countEntryLevel(entry: LogEntry) {
		let count = 0;

		if (this._logLevelCount.has(entry.level)) {
			count = this._logLevelCount.get(entry.level);
		}

		if (count === 0) {
			this.filterService.filter.logLevels.push(entry.level);
		}

		this._logLevelCount.set(entry.level, count + 1);
	}

	private getFilteredEntries(filter: Filter) {
		console.log('Applying filters to entry list.', filter);
		if (!this.filterService.isFiltered(filter, this.startDate, this.endDate)) {
			console.log('No active filters. Returning whole list.', filter);
			return this._logEntries;
		}

		return this._logEntries.filter(entry => {
			try {
				// Log level not included
				if (filter.logLevels
					&& filter.logLevels.length > 0
					&& !filter.logLevels.includes(entry.level)) {
					return false;
				}

				// Searchtext not included
				if (filter.searchText
					&& !entry.message.toLowerCase().includes(filter.searchText.toLowerCase())
					&& (!entry.context || !entry.context.toLowerCase().includes(filter.searchText.toLowerCase()))) {
					return false;
				}

				// Smaller than from
				if (filter.from && filter.from !== this._startDate && new Date(entry.timestamp) < new Date(filter.from)) {
					return false;
				}

				// Bigger than to
				if (filter.to && filter.to !== this._endDate && new Date(entry.timestamp) > new Date(filter.to)) {
					return false;
				}

				// Is one of the filtered out messages (Search filter includes, message filter excludes)
				if (filter.messageFilters && filter.messageFilters.includes(entry.message)) {
					return false;
				}
			} catch (error) {
				console.error('Could not correctly filter log entry. It will still be displayed.', error);
			}

			// I know that it just could have been one big bool expression, but i decided for readability
			// and less complexity
			return true;
		});
	}

	private setDates() {
		const firstDate = this._logEntries[0].timestamp;
		const lastDate = this._logEntries[this._logEntries.length - 1].timestamp;

		if (firstDate < lastDate) {
			this._startDate = firstDate;
			this._endDate = lastDate;
		} else {
			this._startDate = lastDate;
			this._endDate = firstDate;
		}
	}

	private async recountLogLevels() {
		const loading = await this.notificationService.showLoadingIndication('Recounting log levels...');
		this._logLevelCount = new Map<string, number>();

		for (const entry of this._logEntries) {
			this.countEntryLevel(entry);
		}
		await loading.dismiss();
	}

	private parse(content: string, format: string) {
		return new Promise(async (resolve, reject) => {
			this._logLevelCount = new Map<string, number>();
			const parser = this.getParser(format);
			(await parser.parse(content)).subscribe(
				logEntry => {
					this.countEntryLevel(logEntry);
					this._logEntries.push(logEntry);
				},
				async error => {
					reject(error);
				},
				async () => {
					this._parseErrorCount = parser.parseErrorCount;
					resolve();
				});
		});
	}

	private getFormat() {
		return new Promise<string>(async (resolve, reject) => {
			const parserFormats = this.parserFormats;
			if (parserFormats.length > 1) {
				const inputs = this.getFormatInputs(parserFormats);
				await this.notificationService.showAlert({
					header: 'Log format',
					message: 'Choose one of the following log formats',
					inputs: inputs,
					buttons: [
						{
							text: 'Ok',
							handler: () => {
								const checkedFormat = inputs.find(value => value.checked);
								resolve(checkedFormat.value);
							}
						}
					]
				});
			} else if (parserFormats.length === 1) {
				resolve(parserFormats[0]);
			} else {
				reject(new Error('No formats available. Someone broke it!'));
			}
		});
	}

	private getFormatInputs(parserFormats: string[]) {
		const inputs = [];
		for (let i = 0; i < parserFormats.length; i++) {
			inputs.push({
				name: parserFormats[i],
				type: 'radio',
				label: parserFormats[i],
				value: parserFormats[i],
				checked: i === 0
			});
		}
		return inputs;
	}

	private getParser(format: string) {
		const parser = this.parsers.find(value => value.format === format);

		if (!parser) {
			throw new Error(`No parser found for format '${format}'`);
		}

		return parser;
	}
}
