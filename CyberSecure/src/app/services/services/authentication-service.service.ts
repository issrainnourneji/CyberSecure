import { HttpClient, HttpContext } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { StrictHttpResponse } from '../strict-http-response';
import { Confirm$Params } from '../fn/authentication/confirm';
import { confirm } from '../fn/authentication/confirm';
import { BaseService } from '../base-service';
import { ApiConfiguration } from '../api-configuration';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationServiceService extends BaseService {

  constructor(config: ApiConfiguration,http: HttpClient) {
    super(config,http);
   }

   /** Path part for operation `confirm()` */
  static readonly ConfirmPath = '/auth/activate-account';
  confirm$Response(params: Confirm$Params, context?: HttpContext): Observable<StrictHttpResponse<void>> {
    return confirm(this.http, this.rootUrl, params, context);
  }
  confirm(params: Confirm$Params, context?: HttpContext): Observable<void> {
    return this.confirm$Response(params, context).pipe(
      map((r: StrictHttpResponse<void>): void => r.body)
    );
  }
}
