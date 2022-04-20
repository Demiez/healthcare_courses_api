import { Document, Model, model, Schema } from 'mongoose';
import { v4 } from 'uuid';
import { logger } from '../../../core/utils';
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

interface ICourseModel extends Model<ICourseDocument> {
  calculateAverageCost?: (mtcId: string) => Promise<void>;
}

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

courseSchema.statics.calculateAverageCost = async function (mtcId: string) {
  const aggregatedCostData = await this.aggregate([
    {
      $match: { mtc: mtcId },
    },
    {
      $group: {
        _id: '$mtc',
        averageCost: { $avg: '$tuitionCost' },
      },
    },
    {
      $project: {
        _id: '$_id',
        averageCost: { $round: ['$averageCost', 2] },
      },
    },
  ]);

  await model('Mtc').findByIdAndUpdate(mtcId, {
    averageCost: aggregatedCostData[0].averageCost,
  });

  logger.info(`Average cost calculation for mtc ${mtcId} is done`);
};

courseSchema.post('save', function () {
  const courseData = this.constructor as ICourseModel;

  courseData.calculateAverageCost(this.mtc as string);
});

courseSchema.pre('deleteOne', { document: true, query: false }, function () {
  const courseData = this.constructor as ICourseModel;

  courseData.calculateAverageCost(this.mtc as string);
});

export const CourseModel: ICourseModel = model<ICourseDocument>(
  'Course',
  courseSchema,
  'courses'
);
