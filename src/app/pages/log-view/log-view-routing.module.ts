import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LogViewPage } from './log-view.page';

const routes: Routes = [
	{
		path: '',
		component: LogViewPage
	}
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule],
})
export class LogViewPageRoutingModule { }
