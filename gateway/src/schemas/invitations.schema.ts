import { createHash } from 'crypto';
import { Model, Schema, Types } from 'mongoose';
import * as mongoose from 'mongoose';

import { IInvitationDoc } from '../types';


function generateToken(data: string): string {
  return createHash('sha256').update(data).digest('hex');
}

export const InvitationsSchema = new Schema<IInvitationDoc<Types.ObjectId>, mongoose.Model<IInvitationDoc<Types.ObjectId>>>(
  {
    token: {
      type: String,
    },
    description: {
      type: String,
    },
  },
  {
    collection: 'invitations',
  },
);

InvitationsSchema.statics.findByValidToken = async function(inputData: string): Promise<IInvitationDoc> {
  const inputHash = generateToken(inputData);

  return this.findOne({ token: inputHash });
};

export interface IInvitationModel extends Model<IInvitationDoc> {
  findByValidToken(inputData: string): Promise<IInvitationDoc | null>;
}

export const InvitationsModel = mongoose.model<IInvitationDoc, IInvitationModel>('Invitations', InvitationsSchema);
