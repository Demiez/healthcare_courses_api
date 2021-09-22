import { Document, Model, model, Schema } from 'mongoose';
import { v4 } from 'uuid';
import { MongooseLocationTypesEnum } from '../../../core/enums';
import { CareerTypesEnum } from '../enums/career-types.enum';

export interface IGeoJsonLocation {
  type: string;
  coordinates: Array<number>;
  formattedAddress?: string;
  street?: string;
  city?: string;
  state?: string;
  zipcode?: string;
  country?: string;
}

export interface IMtcDocument extends Document {
  id: string;
  name: string;
  slug: string;
  description: string;
  website: string;
  phone: string;
  email: string;
  location: IGeoJsonLocation;
  careers: Array<string>;
  averageRating?: number;
  averageCost?: number;
  photo?: string;
  housing?: boolean;
  jobAssistance?: boolean;
  jobGuarantee?: boolean;
  acceptGiBill?: boolean;
}

interface IMtcModel extends Model<IMtcDocument> {}

const mtcSchema = new Schema<IMtcDocument, IMtcModel>({
  _id: {
    type: String,
    default: () => v4(),
  },
  name: {
    type: String,
    trim: true,
    required: true,
    unique: true,
    maxlength: [50, 'Name cannot be more than 50 characters'],
  },
  slug: {
    type: String,
    trim: true,
  },
  description: {
    type: String,
    trim: true,
    required: true,
    maxlength: [500, 'Description cannot be more than 50 characters'],
  },
  website: {
    type: String,
    trim: true,
  },
  phone: {
    type: String,
    maxLength: [20, "Phone number can't be longer than 20 characters"],
  },
  email: {
    type: String,
    trim: true,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  location: {
    // GeoJson Point
    type: {
      type: String,
      enum: [MongooseLocationTypesEnum.POINT],
      // required: true,
    },
    coordinates: {
      type: [Number],
      // required: true,
      index: '2dsphere',
    },
    formattedAddress: String,
    street: String,
    city: String,
    state: String,
    zipcode: String,
    country: String,
  },
  careers: {
    type: [String],
    required: true,
    enum: Object.values(CareerTypesEnum),
  },
  averageRating: {
    type: Number,
    min: [1, 'Rating must be at least 1'],
    max: [10, 'Rating cannot be more than 10'],
  },
  averageCost: Number,
  photo: {
    type: String,
    default: 'default-photo.jpg',
  },
  housing: {
    type: Boolean,
    default: false,
  },
  jobAssistance: {
    type: Boolean,
    default: false,
  },
  jobGuarantee: {
    type: Boolean,
    default: false,
  },
  acceptGiBill: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: new Date(),
  },
});

export const MtcModel: Model<IMtcDocument> = model<IMtcDocument>(
  'Mtc',
  mtcSchema,
  'mtcs'
);
