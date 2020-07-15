import { Injectable } from '@angular/core';
import { Plugins } from '@capacitor/core';

const { Storage } = Plugins;

/**
 * Wrapper service for the capacitor storage.
 */
@Injectable({
	providedIn: 'root'
})
export class StorageService {

	constructor() { }

	/**
	 * Stores the given `data` for the given `key`.
	 *
	 * @param key The key.
	 * @param data The data.
	 */
	async storeData(key: string, data: any) {
		const json = JSON.stringify(data);
		await Storage.set({
			key: key,
			value: json
		});
	}

	/**
	 * Returns the stored data for the given `key` or null if no data.
	 *
	 * @param key The key of the stored data.
	 */
	async getData<T>(key: string) {
		const json = (await Storage.get({ key: key })).value;
		if (!json) { return null; }

		return JSON.parse(json);
	}

	/**
	 * Checks if there is data for the given `key`.
	 *
	 * @param key The key that is to be checked.
	 */
	async hasKey(key: string) {
		const keys = (await Storage.keys()).keys;

		return keys.includes(key);
	}

	/**
	 * Clears the storage and deletes **all** stored data.
	 */
	async clear() {
		await Storage.clear();
	}

	/**
	 * Removes the given `key` and its data from the storage.
	 *
	 * @param key The key that is to be removed.
	 */
	async remove(key: string) {
		await Storage.remove({ key: key });
	}
}
