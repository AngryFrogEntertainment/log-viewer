import { NotificationService } from './notification.service';
import { AppConfig } from './../models/appConfig';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Platform } from '@ionic/angular';
import { IStorageService } from './storage/istorage.service';

/**
 * Service that holds the different profiles of logger configurations which define the
 * interpretation of the current log file.
 */
@Injectable({
	providedIn: 'root'
})
export class ConfigService {
	static appConfig: AppConfig = new AppConfig();

	private $config = new BehaviorSubject<AppConfig>(ConfigService.appConfig);
	private _defaultProfile = 'default';
	private _profiles = [this._defaultProfile];
	private _currentProfile: string;
	private _isInitializing = false;

	/**
	 * Is the service currently initializing?
	 */
	get isInitializing() {
		return this._isInitializing;
	}

	/**
	 * Returns all stored configuration profiles
	 */
	get profiles() {
		return this._profiles;
	}

	/**
	 * Retruns the currently selected configuration profile.
	 */
	get currentProfile() {
		return this._currentProfile;
	}

	/**
	 * Returns the currently selected configuration as observable.
	 */
	get configAsObservable() {
		return this.$config.asObservable();
	}

	/**
	 * Returns true if the app runs in a desktop environment otherwise false.
	 */
	get isDesktop() {
		return this.platform.is('desktop');
	}

	constructor(
		private storageService: IStorageService,
		private notificationService: NotificationService,
		private platform: Platform) { }

	/**
	 * Initializes the service. It creates the default configuration on first start otherwise
	 * it loads all profiles and the last active configuration from storage.
	 */
	async init() {
		this._isInitializing = true;
		let config = new AppConfig();
		const loading = await this.notificationService.showLoadingIndication('Initializing...');
		const profiles = await this.storageService.getData<string[]>('profiles');
		if (profiles) {
			this._profiles = profiles;
		}

		let lastProfile = await this.storageService.getData<string>('last-profile');

		if (!lastProfile) {
			lastProfile = this._defaultProfile;
		}

		if (!(await this.storageService.hasKey(lastProfile))) {
			await this.saveConfig(config);
		} else {
			config = await this.loadConfig(lastProfile);
		}

		this._isInitializing = false;
		await loading.dismiss();
		return config ? config : new AppConfig();
	}

	/**
	 * Saves the given log-`config` for the given `profile`.
	 *
	 * @param config The log config that is to be saved.
	 * @param profile The profile name the config is saved for.
	 */
	async saveConfig(config: AppConfig, profile = this._defaultProfile) {
		try {
			if (!this._profiles.find(value => value === profile)) {
				this._profiles.push(profile);
				await this.storageService.storeData('profiles', this._profiles);
				await this.storageService.storeData('last-profile', profile);
			}

			await this.storageService.storeData(profile, config);
			this.setConfig(config, profile);
		} catch (error) {
			console.error('An unexpected error occured storing config', config, error);
			await this.notificationService.showAlert({
				header: 'Error',
				message: 'Could not save config. Details in console.'
			});
		}
	}

	/**
	 * Loads the log configuration for the given `profile` name.
	 *
	 * @param profile Name of the profile the configuration should be loaded for.
	 */
	async loadConfig(profile: string) {
		let config: AppConfig;
		try {
			config = await this.storageService.getData<AppConfig>(profile);

			if (!config) {
				const msg = `No config found for profile '${profile}'. Returning default settings.`;
				console.error(msg);
				await this.notificationService.showAlert({
					header: 'Error',
					message: msg
				});

				config = await this.storageService.getData<AppConfig>(this._defaultProfile);

				if (!config) {
					console.error('Could not load default profile from storage. Creating new.', this._defaultProfile);
					config = new AppConfig();
				}
			}
		} catch (error) {
			console.error('An unexpected error occured loading config.', error);
			await this.notificationService.showAlert({
				header: 'Error',
				message: 'Could not load config. Returning default. Details in console.'
			});

			config = new AppConfig();
		}

		this.setConfig(config, profile);
		return config;
	}

	/**
	 * Deletes the configuration for the given profile and removes the profile from the profile list.
	 *
	 * @param profile Name of the profile that is to be removed.
	 */
	async deleteItem(profile: string) {
		try {
			await this.storageService.remove(profile);
			this._profiles = this.profiles.filter(value => value !== profile);
			const lastProfile = await this.storageService.getData<string>('last-profile');

			if (lastProfile === profile) {
				await this.storageService.remove('last-profile');
			}

			await this.storageService.storeData('profiles', this._profiles);
			await this.loadConfig(this._defaultProfile);
		} catch (error) {
			console.error('An unexpected error occured removing profile.', error);
			await this.notificationService.showAlert({
				header: 'Error',
				message: 'Could not remove profile. Details in console.'
			});
		}
	}

	/**
	 * Clears all storage and restores the previous default profile.
	 *
	 * **ALL STORED INFORMATIONS WILL BE LOST!**
	 */
	async clear() {
		try {
			await this.storageService.clear();
			await this.saveConfig(new AppConfig());
		} catch (error) {
			console.error('An unexpected error occured clearing storage.', error);
			await this.notificationService.showAlert({
				header: 'Error',
				message: 'Could not clear storage. Details in console.'
			});
		}
	}

	/**
	 * Checks if a configuration for the given profile exits.
	 *
	 * @param profile Name of the profile.
	 */
	async hasConfig(profile: string) {
		try {
			return await this.storageService.hasKey(profile);
		} catch (error) {
			console.error('An unexpected error occured checking profiles existing in storage.', error);
			await this.notificationService.showAlert({
				header: 'Error',
				message: 'Could not check profile in storage. Details in console.'
			});
		}
	}

	private setConfig(config: AppConfig, profile: string) {
		this._currentProfile = profile;
		ConfigService.appConfig = config;
		this.$config.next(config);
	}
}
