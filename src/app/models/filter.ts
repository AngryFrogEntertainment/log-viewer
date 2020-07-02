/**
 * Model to represent a log list filter.
 */
export class Filter {
	/**
	 * The log levels that are supposed to be displayed.
	 */
	logLevels: string[] = [];
	/**
	 * Searchtext to look up in messages and text.
	 */
	searchText: string;
	/**
	 * Beginning of timespan
	 */
	from: string;
	/**
	 * End of timespan
	 */
	to: string;
	/**
	 * Messages that should be filtered out.
	 */
	messageFilters: string[];
}
