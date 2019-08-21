import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { MainComponent } from './main/main.component';
import { NoteComponent } from './main/note/note.component'
import { SettingComponent } from './main/setting/setting.component';
import { DashboardComponent } from './main/dashboard/dashboard.component';



const routes: Routes = [

  { path: '', component: LoginComponent },

  { path: 'login', component: LoginComponent },

  {
    path: 'main',
    component: MainComponent,
    children: [
      { path: '', component: DashboardComponent },
      { path: 'note', component: DashboardComponent },
      { path: 'note/:id', component: NoteComponent },
      { path: 'setting', component: SettingComponent },
    ]
  },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
