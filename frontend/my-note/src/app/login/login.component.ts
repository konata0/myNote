import { Component, OnInit, Inject } from '@angular/core';
import { LOCAL_STORAGE, SESSION_STORAGE, WebStorageService} from 'angular-webstorage-service';
import { Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd';

import { CommonService } from '../service/common.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.styl']
})
export class LoginComponent implements OnInit {

  data: any;

  password: string = null;
  autoLogin: boolean = true;

  visitorLoginWaiting: boolean = false;
  adminLoginWaiting: boolean = false;

  constructor(
    private router: Router,
    private commonService: CommonService,
    private message: NzMessageService,
    @Inject(LOCAL_STORAGE) private localStorage: WebStorageService,
    @Inject(SESSION_STORAGE) private sessionStorage: WebStorageService,
  ) { }

  ngOnInit() { 
    // 初始化地址
    this.commonService.addressInit();

    // 初始化登录数据
    this.getLoginData();
    if(this.autoLogin){
      this.adminLogin();
    }
  }

  

  // 获取登录数据
  getLoginData(){
    this.password = this.localStorage.get("myNotePassword")? this.localStorage.get("myNotePassword"): null;
    this.autoLogin = this.localStorage.get("myNoteAutoLogin")? this.localStorage.get("myNoteAutoLogin"): false;
  }

  // 设置登录数据
  setLoginData(){
    this.localStorage.set("myNotePassword", this.password);
    this.localStorage.set("myNoteAutoLogin", this.autoLogin);
  }

  
  visitorLogin(){
    this.visitorLoginWaiting = true;
    this.password = null;
    this.login();
  }
  adminLogin(){
    this.adminLoginWaiting = true;
    this.login();
  }
  login(){
    this.setLoginData();
    if(this.password){
      this.password = this.commonService.md5(this.password);
    }
    let data = {
      password: this.password
    }
    this.commonService.passwordCheck(data).subscribe(re => {
      if(re["code"] === -1){
        this.message.create("error", "密码错误！");
        this.adminLoginWaiting = false;
        this.visitorLoginWaiting = false;
        this.password = null;
      }else if(re["code"] === 0){
        this.sessionStorage.set("myNoteToken", re["data"]["token"]);
        this.sessionStorage.set("myNoteIfLogin", true);
        this.adminLoginWaiting = false;
        this.visitorLoginWaiting = false;
        this.sessionStorage.set("myNoteAnime", true);
        this.router.navigateByUrl("/main");
      }
    })

  }

}
