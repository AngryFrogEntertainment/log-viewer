/**
 * Model that represents a log view configuration.
 */
export class AppConfig {
	// Entry styling
	timestamp = 'timestamp';
	level = 'level';
	message = 'message:text';
	meta = 'message:logObject';
	context = '';

	// Dates
	dateFormat = 'YYYY-MM-DD HH:mm:ss';

	// Pagesize
	pageSize = 100;

	/**
	 * Creates a new AppConfig object and clones all properties
	 * of the given `appConfig`.
	 *
	 * @param appConfig The config that is to be cloned.
	 */
	static clone(appConfig: AppConfig) {
		const config = new AppConfig();
		config.context = appConfig.context;
		config.dateFormat = appConfig.dateFormat;
		config.level = appConfig.level;
		config.message = appConfig.message;
		config.meta = appConfig.meta;
		config.pageSize = appConfig.pageSize;
		config.timestamp = appConfig.timestamp;

		return config;
	}
}
