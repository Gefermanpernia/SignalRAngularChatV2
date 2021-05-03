import { Component, OnInit, OnDestroy } from '@angular/core';
import { LoadingOverlayService } from '../services/loading-overlay.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-loading',
  templateUrl: './loading.component.html',
  styleUrls: ['./loading.component.scss']
})
export class LoadingComponent implements OnInit, OnDestroy {

  constructor(private loadingService:LoadingOverlayService) { }

  private $overlaySuscription!:Subscription;
  displayLoading=false;
  ngOnInit(): void {
    this.displayLoading = this.loadingService.shouldShowOverlay;

    this.$overlaySuscription = this.loadingService
    .$shouldShowOverlay
    .subscribe(value => this.displayLoading = value);

  }

  ngOnDestroy(): void {
    this.$overlaySuscription?.unsubscribe();
  }


}
