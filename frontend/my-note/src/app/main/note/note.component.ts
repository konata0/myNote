import { Component, OnInit, Inject } from '@angular/core';
import { LOCAL_STORAGE, SESSION_STORAGE, WebStorageService} from 'angular-webstorage-service';
import { NzContextMenuService, NzDropdownMenuComponent } from 'ng-zorro-antd/dropdown';

import { DomSanitizer } from '@angular/platform-browser';
import { Router, ActivatedRoute } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd';
import { NzFormatEmitEvent, NzTreeNode } from 'ng-zorro-antd/core';

import { CommonService } from '../../service/common.service';

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
  editId: number = null;
  rightClickId: number = null;

  constructor(
    private route: ActivatedRoute,
    private commonService: CommonService,
    private passSecurity: DomSanitizer,
    private nzContextMenuService: NzContextMenuService,
    @Inject(LOCAL_STORAGE) private localStorage: WebStorageService,
    @Inject(SESSION_STORAGE) private sessionStorage: WebStorageService,
  ) { }

  ngOnInit() {
    this.token = this.sessionStorage.get("myNoteToken");
    this.noteId = +this.route.snapshot.paramMap.get('id');
    this.getNote();
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
    this.ifShowEditOffModal = false;
    this.editId = null;
    this.rightClickId = null;
    this.editMode = false;
    this.getNote();
  }
  editSave(){
    
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
	    size: 0
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
  // 删除
  deleteItem(){
    (<Array<any>>this.note["data"]).splice(this.rightClickId, 1);
    this.rightClickId = null;
    this.editId = null;
  }
}
