import { Injectable } from '@angular/core';
import { Filter } from '../models/filter';
import { BehaviorSubject } from 'rxjs';

/**
 * Service to handle the configuration of filters for log entries.
 */
@Injectable({
	providedIn: 'root'
})
export class FilterService {
	private $filter = new BehaviorSubject<Filter>(new Filter());

	/**
	 * Returns the currently applied filter.
	 */
	get filter() {
		return this.$filter.value;
	}

	/**
	 * Returns the applied filter as observable.
	 */
	get filterAsObservable() {
		return this.$filter.asObservable();
	}

	constructor() { }

	/**
	 * Applies the given partial `filter` and merges it with the already
	 * configured options.
	 *
	 * @param filter New filter values.
	 */
	applyFilter(filter: Filter) {
		const newFilter = new Filter();
		newFilter.logLevels = filter.logLevels && filter.logLevels.length > 0 ? filter.logLevels : this.filter.logLevels;
		newFilter.searchText = filter.searchText;
		newFilter.from = filter.from ? filter.from : this.filter.from;
		newFilter.to = filter.to ? filter.to : this.filter.to;
		newFilter.messageFilters = filter.messageFilters && filter.messageFilters.length > 0 ? filter.messageFilters : this.filter.messageFilters;

		// We only need to apply it if it has really changed otherwise we calculate the pages again for nothing.
		if (this.hasFilterChanged(newFilter)) {
			this.$filter.next(newFilter);
		}
	}

	/**
	 * Applies a filtration for a single log level. All other options will be merged.
	 *
	 * @param level The single log level that is to be displayed.
	 */
	applyLevelFilter(level: string) {
		const filter = new Filter();
		filter.logLevels = [level];
		this.applyFilter(filter);
	}

	/**
	 * Adds a message filter so the given `message`is filtered out.
	 *
	 * **NOTE: The exact opposite of the search text.**
	 *
	 * **NOTE: Can have multiple filtered messages.**
	 *
	 * @param message The message that is to be filtered out.
	 */
	addMessageFilter(message: string) {
		const filter = new Filter();
		filter.messageFilters = [];
		if (this.filter.messageFilters && this.filter.messageFilters.length > 0) {
			this.filter.messageFilters.forEach(value => filter.messageFilters.push(value));
		}
		filter.messageFilters.push(message);
		this.applyFilter(filter);
	}

	/**
	 * Removes the filtration of the given message.
	 *
	 * @param message The message that is to be displayed again.
	 */
	removeMessageFilter(message: string) {
		if (!this.filter.messageFilters || this.filter.messageFilters.length === 0) {
			return;
		}

		const filter = new Filter();
		filter.messageFilters = [];
		this.filter.messageFilters.forEach(value => {
			if (value !== message) {
				filter.messageFilters.push(value);
			}
		});
		this.applyFilter(filter);
	}

	/**
	 * Searches the log messages for the given `searchText`.
	 *
	 * @param searchText SearchText that is to be looked for in the messages.
	 */
	search(searchText: string) {
		const filter = new Filter();
		filter.searchText = searchText;
		this.applyFilter(filter);
	}

	/**
	 * Checks if the given filter is filtering anything.
	 *
	 * **NOTE: Needs the start and end date since they are the default values inside a filter**
	 *
	 * @param filter The filter that is to be checked.
	 * @param startDate The start date of all entries.
	 * @param endDate The end date of all entries.
	 */
	isFiltered(filter: Filter, startDate: string, endDate: string) {
		if (!filter) {
			return false;
		}

		return (filter.logLevels && filter.logLevels.length > 0)
			|| (filter.searchText)
			|| (filter.from && filter.from !== startDate)
			|| (filter.to && filter.to !== endDate)
			|| (filter.messageFilters && filter.messageFilters.length > 0);
	}

	/**
	 * Determines if the given filter is any different from the already applied one.
	 *
	 * @param newFilter The new filter that is supposed to be checked if it changes something.
	 */
	hasFilterChanged(newFilter: Filter) {
		// Readability ;)

		// Undefined or null
		if ((!newFilter && this.filter) || (newFilter && !this.filter)) {
			return true;
		}

		if (!newFilter && !this.filter) {
			return false;
		}

		// Simple properties check
		if (newFilter.from !== this.filter.from
			|| newFilter.to !== this.filter.to
			|| newFilter.searchText !== this.filter.searchText) {
			return true;
		}

		// Array checks
		if (this.hasArrayChanged(newFilter.logLevels, this.filter.logLevels)
			|| this.hasArrayChanged(newFilter.messageFilters, this.filter.messageFilters)) {
			return true;
		}

		return false;
	}

	private hasArrayChanged(left: string[], right: string[]) {
		if ((!left && right) || (left && !right)) {
			return true;
		}

		if (!left && !right) {
			return false;
		}

		if (left.length !== right.length) {
			return true;
		}

		for (const entry of left) {
			if (!right.includes(entry)) {
				return true;
			}
		}

		return false;
	}
}
