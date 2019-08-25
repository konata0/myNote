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
  selector: 'app-note',
  templateUrl: './note.component.html',
  styleUrls: ['./note.component.styl']
})
export class NoteComponent implements OnInit {

  token: string = null;
  noteId: number = null;

  note: any = null;
  noteInit: boolean = false;

  editMode: boolean = false;
  ifShowEditOffModal: boolean = false;
  ifShowSaveModal: boolean = false;
  editId: number = null;
  rightClickId: number = null;
  editOffWaiting: boolean = false;
  saveWaiting: boolean = false;

  ifShowSetIdModal: boolean = false;
  setIdNewId: number = null;

  uploadByFileWaiting: boolean = false;
  deletePictureList: string[] = [];
  addPictureList: string[] = [];

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

    this.route.queryParams.subscribe(params => {
      if(this.editMode){
        this.message.create("error", "请先保存编辑！");
        return;
      }
      if(!params["id"]){
        this.router.navigateByUrl("/main");
      }else{
        this.noteId = +params["id"];
        this.getNote();
      }   
    });    
  }

  getNote(){
    this.noteInit = false;
    this.commonService.getNote(this.token, this.noteId).subscribe(re => {
      if(re["code"] === 0){
        this.note = re["data"];
        this.dataSort(-1);
        this.notePretreat();
      }else{
        this.commonService.wrongCode(re, "getNote");
      }
    });
  }

  // 数据预处理
  notePretreat(){
    this.noteInit = false;
    (<Array<any>>this.note["data"]).forEach(item => {
      let server: string = "http://127.0.0.1:80/php/note/img/";
      if(item["type"] === "img"){
        item["safeURL"] = this.passSecurity.bypassSecurityTrustResourceUrl(server + item["content"]);
      }
    });
    this.noteInit = true;
  }
  
  // 除去null，排序并修正id
  sortById = function(item1: any, item2: any){
    return item1["id"] - item2["id"];
  }
  dataSort(originalId: number){
    this.note["data"] = (<Array<any>>this.note["data"]).filter(item => item);
    (<Array<any>>this.note["data"]).sort(this.sortById);
    let newId = -1;
    for(let i = 0; i <= (<Array<any>>this.note["data"]).length - 1; i++){
      if((<Array<any>>this.note["data"])[i]["id"] === originalId){
        newId = i;
      }
      (<Array<any>>this.note["data"])[i]["id"] = i;
    }
    return newId;
  }

  // 编辑模式
  editOn(){
    this.editId = null;
    this.rightClickId = null;
    this.editMode = true;
  }
  editOff(){
    this.ifShowEditOffModal = true;
  }
  editOffCancel(){
    this.ifShowEditOffModal = false;
  }
  editOffOk(){
    this.editOffWaiting = true;
    this.commonService.deletePictures(this.token, this.addPictureList).subscribe(re => {
      if(re["code"] === 0){
        this.ifShowEditOffModal = false;
        this.editId = null;
        this.rightClickId = null;
        this.editMode = false;
        this.getNote();
        this.addPictureList = [];
        this.deletePictureList = [];
        this.editOffWaiting = false;
      }else{
        this.editOffWaiting = false;
        this.commonService.wrongCode(re, "deletePictures");
      }
    });
  }
  editSave(){
    this.ifShowSaveModal = true;
  }
  saveCancel(){
    this.ifShowSaveModal = false;
  }
  saveOk(){
    this.saveWaiting = true;
    this.commonService.deletePictures(this.token, this.deletePictureList).subscribe(re => {
      if(re["code"] === 0){
        this.note["updateTime"] = format(new Date(), "YYYY-MM-DD HH:mm:ss");
        this.commonService.saveNote(this.token, this.note).subscribe(re0 => {
          if(re0["code"] === 0){
            this.ifShowSaveModal = false;
            this.saveWaiting = false;    
            this.editId = null;
            this.rightClickId = null;
            this.editMode = false;
            this.getNote();
            this.addPictureList = [];
            this.deletePictureList = [];
          }else{
            this.saveWaiting = false;
            this.commonService.wrongCode(re0, "saveNote");
          }
        });
      }else{
        this.saveWaiting = false;
        this.commonService.wrongCode(re, "deletePictures");
      }
    });
  }

  // 添加操作
  contextMenu($event: MouseEvent, menu: NzDropdownMenuComponent, id: number): void {
    if(!this.editMode){
      return;
    }
    this.rightClickId = id;
    this.nzContextMenuService.create($event, menu);
  }
  addItem(offset: number, type0: string){
    let newId = this.rightClickId + offset;
    let newItem = {
      id: newId,
	    type: type0,
	    content: null,
	    size: type0==="img"?100:0
    };
    (<Array<any>>this.note["data"]).push(newItem);
    newId = this.dataSort(newId);
    this.rightClickId = null;
    this.editId = newId;
  };
  // 编辑操作
  setEditId(id: number){
    if(id === null){
      this.rightClickId = null;
      this.editId = null;
    }else if(id === -1){
      this.editId = this.rightClickId;
    }else{
      this.editId = id;
    }
  }
  // 修改Id（顺序）
  setId(){
    this.setIdNewId = null;
    this.ifShowSetIdModal = true;
  }
  setIdCancel(){
    this.ifShowSetIdModal = false;
    this.setIdNewId = null;
    this.rightClickId = null;
    this.editId = null
  }
  setIdOk(){
    if(this.setIdNewId === null || this.setIdNewId.toString() === ""){
      this.message.create("error", "请输入合适的数值！");
      return;
    }
    (<Array<any>>this.note["data"])[this.rightClickId]["id"] = this.setIdNewId;
    this.setIdCancel();
    this.dataSort(-1);
  }
  // 删除
  deleteItem(){
    if((<Array<any>>this.note["data"]).length <= 1){
      this.message.create("error", "文件必须包含一定内容！");
      return false;
    }
    if((<Array<any>>this.note["data"])[this.rightClickId]["type"] === "img"){
      if((<Array<any>>this.note["data"])[this.rightClickId]["content"]){
        this.deletePictureList.push((<Array<any>>this.note["data"])[this.rightClickId]["content"]);
      }
    }
    (<Array<any>>this.note["data"]).splice(this.rightClickId, 1);
    this.dataSort(-1);
    this.rightClickId = null;
    this.editId = null;
  }

  // 上传图片
  uploadByFile = (file: UploadFile): boolean => {
    let gifFlag: boolean = !(file.name.lastIndexOf(".gif") <= 0 || file.name.lastIndexOf(".gif") != file.name.length - 4);
    let pngFlag: boolean = !(file.name.lastIndexOf(".png") <= 0 || file.name.lastIndexOf(".png") != file.name.length - 4);
    let bmpFlag: boolean = !(file.name.lastIndexOf(".bmp") <= 0 || file.name.lastIndexOf(".bmp") != file.name.length - 4);
    let jpgFlag: boolean = !(file.name.lastIndexOf(".jpg") <= 0 || file.name.lastIndexOf(".jpg") != file.name.length - 4);
    let jpegFlag: boolean = !(file.name.lastIndexOf(".jpeg") <= 0 || file.name.lastIndexOf(".jpeg") != file.name.length - 5);
    if(!(gifFlag || pngFlag || bmpFlag || jpgFlag || jpegFlag)){
      this.message.create("error", "请选择正确格式的图片！（gif/png/bmp/jpg/jpeg）");
      return false;
    }
    if(file.size > 30 * 1024 *1024){
      this.message.create("error", "文件过大（30MB）！");
      return false;
    }


    this.uploadByFileWaiting = true;

    const formData = new FormData();
    formData.append("token", this.token);
    formData.append("picture", <any>file);

    this.commonService.uploadPicture(formData).subscribe(re => {
      if(re["code"] === 0){
        this.uploadByFileWaiting = false;
        this.addPictureList.push(re["content"]);
        if((<Array<any>>this.note["data"])[this.editId]["content"]){
          this.deletePictureList.push((<Array<any>>this.note["data"])[this.editId]["content"]);
        }
        (<Array<any>>this.note["data"])[this.editId]["content"] = re["content"];
        this.notePretreat();
      }else{
        this.uploadByFileWaiting = false;
        this.commonService.wrongCode(re, "uploadByFile");
      }
    });
    return false;
  };

}
