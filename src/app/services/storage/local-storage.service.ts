import { Injectable } from '@angular/core';
import { IStorageService } from './istorage.service';

@Injectable({
	providedIn: 'root'
})
export class LocalStorageService extends IStorageService {

	constructor() {
		super();
	}

	storeData(key: string, data: any) {
		try {
			const item = JSON.stringify(data);
			localStorage.setItem(key, item);
		} catch (error) {
			return Promise.reject(error);
		}

		return Promise.resolve();
	}

	getData<T>(key: string) {
		let data: T;

		try {
			const item = localStorage.getItem(key);
			data = item ? JSON.parse(item) : null;
		} catch (error) {
			return Promise.reject(error);
		}

		return Promise.resolve(data);
	}

	async hasKey(key: string): Promise<boolean> {
		const data = await this.getData(key);
		return !!data;
	}

	clear(): Promise<void> {
		try {
			localStorage.clear();
		} catch (error) {
			return Promise.reject(error);
		}

		return Promise.resolve();
	}

	remove(key: string): Promise<void> {
		try {
			localStorage.removeItem(key);
		} catch (error) {
			return Promise.reject(error);
		}

		return Promise.resolve();
	}

}
