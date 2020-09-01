import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MenubarService {
  private _visible = new Subject<boolean>();
  visible=false;
  
  constructor() { }
    
  public visibleToggleAction(){
    if(this.visible==true){
      this.visible=false;
      this._visible.next(this.visible);
    } else{
      this.visible=true;
      this._visible.next(this.visible);      
    }
    return this.visible;
  }

  public getVisible$():Observable<boolean>{
    return this._visible.asObservable();
  }
}
