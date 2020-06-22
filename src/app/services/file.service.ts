import { Injectable } from '@angular/core';
import { Plugins, FilesystemEncoding } from '@capacitor/core';

// Not used nor working yet. Just added it for a quick tryout of the android
// implementation. Well, that failed. Anyway, it will remain until i got
// more time to take care of the mobile implementations.
const { FileSystem } = Plugins;

/**
 * Wrapper service for the html5 File Api File Reader.
 */
@Injectable({
	providedIn: 'root'
})
export class FileService {

	constructor() { }

	/**
	 * Reads the given `file` and returns its contents as utf8-string.
	 *
	 * @param file File to read.
	 */
	async readAsText(file: File | string) {
		if (typeof file === 'string') {
			return await this.readFilePathAsText(file);
		} else {
			return await this.readFileAsText(file);
		}
	}

	private readFileAsText(file: File) {
		return new Promise<string>((resolve, reject) => {
			const reader = new FileReader();
			reader.onload = () => resolve(reader.result as string);
			reader.onerror = () => reject(reader.error);
			reader.readAsText(file, 'utf8');
		});
	}

	private async readFilePathAsText(file: string) {
		const content = await FileSystem.readFile({
			path: file,
			encoding: FilesystemEncoding.UTF8
		});
		return content.data;
	}
}
