import { Types } from 'mongoose';


export interface IInvitation {
  token: string;
  description: string;
}

export interface IInvitationDoc<T_id = Types.ObjectId> extends IInvitation {
}
