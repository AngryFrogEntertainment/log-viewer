import { AppConfig } from './../../../../models/appConfig';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ConfigService } from 'src/app/services/config.service';
import { MenuController, AlertController, Platform } from '@ionic/angular';

/**
 * Component for the log viewer configuration.
 */
@Component({
	selector: 'app-config',
	templateUrl: './config.component.html',
	styleUrls: ['./config.component.scss'],
})
export class ConfigComponent implements OnInit {
	@ViewChild('importInput') importInput: any;
	@ViewChild('exportAnchor') exportAnchor: any;

	/**
	 * The currently selected configuration.
	 */
	config: AppConfig = new AppConfig();
	/**
	 * All available config profiles.
	 */
	profiles: string[] = [];
	/**
	 * The currently selected profile.
	 */
	selectedProfile = '';
	/**
	 * Name of the newly added profile.
	 */
	currentCreatingProfile = '';

	/**
	 * Returns if the current configuration is valid.
	 */
	get isValid() {
		return this.config.timestamp && this.config.level && this.config.message && this.config.dateFormat && this.config.pageSize;
	}

	constructor(
		public configService: ConfigService,
		private menu: MenuController,
		public alertController: AlertController,
		private platform: Platform) { }

	ngOnInit() {
		this.configService.init().then(config => {
			this.initConfig(config);
		});
	}

	/**
	 * Selects a profile and loads its correspondig configuration.
	 *
	 * @param profile Name of the profile.
	 */
	async selectProfile(profile: string) {
		if (!(await this.configService.hasConfig(profile))) {
			console.log('Profile selection from create action.');
			return;
		}

		if (this.selectedProfile === this.configService.currentProfile) {
			console.log('Not a real profile change. Damn you ionic!');
			return;
		}

		console.log('Selecting profile', profile);
		const config = await this.configService.loadConfig(profile);
		this.config = AppConfig.clone(config);
	}

	/**
	 * Opens the alert dialog to create a new profile.
	 */
	async createProfile() {
		const alert = await this.alertController.create({
			header: 'New Profile',
			inputs: [
				{
					name: 'name',
					type: 'text',
					placeholder: 'Profile name'
				}
			],
			buttons: [
				{
					text: 'Cancel',
					role: 'cancel',
					cssClass: 'secondary',
					handler: () => {
						console.log('Creation of new profile cancelled');
					}
				}, {
					text: 'Create',
					handler: (answer) => {
						console.log('Create new profile', answer);
						this.config.context = '';
						this.config.dateFormat = '';
						this.config.level = '';
						this.config.message = '';
						this.config.meta = '';
						this.config.pageSize = 100;
						this.config.timestamp = '';

						this.profiles.push(answer.name);
						this.selectedProfile = answer.name;
						this.currentCreatingProfile = answer.name;
					}
				}
			]
		});

		await alert.present();
	}

	/**
	 * Saves the configuration for the currently selected profile.
	 */
	async save() {
		this.currentCreatingProfile = '';
		await this.configService.saveConfig(this.config, this.selectedProfile);
		await this.menu.close('config');
	}

	/**
	 * Clears all configurations from storage.
	 */
	async clear() {
		const alert = await this.alertController.create({
			header: 'Clearing profiles',
			message: 'Are you sure you want to clear all stored profiles? It can´t be undone!',
			buttons: [
				{
					text: 'Cancel',
					role: 'cancel',
					cssClass: 'secondary'
				}, {
					text: 'Clear',
					handler: async () => {
						await this.configService.clear();
						const config = await this.configService.init();
						this.initConfig(config);
					}
				}
			]
		});
		await alert.present();
	}

	/**
	 * Closes the side menu which hosts this component.
	 */
	async close() {
		this.currentCreatingProfile = '';
		this.initConfig(ConfigService.appConfig);
		await this.menu.close('config');
	}

	/**
	 * Deletes the currently selected config profile.
	 */
	async deleteProfile() {
		this.configService.deleteItem(this.selectedProfile);
	}

	/**
	 * Clickhandler for import
	 */
	async import() {
		this.importInput.el.childNodes[0].click();
	}

	/**
	 * Imports profiles from the given file as path or file api file.
	 */
	async importProfiles(ev: any) {
		if (this.platform.is('desktop') || this.platform.is('mobileweb')) {
			this.fileSelected(ev.target.childNodes[0]);
		} else {
			await this.configService.importConfigs(ev.detail.value);
		}
	}

	/**
	 * Exports all profiles as json.
	 */
	async export() {
		const profiles = await this.configService.exportConfigs();
		const profileExportContent = `data:application/json;charset=utf-8,${encodeURIComponent(profiles)}`;
		this.exportAnchor.nativeElement.href = profileExportContent;
		this.exportAnchor.nativeElement.click();
	}

	private initConfig(config: AppConfig) {
		this.config = AppConfig.clone(config);
		this.profiles = [];
		this.configService.profiles.forEach(profile => this.profiles.push(profile));
		this.selectedProfile = this.configService.currentProfile;
	}

	private fileSelected(inputElement: any) {
		if (inputElement.files != null && inputElement.files.length > 0) {
			const file: File = inputElement.files[0];
			if (file) {
				// Open file on service
				console.log(`Selected file ${file.name}`, file);
				this.configService.importConfigs(file);
			}
		}
	}
}
