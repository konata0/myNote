import { Component, OnInit, Inject } from '@angular/core';
import { LOCAL_STORAGE, SESSION_STORAGE, WebStorageService} from 'angular-webstorage-service';
import { Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd';
import { NzContextMenuService, NzDropdownMenuComponent } from 'ng-zorro-antd/dropdown';
import { NzFormatEmitEvent, NzTreeNode } from 'ng-zorro-antd/core';

import { CommonService } from '../service/common.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.styl']
})
export class MainComponent implements OnInit {

  token: string = null;

  // 设置
  config: any = null;
  configInit: boolean = false;

  // 目录
  catalogue: any = null;
  catalogueTree: any = null;
  catalogueInit: boolean = false;

  // 选中记录
  activeNode: NzTreeNode;
  rightClickNode: NzTreeNode;

  // 文件夹操作
  // 重命名
  ifShowDirRenameModal: boolean = false;
  dirRenameNewName: string = null
  dirRenameWaiting:boolean = false;
  // 新建文件夹
  ifShowNewDirModal: boolean = false;
  newDirName: string = null
  newDirWaiting:boolean = false;

  constructor(
    private commonService: CommonService,
    private message: NzMessageService,
    private router: Router,
    private nzContextMenuService: NzContextMenuService,
    @Inject(LOCAL_STORAGE) private localStorage: WebStorageService,
    @Inject(SESSION_STORAGE) private sessionStorage: WebStorageService,
  ) { }

  ngOnInit() {
    if(!this.sessionStorage.get("myNoteIfLogin")){
      this.router.navigateByUrl("/login");
    }
    this.token = this.sessionStorage.get("myNoteToken");
    this.getConfig();
    this.getCatalogue();
  }

  // 获取设置
  getConfig(){
    this.configInit = false;
    this.commonService.getConfig().subscribe(re => {
      if(re["code"] === 0){
        this.config = re["data"];
        this.configInit = true;
      }
    });
  }

  // 获取目录
  getCatalogue(){
    this.catalogueInit = false;
    this.commonService.getCatalogue().subscribe(re => {
      if(re["code"] === 0){
        this.catalogue = re["data"];
        this.formCatalogueTree();
      }
    });
  }
  formCatalogueTree(){
    let rootRecord = (<Array<any>>this.catalogue).filter(record => record["parentId"] === null)[0];
    let rootNode = {
        title: rootRecord["name"],
        key: rootRecord["id"],
        expanded: true,
        children: []
    }
    this.catalogueTree = [rootNode];
    this.formCatalogueTreeRecursive(rootNode);
    //this.catalogueTree = this.catalogueTree[0]["children"];
    this.treeSort(this.catalogueTree[0]);
    this.clearOperation();
    this.catalogueInit = true;
  }
  formCatalogueTreeRecursive(parentNode: any){
    let childrenRecordArray = (<Array<any>>this.catalogue).filter(record => record["parentId"] === parentNode["key"]);
    childrenRecordArray.forEach(record => {
      let childNode = null;
      if(record["type"] === "dir"){
        childNode = {
          title: record["name"],
          key: record["id"],
          expanded: true,
          isLeaf: false,
          children: []
        }
      }else{
        childNode = {
          title: record["name"],
          key: record["id"],
          isLeaf: true
        }
      }
      (<Array<any>>parentNode["children"]).push(childNode);
      if(record["type"] === "dir"){
        this.formCatalogueTreeRecursive(childNode);
      }
    });
  }
  // 清除操作信息
  clearOperation(){
    this.activeNode = null;
    this.rightClickNode = null;
  }
  // 目录排序
  sortFunction = function(t1: any, t2: any){
    if(t1["isLeaf"] && !t2["isLeaf"]){
      return 1;
    }
    if(t2["isLeaf"] && !t1["isLeaf"]){
      return -1;
    }
    let s1 = (<string>t1["title"]).toUpperCase();
    let s2 = (<string>t2["title"]).toUpperCase();
    if (s1 < s2) {
        return -1;
    }
    if (s1 > s2) {
        return 1;
    }
    return 0;
  }
  treeSort(node: any){
    (<Array<any>>node["children"]).sort(this.sortFunction);
    (<Array<any>>node["children"]).forEach(childNode => {
      if(!childNode["isLeaf"]){
        this.treeSort(childNode);
      }
    });
  }
  // 点击目录
  contextMenu($event: MouseEvent, menu: NzDropdownMenuComponent, node: any): void {
    if(this.token === null){
      return;
    }
    this.rightClickNode = node;
    this.nzContextMenuService.create($event, menu);
  }
  openFolder(data: NzTreeNode | Required<NzFormatEmitEvent>): void {
    if (data instanceof NzTreeNode) {
      data.isExpanded = !data.isExpanded;
    } else {
      const node = data.node;
      if (node) {
        node.isExpanded = !node.isExpanded;
      }
    }
  }
  activeNodeChange(data: NzFormatEmitEvent): void {
    this.activeNode = data.node!;
    console.log(this.activeNode);
  }
  // 文件夹右键操作
  // 重命名
  dirRename():void{
    this.dirRenameNewName = null;
    this.ifShowDirRenameModal = true;
  }
  dirRenameCancel():void{
    this.ifShowDirRenameModal = false;
    this.dirRenameNewName = null;
  }
  dirRenameOk():void{
    if(!this.dirRenameNewName){
      this.message.create("error", "请输入文件夹名!");
      return;
    }
    this.dirRenameWaiting = true;
    this.commonService.dirRename(this.token, <any>this.rightClickNode["origin"]["key"], this.dirRenameNewName).subscribe(re => {
      if(re["code"] === -2){
        this.message.create("error", "错误token，请重新登录！");
        this.dirRenameWaiting = false;
      }
      if(re["code"] === -4){
        this.message.create("error", "操作失败！");
        this.dirRenameWaiting = false;
      }
      if(re["code"] === 0){
        this.message.create("success", "重命名成功！");
        this.dirRenameWaiting = false;
        this.dirRenameCancel();
        this.getCatalogue();

      }

    });
  }
  // 新建文件夹
  newDir():void{
    this.newDirName = null;
    this.ifShowNewDirModal = true;
  }
  newDirCancel():void{
    this.ifShowNewDirModal = false;
    this.newDirName = null;
  }
  newDirOk():void{
    if(!this.newDirName){
      this.message.create("error", "请输入文件夹名!");
      return;
    }
    this.newDirWaiting = true;
    this.commonService.newDir(this.token, <any>this.rightClickNode["origin"]["key"], this.newDirName).subscribe(re => {
      if(re["code"] === -2){
        this.message.create("error", "错误token，请重新登录！");
        this.newDirWaiting = false;
      }
      if(re["code"] === -4){
        this.message.create("error", "操作失败！");
        this.newDirWaiting = false;
      }
      if(re["code"] === 0){
        this.message.create("success", "创建成功！");
        this.newDirWaiting = false;
        this.newDirCancel();
        this.getCatalogue();
      }
    });
  }

  // 退出
  logout(){
    this.localStorage.set("myNoteAutoLogin", false);
    this.sessionStorage.set("myNoteToken", null);
    this.sessionStorage.set("myNoteIfLogin", false);
    this.router.navigateByUrl("/login");
  }
}
