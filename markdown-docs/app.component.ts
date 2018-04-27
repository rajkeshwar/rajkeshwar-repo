/*
 * @Author: Rajkeshwar Prasad (rajkeshwar@dbs.com) 
 * @Date: 2018-04-24 11:51:44 
 * @Last Modified by: Rajkeshwar Prasad
 * @Last Modified time: 2018-04-24 18:09:02
 */

import { Component, HostListener, ViewChild, ElementRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DomSanitizer, SafeResourceUrl, SafeUrl } from '@angular/platform-browser';
import { CODE_SNIPPETS } from './code-snippets';
import { Broadcaster } from './broadcaster';

declare var require: any;
declare var PR: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  public title = 'app';
  public activeDevice = 'android';
  public treeJson: any;
  public snippets: any;

  @ViewChild('markdown') markdown: ElementRef;

  public demoUrl = 'assets/img/actionsheet.gif';

  public device = {
    android: 'background: url("assets/img/android.png") no-repeat',
    ios: 'background: url("assets/img/iosphone.png") no-repeat'
  };

  constructor(
    private sanitizer: DomSanitizer,
    private http: HttpClient,
    private broadcaster: Broadcaster) { }

  ngOnInit() {

    this.http.get('assets/data/tree-view.json')
      .subscribe(treeJson => this.treeJson = [treeJson]);
    
    this.snippets = CODE_SNIPPETS['./components/Anatomy.md'];
    setTimeout(_ => this.reArrangeImages(), 100);

    this.broadcaster.on('select')
      .subscribe((item: any) => {
        if (item.type === 'file') {
          this.snippets = CODE_SNIPPETS[item.path];
          setTimeout(_ => this.reArrangeImages(), 100);
        }
      })
  }

  public reArrangeImages() {
    let imageList = this.markdown.nativeElement.querySelectorAll('img');
    let previewButtons = this.markdown.nativeElement.querySelectorAll('[image-src]');

    Array.from(document.querySelectorAll('pre.line-numbers')).forEach(pre => {
      pre.classList.add('prettyprint');
    });
    PR.prettyPrint();

    Array.from(imageList).forEach((image: HTMLImageElement) => {
      image.style.height = '1px';
      image.parentElement.style.display = 'flex';
      // image.parentElement.style.justifyContent = 'space-between';
    })

    Array.from(previewButtons).forEach((button: HTMLImageElement) => {
      button.parentElement.removeChild(button);
    })

    Array.from(imageList).forEach((image: HTMLImageElement) => {
      let button = document.createElement('div');
          button.className = 'preview-btn';
          button.innerText = /\/ios\//.test(image.src) ? 'iOS' : 'Android';
          button.setAttribute('image-src', image.src);
          button.addEventListener('click', () => {
            this.demoUrl = image.src;
            this.activate(button.innerText.toLowerCase());
            Array.from(button.parentElement.children).forEach(btn => {
              btn.classList.remove('preview-btn--active');
            });
            button.classList.add('preview-btn--active');
          }, true);
      
      image.parentElement.appendChild(button);
      image.parentElement.removeChild(image);
    })
    
  }

  public activate(deviceType) {
    this.activeDevice = deviceType;
    return this.device[deviceType];
  }

  public getStyle() {
    const style = this.device[this.activeDevice] || '';
    return this.sanitizer.bypassSecurityTrustStyle(style);
  }

  @HostListener('window:scroll', ['$event']) reveal(evt) {
    
    const elements: any = document.querySelectorAll('.demo-imgs img');
    const len = elements.length;

    for (let count = 0; count < len; count++) {

      /* offsetParent may not be the body if the element container is positioned. 
       * Therefore we need to find the distance from the body by adding all the 
       * offsetTop's of all offsetParent's.  
       */

      let offsetParentTop = 0;
      let temp: any = elements[count];
      
      do {
        if (!isNaN(temp.offsetTop)) {
          offsetParentTop += temp.offsetTop;
        }
      } while (temp = temp.offsetParent)
      
      let pageYOffset = window.pageYOffset;
      let viewportHeight = window.innerHeight;
      if (offsetParentTop > pageYOffset && offsetParentTop < pageYOffset + viewportHeight) {
        this.demoUrl = elements[count].src;
      } 
    }
  }

  public isElementVisible(el) {
    var rect     = el.getBoundingClientRect(),
        vWidth   = window.innerWidth || document.documentElement.clientWidth,
        vHeight  = window.innerHeight || document.documentElement.clientHeight,
        efp      = (x, y) => document.elementFromPoint(x, y);     

      // Return false if it's not in the viewport
      if (rect.right < 0 || rect.bottom < 0 || rect.left > vWidth || rect.top > vHeight)
          return false;

      // Return true if any of its four corners are visible
      return (
            el.contains(efp(rect.left,  rect.top))
        ||  el.contains(efp(rect.right, rect.top))
        ||  el.contains(efp(rect.right, rect.bottom))
        ||  el.contains(efp(rect.left,  rect.bottom))
      );
  }

}
