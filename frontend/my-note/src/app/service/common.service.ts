import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { NzMessageService } from 'ng-zorro-antd';

import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type':  'application/json',
  })
};


@Injectable({
  providedIn: 'root'
})
export class CommonService {

  server: string = "http://127.0.0.1:80/php";

  constructor(
    public http: HttpClient,
    private message: NzMessageService
  ) { }

  // 登录反馈
  passwordCheck(data: any){
    return this.http.post(this.server + "/Login.php", data)
    .pipe(
      catchError(this.handleError('passwordCheck:', []))
    );
  }

  // 获取设置
  getConfig(){
    return this.http.get(this.server + "/Config.php")
    .pipe(
      catchError(this.handleError('handleError:', []))
    );
  }

  // 获取目录
  getCatalogue(token0: string){
    let data = {
      token: token0,
    };
    return this.http.post(this.server + "/Catalogue.php", data)
    .pipe(
      catchError(this.handleError('getCatalogue:', []))
    );
  }

  // 文件夹重命名
  dirRename(token0: string, id0: number, name0: string){
    let data = {
      token: token0,
		  operation: "rename",
		  id: id0,
		  name: name0,
      parentId: 0,
      private: true
    };
    return this.http.post(this.server + "/DirOperation.php", data)
    .pipe(
      catchError(this.handleError('DirOperation:', []))
    );
  }
  // 新建文件夹
  newDir(token0: string, parentId0: number, name0: string){
    let data = {
      token: token0,
		  operation: "addDir",
		  id: 0,
		  name: name0,
      parentId: parentId0,
      private: true
    };
    return this.http.post(this.server + "/DirOperation.php", data)
    .pipe(
      catchError(this.handleError('DirOperation:', []))
    );
  }
  // 新建文件
  newFile(token0: string, parentId0: number, name0: string){
    let data = {
      token: token0,
		  operation: "addFile",
		  id: 0,
		  name: name0,
      parentId: parentId0,
      private: true
    };
    return this.http.post(this.server + "/DirOperation.php", data)
    .pipe(
      catchError(this.handleError('DirOperation:', []))
    );
  }
  // 文件夹隐藏公开
  dirChangePrivate(token0: string, id0: number){
    let data = {
      token: token0,
		  operation: "changePrivate",
		  id: id0,
		  name: "dirName",
      parentId: 0,
      private: true
    };
    return this.http.post(this.server + "/DirOperation.php", data)
    .pipe(
      catchError(this.handleError('DirOperation:', []))
    );
  }
  // 删除文件夹
  dirDelete(token0: string, id0: number){
    let data = {
      token: token0,
		  operation: "delete",
		  id: id0,
		  name: "dirName",
      parentId: 0,
      private: true
    };
    return this.http.post(this.server + "/DirOperation.php", data)
    .pipe(
      catchError(this.handleError('DirOperation:', []))
    );
  }
  

  // 文件重命名
  fileRename(token0: string, id0: number, name0: string){
    let data = {
      token: token0,
		  operation: "rename",
		  id: id0,
		  name: name0,
      parentId: 0,
      private: true
    };
    return this.http.post(this.server + "/FileOperation.php", data)
    .pipe(
      catchError(this.handleError('FileOperation:', []))
    );
  }
  // 文件隐藏公开
  fileChangePrivate(token0: string, id0: number){
    let data = {
      token: token0,
		  operation: "changePrivate",
		  id: id0,
		  name: "fileName",
      parentId: 0,
      private: true
    };
    return this.http.post(this.server + "/FileOperation.php", data)
    .pipe(
      catchError(this.handleError('FileOperation:', []))
    );
  }
  // 删除文件
  fileDelete(token0: string, id0: number){
    let data = {
      token: token0,
		  operation: "delete",
		  id: id0,
		  name: "fileName",
      parentId: 0,
      private: true
    };
    return this.http.post(this.server + "/FileOperation.php", data)
    .pipe(
      catchError(this.handleError('FileOperation:', []))
    );
  }

  // 剪切
  cut(token0: string, id0: number, parentId0: number){
    let data = {
      token: token0,
		  operation: "cut",
		  id: id0,
		  name: "name",
      parentId: parentId0,
      private: true
    };
    return this.http.post(this.server + "/DirOperation.php", data)
    .pipe(
      catchError(this.handleError('cut:', []))
    );
  }

  // 获取note
  getNote(token0: string, id0: number){
    let data = {
      token: token0,
      id: id0
    }
    return this.http.post(this.server + "/GetNote.php", data)
    .pipe(
      catchError(this.handleError('GetNote:', []))
    );
  }
  

  // 请求异常的处理
  wrongCode(re: any, functionName: string){
    if(re["code"] === 0){
      return;
    }
    if(re["code"] === -1){
      this.message.create("error", "密码错误！");
    }else if(re["code"] === -2){
      this.message.create("error", "错误token，请重新登录！");
    }else if(re["code"] === -3){
      this.message.create("error", "错误 note id！");
    }else if(re["code"] === -4){
      this.message.create("error", "修改失败！");
    }else if(re["code"] === -5){
      this.message.create("error", "修改失败！");
    }else{
      this.message.create("error", "fail to " + functionName);
    }
  }
  private log(message: any){
    this.message.create("error", "error: " + message, {
      nzDuration: 15000,
      nzPauseOnHover: true
    });
    console.log("error: ", + message); 
  }
  private handleError<T> (operation = 'operation', result?: any) {
    return (error: any): Observable<T> => { 
      console.error(error); 
      this.log(`${operation} failed: ${error.message}`);   
      return of(result as T);
    };
  }
}
