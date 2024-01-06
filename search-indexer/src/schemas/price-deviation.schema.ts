import { Schema } from 'mongoose';


export const PriceDeviationSchema = new Schema({
  medianDelta: {
    type: Number,
    required: true,
  },
  meanDelta: {
    type: Number,
    required: true,
  },
});
