import { Component, OnInit, Inject } from '@angular/core';
import { LOCAL_STORAGE, SESSION_STORAGE, WebStorageService} from 'angular-webstorage-service';
import { Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd';

import { CommonService } from '../service/common.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.styl']
})
export class MainComponent implements OnInit {

  config: any = null;
  configInit: boolean = false;

  constructor(
    private commonService: CommonService,
    private message: NzMessageService,
    private router: Router,
    @Inject(LOCAL_STORAGE) private localStorage: WebStorageService,
    @Inject(SESSION_STORAGE) private sessionStorage: WebStorageService,
  ) { }

  ngOnInit() {
    if(!this.sessionStorage.get("myNoteIfLogin")){
      this.router.navigateByUrl("/login");
    }
    this.getConfig();
  }

  getConfig(){
    this.configInit = false;
    this.commonService.getConfig().subscribe(re => {
      if(re["code"] === 0){
        this.config = re["data"];
        this.configInit = true;
      }
    });
  }

  logout(){
    this.localStorage.set("myNoteAutoLogin", false);
    this.sessionStorage.set("myNoteToken", null);
    this.sessionStorage.set("myNoteIfLogin", false);
    this.router.navigateByUrl("/login");
  }

}
