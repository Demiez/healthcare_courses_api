import { Document, Model, model, Schema } from 'mongoose';
import slugify from 'slugify';
import { v4 } from 'uuid';
import { MongooseLocationTypesEnum } from '../../../core/enums';
import { IGeoJsonLocation } from '../../../core/interfaces';
import { geocoder } from '../../../core/utils';
import { CareerTypesEnum } from '../enums/career-types.enum';

export interface IMtcDocument extends Document {
  id: string;
  name: string;
  slug: string;
  description: string;
  website: string;
  phone: string;
  email: string;
  address: string;
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
    maxlength: [100, 'Name cannot be more than 100 characters'],
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
    maxLength: [300, "Address can't be longer than 300 characters"],
  },
  location: {
    // GeoJson Point
    type: {
      type: String,
      enum: [MongooseLocationTypesEnum.POINT],
    },
    coordinates: {
      type: [Number],
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

mtcSchema.pre('save', async function (next) {
  const mtcData = this as IMtcDocument;

  mtcData.slug = slugify(mtcData.name, { lower: true, trim: true });

  next();
});

mtcSchema.pre('save', async function (next) {
  const mtcData = this as IMtcDocument;

  mtcData.location = await geocoder.geocode(mtcData.address);
  mtcData.address = undefined;

  next();
});

export const MtcModel: Model<IMtcDocument> = model<IMtcDocument>(
  'Mtc',
  mtcSchema,
  'mtcs'
);
