import { JsonParserService } from './services/parser/json-parser.service';
import { LogViewPageModule } from './pages/log-view/log-view.module';
import { FilterService } from './services/filter.service';
import { NotificationService } from './services/notification.service';
import { LogService } from './services/log.service';
import { ConfigService } from './services/config.service';
import { FileService } from './services/file.service';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy, Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { ParserService } from './services/base/parser.service';
import { IStorageService } from './services/storage/istorage.service';
import { getStorageService } from './services/storage/storage.factory';

@NgModule({
	declarations: [AppComponent],
	entryComponents: [],
	imports: [
		BrowserModule,
		IonicModule.forRoot(),
		AppRoutingModule,
		LogViewPageModule
	],
	providers: [
		StatusBar,
		SplashScreen,
		FileService,
		ConfigService,
		LogService,
		NotificationService,
		FilterService,
		JsonParserService,
		{ provide: IStorageService, useFactory: getStorageService, deps: [Platform] },
		{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
		{ provide: ParserService, multi: true, useExisting: JsonParserService }
	],
	bootstrap: [AppComponent]
})
export class AppModule { }
