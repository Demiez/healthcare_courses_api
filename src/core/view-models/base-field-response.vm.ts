import { BaseStatusesEnum } from '../enums';

export abstract class BaseFieldResponseViewModel {
  public abstract status: string | BaseStatusesEnum;
  public abstract message: string;
}
