import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { NzMessageService } from 'ng-zorro-antd';
import { SESSION_STORAGE, WebStorageService} from 'angular-webstorage-service';




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

  server: string = null;

  constructor(
    public http: HttpClient,
    private message: NzMessageService,
    @Inject(SESSION_STORAGE) private sessionStorage: WebStorageService,
  ) { }

  // 初始化地址
  addressInit(){
    //let host = window.location.host;
    let host = document.domain
    this.server = "http://" + host + "/php";
    this.sessionStorage.set("serverPath", this.server);
  }

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

  // 上传图片
  uploadPicture(data: any){
    return this.http.post(this.server + "/UploadPicture.php", data)
    .pipe(
      catchError(this.handleError('uploadPicture', data))
    );
  }

  // 删除图片
  deletePictures(token0: string, pictureList0: string[]){
    let data = {
      token: token0,
      pictureList: pictureList0
    }
    return this.http.post(this.server + "/DeletePictures.php", data)
    .pipe(
      catchError(this.handleError('deletePictures', data))
    );
  }

  // 保存笔记
  saveNote(token0: string, note0: any){
    let data = {
      token: token0,
      note: note0
    }
    return this.http.post(this.server + "/SaveNote.php", data)
    .pipe(
      catchError(this.handleError('deletePictures', data))
    );
  }

  // 保存设置
  saveConfig(token0: string, config0: any){
    let data = {
      token: token0,
      config: config0
    }
    return this.http.post(this.server + "/SaveConfig.php", data)
    .pipe(
      catchError(this.handleError('saveConfig', data))
    );
  }

  // 保存密码
  savePassword(token0: string, password0: any){
    let data = {
      token: token0,
      password: this.md5(password0)
    }
    return this.http.post(this.server + "/SavePassword.php", data)
    .pipe(
      catchError(this.handleError('savePassword', data))
    );
  }

  // 清除冗余数据
  emptyUselessData(token0: string){
    let data = {
      token: token0
    }
    return this.http.post(this.server + "/EmptyUselessData.php", data)
    .pipe(
      catchError(this.handleError('emptyUselessData', data))
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

  md5(md5str) {
    var createMD5String = function(string) {
        var x = Array()
        var k, AA, BB, CC, DD, a, b, c, d
        var S11 = 7,
            S12 = 12,
            S13 = 17,
            S14 = 22
        var S21 = 5,
            S22 = 9,
            S23 = 14,
            S24 = 20
        var S31 = 4,
            S32 = 11,
            S33 = 16,
            S34 = 23
        var S41 = 6,
            S42 = 10,
            S43 = 15,
            S44 = 21
        string = uTF8Encode(string)
        x = convertToWordArray(string)
        a = 0x67452301
        b = 0xEFCDAB89
        c = 0x98BADCFE
        d = 0x10325476
        for (k = 0; k < x.length; k += 16) {
            AA = a
            BB = b
            CC = c
            DD = d
            a = FF(a, b, c, d, x[k + 0], S11, 0xD76AA478)
            d = FF(d, a, b, c, x[k + 1], S12, 0xE8C7B756)
            c = FF(c, d, a, b, x[k + 2], S13, 0x242070DB)
            b = FF(b, c, d, a, x[k + 3], S14, 0xC1BDCEEE)
            a = FF(a, b, c, d, x[k + 4], S11, 0xF57C0FAF)
            d = FF(d, a, b, c, x[k + 5], S12, 0x4787C62A)
            c = FF(c, d, a, b, x[k + 6], S13, 0xA8304613)
            b = FF(b, c, d, a, x[k + 7], S14, 0xFD469501)
            a = FF(a, b, c, d, x[k + 8], S11, 0x698098D8)
            d = FF(d, a, b, c, x[k + 9], S12, 0x8B44F7AF)
            c = FF(c, d, a, b, x[k + 10], S13, 0xFFFF5BB1)
            b = FF(b, c, d, a, x[k + 11], S14, 0x895CD7BE)
            a = FF(a, b, c, d, x[k + 12], S11, 0x6B901122)
            d = FF(d, a, b, c, x[k + 13], S12, 0xFD987193)
            c = FF(c, d, a, b, x[k + 14], S13, 0xA679438E)
            b = FF(b, c, d, a, x[k + 15], S14, 0x49B40821)
            a = GG(a, b, c, d, x[k + 1], S21, 0xF61E2562)
            d = GG(d, a, b, c, x[k + 6], S22, 0xC040B340)
            c = GG(c, d, a, b, x[k + 11], S23, 0x265E5A51)
            b = GG(b, c, d, a, x[k + 0], S24, 0xE9B6C7AA)
            a = GG(a, b, c, d, x[k + 5], S21, 0xD62F105D)
            d = GG(d, a, b, c, x[k + 10], S22, 0x2441453)
            c = GG(c, d, a, b, x[k + 15], S23, 0xD8A1E681)
            b = GG(b, c, d, a, x[k + 4], S24, 0xE7D3FBC8)
            a = GG(a, b, c, d, x[k + 9], S21, 0x21E1CDE6)
            d = GG(d, a, b, c, x[k + 14], S22, 0xC33707D6)
            c = GG(c, d, a, b, x[k + 3], S23, 0xF4D50D87)
            b = GG(b, c, d, a, x[k + 8], S24, 0x455A14ED)
            a = GG(a, b, c, d, x[k + 13], S21, 0xA9E3E905)
            d = GG(d, a, b, c, x[k + 2], S22, 0xFCEFA3F8)
            c = GG(c, d, a, b, x[k + 7], S23, 0x676F02D9)
            b = GG(b, c, d, a, x[k + 12], S24, 0x8D2A4C8A)
            a = HH(a, b, c, d, x[k + 5], S31, 0xFFFA3942)
            d = HH(d, a, b, c, x[k + 8], S32, 0x8771F681)
            c = HH(c, d, a, b, x[k + 11], S33, 0x6D9D6122)
            b = HH(b, c, d, a, x[k + 14], S34, 0xFDE5380C)
            a = HH(a, b, c, d, x[k + 1], S31, 0xA4BEEA44)
            d = HH(d, a, b, c, x[k + 4], S32, 0x4BDECFA9)
            c = HH(c, d, a, b, x[k + 7], S33, 0xF6BB4B60)
            b = HH(b, c, d, a, x[k + 10], S34, 0xBEBFBC70)
            a = HH(a, b, c, d, x[k + 13], S31, 0x289B7EC6)
            d = HH(d, a, b, c, x[k + 0], S32, 0xEAA127FA)
            c = HH(c, d, a, b, x[k + 3], S33, 0xD4EF3085)
            b = HH(b, c, d, a, x[k + 6], S34, 0x4881D05)
            a = HH(a, b, c, d, x[k + 9], S31, 0xD9D4D039)
            d = HH(d, a, b, c, x[k + 12], S32, 0xE6DB99E5)
            c = HH(c, d, a, b, x[k + 15], S33, 0x1FA27CF8)
            b = HH(b, c, d, a, x[k + 2], S34, 0xC4AC5665)
            a = II(a, b, c, d, x[k + 0], S41, 0xF4292244)
            d = II(d, a, b, c, x[k + 7], S42, 0x432AFF97)
            c = II(c, d, a, b, x[k + 14], S43, 0xAB9423A7)
            b = II(b, c, d, a, x[k + 5], S44, 0xFC93A039)
            a = II(a, b, c, d, x[k + 12], S41, 0x655B59C3)
            d = II(d, a, b, c, x[k + 3], S42, 0x8F0CCC92)
            c = II(c, d, a, b, x[k + 10], S43, 0xFFEFF47D)
            b = II(b, c, d, a, x[k + 1], S44, 0x85845DD1)
            a = II(a, b, c, d, x[k + 8], S41, 0x6FA87E4F)
            d = II(d, a, b, c, x[k + 15], S42, 0xFE2CE6E0)
            c = II(c, d, a, b, x[k + 6], S43, 0xA3014314)
            b = II(b, c, d, a, x[k + 13], S44, 0x4E0811A1)
            a = II(a, b, c, d, x[k + 4], S41, 0xF7537E82)
            d = II(d, a, b, c, x[k + 11], S42, 0xBD3AF235)
            c = II(c, d, a, b, x[k + 2], S43, 0x2AD7D2BB)
            b = II(b, c, d, a, x[k + 9], S44, 0xEB86D391)
            a = addUnsigned(a, AA)
            b = addUnsigned(b, BB)
            c = addUnsigned(c, CC)
            d = addUnsigned(d, DD)
        }
        var tempValue = wordToHex(a) + wordToHex(b) + wordToHex(c) + wordToHex(d)
        return tempValue.toLowerCase()
    }
    var rotateLeft = function(lValue, iShiftBits) {
        return (lValue << iShiftBits) | (lValue >>> (32 - iShiftBits))
    }
    var addUnsigned = function(lX, lY) {
        var lX4, lY4, lX8, lY8, lResult
        lX8 = (lX & 0x80000000)
        lY8 = (lY & 0x80000000)
        lX4 = (lX & 0x40000000)
        lY4 = (lY & 0x40000000)
        lResult = (lX & 0x3FFFFFFF) + (lY & 0x3FFFFFFF)
        if (lX4 & lY4) return (lResult ^ 0x80000000 ^ lX8 ^ lY8)
        if (lX4 | lY4) {
            if (lResult & 0x40000000) return (lResult ^ 0xC0000000 ^ lX8 ^ lY8)
            else return (lResult ^ 0x40000000 ^ lX8 ^ lY8)
        } else {
            return (lResult ^ lX8 ^ lY8)
        }
    }
    var F = function(x, y, z) {
        return (x & y) | ((~x) & z)
    }
    var G = function(x, y, z) {
        return (x & z) | (y & (~z))
    }
    var H = function(x, y, z) {
        return (x ^ y ^ z)
    }
    var I = function(x, y, z) {
        return (y ^ (x | (~z)))
    }
    var FF = function(a, b, c, d, x, s, ac) {
        a = addUnsigned(a, addUnsigned(addUnsigned(F(b, c, d), x), ac))
        return addUnsigned(rotateLeft(a, s), b)
    }
    var GG = function(a, b, c, d, x, s, ac) {
        a = addUnsigned(a, addUnsigned(addUnsigned(G(b, c, d), x), ac))
        return addUnsigned(rotateLeft(a, s), b)
    }
    var HH = function(a, b, c, d, x, s, ac) {
        a = addUnsigned(a, addUnsigned(addUnsigned(H(b, c, d), x), ac))
        return addUnsigned(rotateLeft(a, s), b)
    }
    var II = function(a, b, c, d, x, s, ac) {
        a = addUnsigned(a, addUnsigned(addUnsigned(I(b, c, d), x), ac))
        return addUnsigned(rotateLeft(a, s), b)
    }
    var convertToWordArray = function(string) {
        var lWordCount
        var lMessageLength = string.length
        var lNumberOfWordsTempOne = lMessageLength + 8
        var lNumberOfWordsTempTwo = (lNumberOfWordsTempOne - (lNumberOfWordsTempOne % 64)) / 64
        var lNumberOfWords = (lNumberOfWordsTempTwo + 1) * 16
        var lWordArray = Array(lNumberOfWords - 1)
        var lBytePosition = 0
        var lByteCount = 0
        while (lByteCount < lMessageLength) {
            lWordCount = (lByteCount - (lByteCount % 4)) / 4
            lBytePosition = (lByteCount % 4) * 8
            lWordArray[lWordCount] = (lWordArray[lWordCount] | (string.charCodeAt(lByteCount) << lBytePosition))
            lByteCount++
        }
        lWordCount = (lByteCount - (lByteCount % 4)) / 4
        lBytePosition = (lByteCount % 4) * 8
        lWordArray[lWordCount] = lWordArray[lWordCount] | (0x80 << lBytePosition)
        lWordArray[lNumberOfWords - 2] = lMessageLength << 3
        lWordArray[lNumberOfWords - 1] = lMessageLength >>> 29
        return lWordArray
    }
    var wordToHex = function(lValue) {
        var WordToHexValue = '',
            WordToHexValueTemp = '',
            lByte, lCount
        for (lCount = 0; lCount <= 3; lCount++) {
            lByte = (lValue >>> (lCount * 8)) & 255
            WordToHexValueTemp = '0' + lByte.toString(16)
            WordToHexValue = WordToHexValue + WordToHexValueTemp.substr(WordToHexValueTemp.length - 2, 2)
        }
        return WordToHexValue
    }
    var uTF8Encode = function(string) {
        string = string.toString().replace(/\x0d\x0a/g, '\x0a')
        var output = ''
        for (var n = 0; n < string.length; n++) {
            var c = string.charCodeAt(n)
            if (c < 128) {
                output += String.fromCharCode(c)
            } else if ((c > 127) && (c < 2048)) {
                output += String.fromCharCode((c >> 6) | 192)
                output += String.fromCharCode((c & 63) | 128)
            } else {
                output += String.fromCharCode((c >> 12) | 224)
                output += String.fromCharCode(((c >> 6) & 63) | 128)
                output += String.fromCharCode((c & 63) | 128)
            }
        }
        return output
    }
    return createMD5String(md5str)
  }
}
