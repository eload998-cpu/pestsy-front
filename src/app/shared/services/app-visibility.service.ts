import { Injectable, Renderer2, RendererFactory2 } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AppVisibilityService {
  private renderer: Renderer2;

  constructor(rendererFactory: RendererFactory2, private router: Router) {
    this.renderer = rendererFactory.createRenderer(null, null);
    this.initVisibilityListener();
  }

  private initVisibilityListener(): void {
    this.renderer.listen('document', 'visibilitychange', () => {
      if (document.hidden) {
        this.handlePause();
      } else {
        this.handleResume();
      }
    });
  }

  private handlePause(): void {
    //console.log(' #### app is in background');
    // Add your background logic here
  }

  private handleResume(): void {
    //console.log(' #### app is in Foreground');
    // Add your foreground logic here
  }
}
