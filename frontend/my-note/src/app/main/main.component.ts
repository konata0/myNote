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
  expandedRecord: any = null;


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
  // 新建文件
  ifShowNewFileModal: boolean = false;
  newFileName: string = null
  newFileWaiting:boolean = false;
  // 删除
  ifShowDirDeleteModal: boolean = false;
  dirDeleteWaiting:boolean = false;
  // 剪切粘贴
  cutChildId: number = null;

  // 文件操作
  // 重命名
  ifShowFileRenameModal: boolean = false;
  fileRenameNewName: string = null
  fileRenameWaiting:boolean = false;
  // 删除
  ifShowFileDeleteModal: boolean = false;
  fileDeleteWaiting:boolean = false;

  

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
    this.expandedRecord = this.localStorage.get("expandedRecord");
    if(this.expandedRecord === null){
      this.expandedRecord = [];
      this.localStorage.set("expandedRecord", this.expandedRecord);
    }
    this.getConfig();
    this.getCatalogue();
  }

  errorMsg(msg: string){
    this.message.create("error", msg);
  }
  successMsg(msg: string){
    this.message.create("success", msg);
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

  // 判断文件夹是否展开
  getExpandedRecord(id: number){
    if(this.expandedRecord[id] === true){
      return true;
    }else{
      return false;
    }
  }

  // 获取目录
  getCatalogue(){
    this.cutChildId = null;
    this.catalogueInit = false;
    this.commonService.getCatalogue(this.token).subscribe(re => {
      if(re["code"] === 0){
        this.catalogue = re["data"];
        this.formCatalogueTree();
      }else{
        this.commonService.wrongCode(re, "getCatalogue");
      }
    });
  }
  formCatalogueTree(){
    let rootRecord = (<Array<any>>this.catalogue).filter(record => record["parentId"] === null)[0];
    let rootNode = {
        title: rootRecord["name"],
        key: rootRecord["id"],
        expanded: true,
        children: [],
        private: rootRecord["private"]
    }
    this.catalogueTree = [rootNode];
    this.formCatalogueTreeRecursive(rootNode);
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
          expanded: this.getExpandedRecord(record["id"]),
          isLeaf: false,
          children: [],
          private: record["private"]
        }
      }else{
        childNode = {
          title: record["name"],
          key: record["id"],
          isLeaf: true,
          private: record["private"]
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
      this.expandedRecord[data["key"]] = data.isExpanded;
      this.localStorage.set("expandedRecord", this.expandedRecord);
    } else {
      const node = data.node;
      if (node) {
        node.isExpanded = !node.isExpanded;
        this.expandedRecord[node["key"]] = node.isExpanded;
        this.localStorage.set("expandedRecord", this.expandedRecord);
      }
    }
  }
  activeNodeChange(data: NzFormatEmitEvent): void {
    this.activeNode = data.node!;
    if(this.activeNode.origin["isLeaf"]){
      this.router.navigateByUrl("/main/note?id=" + (<number><any>this.activeNode.origin["key"]).toString());
    }
  }

  // 文件夹右键操作
  // 重命名
  dirRename():void{
    this.dirRenameNewName = <any>this.rightClickNode["origin"]["title"];
    this.ifShowDirRenameModal = true;
  }
  dirRenameCancel():void{
    this.ifShowDirRenameModal = false;
    this.dirRenameNewName = null;
  }
  dirRenameOk():void{
    if(!this.dirRenameNewName){
      this.errorMsg("请输入文件夹名!");
      return;
    }
    this.dirRenameWaiting = true;
    this.commonService.dirRename(this.token, <any>this.rightClickNode["origin"]["key"], this.dirRenameNewName).subscribe(re => {
      if(re["code"] === 0){
        this.successMsg("重命名成功！");
        this.dirRenameWaiting = false;
        this.dirRenameCancel();
        this.getCatalogue();
      }else{
        this.commonService.wrongCode(re, "dirRename");
        this.dirRenameWaiting = false;
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
      this.errorMsg("请输入文件夹名!");
      return;
    }
    this.newDirWaiting = true;
    this.commonService.newDir(this.token, <any>this.rightClickNode["origin"]["key"], this.newDirName).subscribe(re => {
      if(re["code"] === 0){
        this.successMsg("创建成功！");
        this.newDirWaiting = false;
        this.newDirCancel();
        this.getCatalogue();
      }else{
        this.commonService.wrongCode(re, "newDir");
        this.newDirWaiting = false;
      }
    });
  }
  // 新建文件
  newFile():void{
    this.newFileName = null;
    this.ifShowNewFileModal = true;
  }
  newFileCancel():void{
    this.ifShowNewFileModal = false;
    this.newFileName = null;
  }
  newFileOk():void{
    if(!this.newFileName){
      this.errorMsg("请输入标题!");
      return;
    }
    this.newFileWaiting = true;
    this.commonService.newFile(this.token, <any>this.rightClickNode["origin"]["key"], this.newFileName).subscribe(re => {
      if(re["code"] === 0){
        this.successMsg("创建成功！");
        this.newFileWaiting = false;
        this.newFileCancel();
        this.getCatalogue();
      }else{
        this.commonService.wrongCode(re, "newFile");
        this.newFileWaiting = false;
      }
    });
  }
  // 隐藏公开
  dirChangePrivate(){
    this.commonService.dirChangePrivate(this.token, <any>this.rightClickNode["origin"]["key"]).subscribe(re => {
      if(re["code"] === 0){
        this.successMsg("修改成功！");
        this.getCatalogue();
      }else{
        this.commonService.wrongCode(re, "dirChangePrivate");
      }
    });
  }
  // 文件夹删除
  dirDelete():void{
    this.ifShowDirDeleteModal = true;
  }
  dirDeleteCancel():void{
    this.ifShowDirDeleteModal = false;
  }
  dirDeleteOk():void{
    if(<any>this.rightClickNode["origin"]["key"] === 0){
      this.errorMsg("禁止删除根目录！");
      return;
    }
    this.dirDeleteWaiting = true;
    this.commonService.dirDelete(this.token, <any>this.rightClickNode["origin"]["key"]).subscribe(re => {
      if(re["code"] === 0){
        this.successMsg("删除成功！");
        this.dirDeleteWaiting = false;
        this.dirDeleteCancel();
        this.getCatalogue();
      }else{
        this.commonService.wrongCode(re, "dirDelete");
        this.dirDeleteWaiting = false;
      }
    });
  }


  // 文件右键操作
  // 重命名
  fileRename():void{
    this.fileRenameNewName = <any>this.rightClickNode["origin"]["title"];
    this.ifShowFileRenameModal = true;
  }
  fileRenameCancel():void{
    this.ifShowFileRenameModal = false;
    this.fileRenameNewName = null;
  }
  fileRenameOk():void{
    if(!this.fileRenameNewName){
      this.errorMsg("请输入标题!");
      return;
    }
    this.fileRenameWaiting = true;
    this.commonService.fileRename(this.token, <any>this.rightClickNode["origin"]["key"], this.fileRenameNewName).subscribe(re => {
      if(re["code"] === 0){
        this.successMsg("重命名成功！");
        this.fileRenameWaiting = false;
        this.fileRenameCancel();
        this.getCatalogue();
      }else{
        this.commonService.wrongCode(re, "fileRename");
        this.fileRenameWaiting = false;
      }
    });
  }
  // 隐藏公开
  fileChangePrivate(){
    this.commonService.fileChangePrivate(this.token, <any>this.rightClickNode["origin"]["key"]).subscribe(re => {
      if(re["code"] === 0){
        this.successMsg("修改成功！");
        this.getCatalogue();
      }else{
        this.commonService.wrongCode(re, "fileChangePrivate");
      }
    });
  }
  // 文件删除
  fileDelete():void{
    this.ifShowFileDeleteModal = true;
  }
  fileDeleteCancel():void{
    this.ifShowFileDeleteModal = false;
  }
  fileDeleteOk():void{
    this.fileDeleteWaiting = true;
    this.commonService.fileDelete(this.token, <any>this.rightClickNode["origin"]["key"]).subscribe(re => {
      if(re["code"] === 0){
        this.successMsg("删除成功！");
        this.fileDeleteWaiting = false;
        this.fileDeleteCancel();
        this.getCatalogue();
        this.router.navigateByUrl("/main");
      }else{
        this.commonService.wrongCode(re, "fileDelete");
        this.fileDeleteWaiting = false;
      }
    });
  }

  // 剪切
  cutFrom(){
    if(<any>this.rightClickNode["origin"]["key"] === 0){
      this.errorMsg("禁止移动根目录！");
      return;
    }
    this.cutChildId = <any>this.rightClickNode["origin"]["key"];
  }
  cutTo(){
    let cutParentId = <any>this.rightClickNode["origin"]["key"];
    let flag = false;
    let tempId = cutParentId;
    while(true){
      if(tempId === null){
        break;
      }
      if(tempId === this.cutChildId){
        flag = true;
      }
      tempId = this.catalogue.filter(record => record["id"] === tempId)[0]["parentId"];
    }
    if(flag){
      this.errorMsg("禁止以子文件夹为目标目录！");
      return;
    }
    this.commonService.cut(this.token, this.cutChildId, cutParentId).subscribe(re => {
      if(re["code"] === 0){
        this.successMsg("修改成功！");
        this.cutChildId = null;
        this.getCatalogue();
      }else{
        this.cutChildId = null;
        this.commonService.wrongCode(re, "cut");
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

  log(data: any){
    console.log(data);
  }
}
