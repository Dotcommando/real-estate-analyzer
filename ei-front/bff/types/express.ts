import { NextFunction, Request, Response } from 'express';


export interface Req extends Request {}
export interface Res extends Response {}
export interface Next extends NextFunction {}
