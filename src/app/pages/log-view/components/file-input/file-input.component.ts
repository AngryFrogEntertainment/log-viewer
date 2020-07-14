import { Platform } from '@ionic/angular';
import { ConfigService } from 'src/app/services/config.service';
import { Component, Output, EventEmitter, ViewChild, ElementRef, Input } from '@angular/core';

/**
 * Wrapper component for the different implementations of mobile and desktop
 * to open a file dialog.
 */
@Component({
	selector: 'app-file-input',
	templateUrl: './file-input.component.html',
	styleUrls: ['./file-input.component.scss'],
})
export class FileInputComponent {
	@ViewChild('fileSelect') fileInput: ElementRef;
	@ViewChild('ionFileSelect') ionFileSelect: any;
	@Output() onSelect = new EventEmitter<File | string>();
	@Input() text = 'Select file';

	constructor(private platform: Platform) { }

	/**
	 * Opening a file dialog depending on environment.
	 */
	open() {
		// We need to hack here a little bit since ionic does not expose the element or any click function
		this.ionFileSelect.el.childNodes[0].click();
	}

	/**
	 * Change event handler for the mobile input.
	 *
	 * @param filePath The selected file path.
	 */
	ionChange(ev: any) {
		console.log(ev);
		if (this.platform.is('desktop') || this.platform.is('mobileweb')) {
			this.fileSelected(ev.target.childNodes[0]);
		} else {
			this.onSelect.emit(ev.detail.value);
		}
	}

	/**
	 * Selection handler for the desktop file input.
	 *
	 * @param inputElement The desktop file input.
	 */
	fileSelected(inputElement: any) {
		if (inputElement.files != null && inputElement.files.length > 0) {
			const file: File = inputElement.files[0];
			if (file) {
				// Open file on service
				console.log(`Selected file ${file.name}`, file);
				this.onSelect.emit(file);
			}
		}
	}
}
