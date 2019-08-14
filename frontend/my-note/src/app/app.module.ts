import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { StorageServiceModule} from 'angular-webstorage-service';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MainComponent } from './main/main.component';
import { LoginComponent } from './login/login.component';
import { NoteComponent } from './main/note/note.component';
import { NgZorroAntdModule, NZ_I18N, zh_CN } from 'ng-zorro-antd';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { registerLocaleData } from '@angular/common';
import zh from '@angular/common/locales/zh';
import { DashboardComponent } from './main/dashboard/dashboard.component';
import { SettingComponent } from './main/setting/setting.component';


registerLocaleData(zh);

@NgModule({
  declarations: [
    AppComponent,
    MainComponent,
    LoginComponent,
    NoteComponent,
    DashboardComponent,
    SettingComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
	  StorageServiceModule,
	  NgZorroAntdModule,
	  FormsModule,
	  HttpClientModule,
	  BrowserAnimationsModule
  ],
  providers: [{ provide: NZ_I18N, useValue: zh_CN }],
  bootstrap: [AppComponent]
})
export class AppModule { }
