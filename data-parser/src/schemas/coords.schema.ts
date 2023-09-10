import { Document, Model, Schema } from 'mongoose';

import { ICoords } from '../types';


export interface ICoordsDoc extends ICoords, Document {}

export const CoordsSchema = new Schema<ICoordsDoc, Model<ICoordsDoc>>({
  lat: Schema.Types.Number,
  lng: Schema.Types.Number,
  latTitle: {
    type: Schema.Types.String,
    enum: [ 'N', 'S' ],
  },
  lngTitle: {
    type: Schema.Types.String,
    enum: [ 'E', 'W' ],
  },
});
