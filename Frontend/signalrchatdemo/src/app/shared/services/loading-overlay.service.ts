import { Injectable, OnDestroy } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { finalize, take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class LoadingOverlayService implements OnDestroy {
  private waitCount:number=0;
  private $_shouldShowOverlay:Subject<boolean> = new Subject<boolean>();
  public $shouldShowOverlay:Observable<boolean> = this.$_shouldShowOverlay.asObservable();


  get shouldShowOverlay():boolean{
      return this.waitCount>0;
  }

  constructor() {

  }

  public showLoader(){
    this.waitCount++;
    this.updateLoaderStatus();
  }

  public hideLoader(){
    this.waitCount--;
    this.updateLoaderStatus();
  }



  public interceptObservableAndShowLoading<T>(request:Observable<T>)
  :Observable<T>{
    this.showLoader();
    return request.pipe(
      take(1),
      finalize(()=>{
        this.hideLoader();
      })
    );
  }


  public interceptPromiseAndShowLoading<T>(request:Promise<T>):Promise<T>{
    return new Promise<T>((resolve,reject)=>{
      this.showLoader();
      request
      .then(resp => resolve(resp))
      .catch(err => reject(err))
      .finally(()=>this.hideLoader());
    })
  }

  private updateLoaderStatus(){
    this.$_shouldShowOverlay.next(this.waitCount>0);

  }
  ngOnDestroy(): void {

    this.$_shouldShowOverlay.complete();
  }
}
