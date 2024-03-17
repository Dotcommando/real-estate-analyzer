import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import { IRentResidentialId, IResponse, ISaleResidentialId } from '../../types';


@Injectable({
  providedIn: 'root',
})
export class SearchService {
  constructor(
    private http: HttpClient,
  ) {
  }

  public search(queryString: string): Observable<IResponse<{
    result: IRentResidentialId[] | ISaleResidentialId[];
    total: number;
  }>> {
    return this.http.get<IResponse<{result: IRentResidentialId[] | ISaleResidentialId[]; total: number}>>(
      `${environment.origin}/api/v1/search${queryString}`,
    );
  }
}
