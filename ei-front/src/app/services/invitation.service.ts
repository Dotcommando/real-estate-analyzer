import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { environment } from '../../environments/environment';
import { IResponse } from '../types';


@Injectable({
  providedIn: 'root',
})
export class InvitationService {
  constructor(
    private http: HttpClient,
  ) {
  }

  public validateInvitationToken(rawToken: string): Observable<IResponse<{ valid: boolean }>> {
    return this.http.post<IResponse<{ valid: boolean }>>(
      `${environment.origin}/api/v1/validate-invitation`,
      {
        rawToken,
      },
    );
  }
}
