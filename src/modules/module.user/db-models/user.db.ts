import { Document, Model, model, Schema } from 'mongoose';
import { v4 } from 'uuid';
import { emailValidationRegex } from '../../../core/regex/email-validation.regex';
import { UserRolesEnum } from '../enums/user-roles.enum';

export interface IUser {
  _id?: string;
  name: string;
  email: string;
  role: UserRolesEnum;
  password: string;
  salt: string;
  resetPasswordToken: string;
  resetPasswordExpiration: Date;

  // Special fields
  _created?: Date;
  _updated?: Date;
}

export interface IUserDocument extends IUser, Document {
  _id: string;
}

interface IUserModel extends Model<IUserDocument> {}

const userSchema = new Schema<IUserDocument, IUserModel>({
  _id: {
    type: String,
    default: v4,
  },
  name: {
    type: String,
    trim: true,
    required: [true, 'Please add a user name'],
  },
  email: {
    type: String,
    required: [true, 'Please add email'],
    unique: true,
    match: [emailValidationRegex, 'Please add correct email'],
  },
  role: {
    type: String,
    enum: Object.values(UserRolesEnum),
    default: UserRolesEnum.USER,
  },
  password: {
    type: String,
    required: [true, 'Please add password'],
    minlength: 8,
    select: false,
  },
  resetPasswordToken: {
    type: String,
  },
  resetPasswordExpiration: {
    type: Date,
  },

  // Special fields
  _created: {
    type: Date,
    default: new Date(),
  },
  _updated: {
    type: Date,
    default: new Date(),
  },
});

userSchema.pre('save', async function (next) {
  const userData = this as IUserDocument;
  const eventDate = new Date();

  if (this.isNew) {
    userData._created = eventDate;
  } else {
    if (this.isModified('_created')) {
      return next(new Error('field _created not editable'));
    }
  }

  userData._updated = eventDate;

  next();
});

userSchema.index({ email: 1 }, { unique: true });

export const UserModel: IUserModel = model<IUserDocument>(
  'User',
  userSchema,
  'users'
);
