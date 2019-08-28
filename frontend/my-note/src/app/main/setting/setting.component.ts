import { Component, OnInit, Inject } from '@angular/core';
import { LOCAL_STORAGE, SESSION_STORAGE, WebStorageService} from 'angular-webstorage-service';
import { NzContextMenuService, NzDropdownMenuComponent } from 'ng-zorro-antd/dropdown';

import { DomSanitizer } from '@angular/platform-browser';
import { Router, ActivatedRoute } from '@angular/router';
import { NzMessageService, UploadFile } from 'ng-zorro-antd';
import { NzFormatEmitEvent, NzTreeNode } from 'ng-zorro-antd/core';

import { HttpClient, HttpEvent, HttpEventType, HttpRequest, HttpResponse } from '@angular/common/http';
import { UploadXHRArgs } from 'ng-zorro-antd';


import { CommonService } from '../../service/common.service';
import { format } from 'date-fns';


@Component({
  selector: 'app-setting',
  templateUrl: './setting.component.html',
  styleUrls: ['./setting.component.styl']
})
export class SettingComponent implements OnInit {

  token: string = null;

  password: string = null;
  passwordAgain: string = null;
  paswordWaiting: boolean = false;

  config: any = null;
  configInit: boolean = false;
  configWaiting: boolean = false;

  emptyWaiting: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private commonService: CommonService,
    private passSecurity: DomSanitizer,
    private nzContextMenuService: NzContextMenuService,
    private message: NzMessageService,
    private router: Router,
    @Inject(LOCAL_STORAGE) private localStorage: WebStorageService,
    @Inject(SESSION_STORAGE) private sessionStorage: WebStorageService,
  ) { }

  ngOnInit() {
    this.token = this.sessionStorage.get("myNoteToken");
    if(!this.token){
      this.router.navigateByUrl("/main");
    }
    this.getConfig();
  }

  // 获取设置
  getConfig(){
    this.configInit = false;
    this.commonService.getConfig().subscribe(re => {
      if(re["code"] === 0){
        this.config = re["data"];
        this.configInit = true;
      }else{
        this.commonService.wrongCode(re, "getConfig");
      }
    });
  }

  // 保存设置
  configSave(){
    this.configWaiting = true;
    this.commonService.saveConfig(this.token, this.config).subscribe(re => {
      if(re["code"] === 0){
        this.configWaiting = false;
        this.message.create("success", "保存成功，刷新页面生效！");
      }else{
        this.configWaiting = false;
        this.commonService.wrongCode(re, "configSave");
      }
    });

  }

  // 保存密码
  passwordSave(){
    if(!this.password){
      this.message.create("error", "密码不能为空！");
      return;
    }
    if(this.password !== this.passwordAgain){
      this.message.create("error", "两次密码不一致！");
      return;
    }
    this.paswordWaiting = true;
    this.commonService.savePassword(this.token, this.password).subscribe(re => {
      if(re["code"] === 0){
        this.paswordWaiting = false;
        this.message.create("success", "修改成功！");
        this.passwordAgain = null;
        this.password = null;
      }else{
        this.paswordWaiting = false;
        this.commonService.wrongCode(re, "passwordSave");
      }
    });
  }

  // 清除多余的图片文章数据
  emptyUselessData(){
    this.emptyWaiting = true;
    this.commonService.emptyUselessData(this.token).subscribe(re => {
      if(re["code"] === 0){
        this.emptyWaiting = false;
        this.message.create("success", "清理成功！");
      }else{
        this.emptyWaiting = false;
        this.commonService.wrongCode(re, "emptyUselessData");
      }
    });

  }

}
