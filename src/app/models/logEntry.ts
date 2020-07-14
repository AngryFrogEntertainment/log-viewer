import { ConfigService } from './../services/config.service';
import * as moment from 'moment';

/**
 * Model to represent a log entry.
 */
export class LogEntry {
	private _count = 1;

	/**
	 * Returns the configured timespan property as ISO string.
	 */
	get timestamp() {
		const data = this.getData(ConfigService.appConfig.timestamp);
		try {
			const timestamp = moment(data).toISOString(true);
			return timestamp;
		} catch (error) {
			console.error('Could not create date from data.', error, data);
			return null;
		}
	}

	/**
	 * Returns the configured timespan property as formatted string.
	 */
	get formattedTimestamp() {
		const data = this.getData(ConfigService.appConfig.timestamp);
		try {
			const formattedTimestamp = moment(data).format(ConfigService.appConfig.dateFormat);
			return formattedTimestamp !== 'Invalid Date' ? formattedTimestamp : 'Invalid timestamp key';
		} catch (error) {
			console.error(`Could not create timestamp from data protperty '${ConfigService.appConfig.timestamp}'.`, error, data);
			return 'Invalid timestamp key';
		}
	}

	/**
	 * Returns the configured context value or an empty string if not configured.
	 */
	get context() {
		if (!ConfigService.appConfig.context) {
			return '';
		}

		return this.getData(ConfigService.appConfig.context, 'Invalid context key').toString();
	}

	/**
	 * Returns the configured log level property.
	 */
	get level(): string {
		return this.getData(ConfigService.appConfig.level, 'Invalid level key').toString();
	}

	/**
	 * Returns the configured messages property.
	 */
	get message(): string {
		return this.getData(ConfigService.appConfig.message, 'Invalid message key').toString();
	}

	/**
	 * Returns the configured meta data object.
	 */
	get meta() {
		if (!ConfigService.appConfig.meta) {
			return '';
		}
		// Replace null to remove the other properties
		let data;
		if (ConfigService.appConfig.meta) {
			data = this.getData(ConfigService.appConfig.meta, null);
		}

		if (!data) {
			data = this._data;
		}

		if (typeof data === 'string') {
			data = JSON.parse(data);
		}

		return JSON.stringify(data, null, 2);
	}

	/**
	 * Returns the icon for the current log level.
	 */
	get icon() {
		return LogEntry.getLevelIcon(this.level);
	}

	/**
	 * Returns the color code for the current log level.
	 */
	get iconColor() {
		return LogEntry.getLevelColor(this.level);
	}

	/**
	 * Returns the group count if grouped
	 */
	get count() {
		return this._count;
	}

	/**
	 * Sets the group count for grouping
	 */
	set count(value: number) {
		this._count = value;
	}

	constructor(private _data: any) { }

	/**
	 * Returns colors for log levels as following:
	 *
	 * _'info' or 'information' => success (green)_
	 * _'warn' or 'warning' => warning (yellow)_
	 * _'error' or 'fatal' => danger (red)_
	 *
	 * _Everything else is secondary (blue)_
	 *
	 * @param level the log level the color is for.
	 */
	static getLevelColor(level: string) {
		switch (level) {
			case 'info':
			case 'information':
				return 'success';
			case 'warn':
			case 'warning':
				return 'warning';
			case 'error':
			case 'fatal':
				return 'danger';
			default:
				return 'secondary';
		}
	}

	/**
	 * Returns icons for log levels as following:
	 *
	 * _'info' or 'information' => info circle_
	 * _'warn' or 'warning' => warn sign_
	 * _'error' or 'fatal' => a bug_
	 *
	 * _Everything else => a notification bell_
	 *
	 * @param level the log level the color is for.
	 */
	static getLevelIcon(level: string) {
		switch (level) {
			case 'info':
			case 'information':
				return 'information-circle-outline';
			case 'warn':
			case 'warning':
				return 'warning-outline';
			case 'error':
			case 'fatal':
				return 'bug-outline';
			default:
				return 'notifications-outline';
		}
	}

	private getData(name: string, fallbackValue = 'XXX') {
		try {
			const names = name.split(':');
			let data: any = this._data;
			for (const subName of names) {
				data = data[subName];

				// Maybe one of the subnames is null. So we need to make a cut here.
				if (!data) {
					return fallbackValue;
				}
			}

			return data ? data : fallbackValue;
		} catch (error) {
			console.error('Unexpected error occured during accessing log data.', error);
			return fallbackValue;
		}
	}
}
