import { Component, OnInit } from '@angular/core';

import { CommonService } from '../../service/common.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.styl']
})
export class DashboardComponent implements OnInit {

  config: any = null;
  configInit: boolean = false;

  canvas: any = null;
  cvs: any = null;
  width: number = null;
  hight: number = null;

  maxR: number = null;

  rSpeed: number = 3;
  time: number = 20;

  circleList: Array<any> = [];


  constructor(
    private commonService: CommonService,
  ) { }

  ngOnInit() {
    this.canvas = document.getElementById('canvas');

    this.refreshSize();
    
    this.getConfig();

    this.anime();
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

  myClick(event: any){
    let x0 = event["clientX"] - 200;
    let y0 = event["clientY"] - 40;
    let newCircle = {
      x: x0,
      y: y0,
      r: 1
    }
    this.circleList.push(newCircle);
  }

  anime(){
    this.clean();
    this.refreshSize();
    this.circleList.forEach(circle => {
      if(circle["r"] > 0){
        this.cvs.beginPath();
        this.cvs.arc(circle["x"], circle["y"], circle["r"], 0, 2 * Math.PI);
        this.cvs.closePath();
        this.cvs.stroke();
        circle["r"] += this.rSpeed;
        if(circle["r"] * circle["r"] > this.maxR){
          circle["r"] = -1;
        }
      } 
    });
    setTimeout(() => {
      this.anime();
    }, this.time);
  }

  clean(){
    this.cvs.clearRect(0, 0, this.width, this.hight);
  }

  refreshSize(){
    this.width = document.getElementById('dashboard-page').clientWidth;
    this.hight = document.getElementById('dashboard-page').clientHeight;
    this.canvas.width = this.width;
    this.canvas.height = this.hight;
    this.maxR = this.width * this.width + this.hight * this.hight;
    this.cvs = this.canvas.getContext('2d');  
    this.cvs.strokeStyle = '#1890ff';
    this.cvs.lineWidth = 3;
  }

}
