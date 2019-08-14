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

  server: string = "https://easy-mock.com/mock/5d1f027a62ae1a2f96d8ec5b";

  constructor(
    public http: HttpClient,
    private message: NzMessageService
  ) { }

  // 登录反馈
  passwordCheck(data: any){
    return this.http.post(this.server + "/Login", data)
    .pipe(
      catchError(this.handleError('passwordCheck:', []))
    );
  }

  // 获取设置
  getConfig(){
    return this.http.get(this.server + "/Config")
    .pipe(
      catchError(this.handleError('handleError:', []))
    );
  }




  // 请求异常的处理
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
