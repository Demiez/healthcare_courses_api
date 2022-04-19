import { Document, Model, model, Schema } from 'mongoose';
import { v4 } from 'uuid';
import { IMtcDocument } from '../../module.mtc/db-models/mtc.db';
import { MinimumSkillEnum } from '../enums/minimum-skill.enum';

export interface ICourse {
  _id?: string;
  title: string;
  description: string;
  weeksDuration: number;
  tuitionCost: number;
  minimumSkill: MinimumSkillEnum;
  isScholarshipAvailable: boolean;
  mtc: IMtcDocument | string;

  // Special fields
  _created?: Date;
  _updated?: Date;
}

export interface ICourseDocument extends ICourse, Document {
  _id: string;
}

interface ICourseModel extends Model<ICourseDocument> {}

const courseSchema = new Schema<ICourseDocument, ICourseModel>({
  _id: {
    type: String,
    default: v4,
  },
  title: {
    type: String,
    trim: true,
    required: [true, 'Please add a course title'],
  },
  description: {
    type: String,
    trim: true,
    required: true,
    maxlength: [1000, 'Description cannot be more than 500 characters'],
  },
  weeksDuration: {
    type: Number,
    trim: true,
    required: [true, 'Please add course duration in weeks'],
  },
  tuitionCost: {
    type: Number,
    required: [true, 'Please add tuition cost'],
  },
  minimumSkill: {
    type: String,
    required: [true, 'Please add minimum skill'],
    enum: Object.values(MinimumSkillEnum),
  },
  isScholarshipAvailable: {
    type: Boolean,
    default: false,
  },
  mtc: {
    type: String,
    ref: 'Mtc',
    required: true,
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

courseSchema.pre('save', async function (next) {
  const courseData = this as ICourseDocument;
  const eventDate = new Date();

  if (this.isNew) {
    courseData._created = eventDate;
  } else {
    if (this.isModified('_created')) {
      return next(new Error('field _created not editable'));
    }
  }

  courseData._updated = eventDate;

  next();
});

export const CourseModel: ICourseModel = model<ICourseDocument>(
  'Course',
  courseSchema,
  'courses'
);
