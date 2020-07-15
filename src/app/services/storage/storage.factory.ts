import { StorageService } from './storage.service';
import { Platform } from '@ionic/angular';
import { IStorageService } from './istorage.service';
import { LocalStorageService } from './local-storage.service';

export function getStorageService(platform: Platform): IStorageService {
	if (platform.is('electron')) {
		return new LocalStorageService();
	}

	return new StorageService();
}
