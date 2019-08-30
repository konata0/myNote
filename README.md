# myNote
利用前后端共同搭建的图文代码记录程序，可用于笔记记录，博客编写......

## 代码说明
前端采用 [Angular CLI](https://github.com/angular/angular-cli)，源码位于/frontend下。

后端采用 apache2.4 + php7，源码位于/backstage下。

打包部署文件位于/release下。可自行配置apache与php，若出现找不到文件请自行配置.htaccess。

## 使用说明
登录部分，初始密码123456，密码可于设置中修改，如果忘记密码，可直接在/php/security/data.json中修改password一项，其值为密码MD5码。
目录部分，可点击右键进行文件夹及文件的编辑操作。
文章部分，点击编辑按钮开启文章编辑，对具体内容右键点击可进行具体编辑。图片上传可使用 ctrl + v 直接进行。
