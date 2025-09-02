import { NgModule, Optional, SkipSelf } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Auth } from './services/auth';
import { Token } from './services/token';
import { Loading } from './services/loading';
import { Notification} from './services/notification';

@NgModule({
  imports: [ CommonModule ],
  providers: [
    Auth,
    Token,
    Loading,
    Notification
  ]
})
export class CoreModule {
  constructor(@Optional() @SkipSelf() parentModule: CoreModule) {
    if (parentModule) {
      throw new Error('CoreModule is already loaded. Import it in the AppModule only');
    }
  }
}
