import { Observable } from 'rxjs';
import { LogEntry } from 'src/app/models/logEntry';

/**
 * Abstract base class for parser services defining the interface every parser needs to
 * implement.
 */
export abstract class ParserService {
	protected _parseErrorCount;

	/**
	 * Total count of lines that could not be parsed. Hopefully none ;)
	 */
	get parseErrorCount() {
		return this._parseErrorCount;
	}

	/**
	 * The name of the log format this parser is for.
	 */
	get format() {
		return this._format;
	}

	constructor(protected _format: string) {	}

	/**
	 * Parses the given `fileContent` interpreted as the parsers sepcific format to `LogEntry`.
	 *
	 * @param fileContent
	 */
	abstract parse(fileContent: string): Promise<Observable<LogEntry>>;
}
