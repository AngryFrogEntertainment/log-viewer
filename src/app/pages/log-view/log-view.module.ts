import { ConfigHelpComponent } from './components/modals/config-help/config-help.component';
import { ConfigComponent } from './components/config/config.component';
import { FileInputComponent } from './components/file-input/file-input.component';
import { LogCountComponent } from './components/log-count/log-count.component';
import { FilterComponent } from './components/filter/filter.component';
import { DetailComponent } from './components/modals/detail/detail.component';
import { LogViewerComponent } from './components/log-viewer/log-viewer.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { LogViewPageRoutingModule } from './log-view-routing.module';

import { LogViewPage } from './log-view.page';

@NgModule({
	imports: [
		CommonModule,
		FormsModule,
		IonicModule,
		LogViewPageRoutingModule
	],
	declarations: [
		LogViewPage,
		LogViewerComponent,
		DetailComponent,
		FilterComponent,
		LogCountComponent,
		FileInputComponent,
		ConfigComponent,
		ConfigHelpComponent
	],
	exports: [
		ConfigComponent,
		ConfigHelpComponent
	]
})
export class LogViewPageModule { }
