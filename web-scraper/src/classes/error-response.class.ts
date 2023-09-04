import { HttpStatus } from '@nestjs/common';

import { ITcpMessageResult, IUrlData } from '../types';


export class ErrorResponse implements ITcpMessageResult<null> {
  public success: boolean;
  public data: null;
  public urlData: IUrlData;
  public errors: string[];

  constructor(status: number | HttpStatus, errorMessages: string[] | string) {
    this.success = false;
    this.data = null;

    this.errors = Array.isArray(errorMessages)
      ? [ ...errorMessages ]
      : [ errorMessages ];
  }
}
