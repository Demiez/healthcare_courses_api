import { StandardResponseViewModel } from '../../../core/view-models';
import { CreateMtcRequestModel } from '../request-models';

class MtcService {
  public getAllMtcs(): StandardResponseViewModel {
    return new StandardResponseViewModel('Show all mtcs', 'success');
  }

  public getMtc(mtcId: string): StandardResponseViewModel {
    return new StandardResponseViewModel(`Show mtc by Id: ${mtcId}`, 'success');
  }

  public createMtc(
    requestModel: CreateMtcRequestModel
  ): StandardResponseViewModel {
    return new StandardResponseViewModel('Create new mtc', 'success');
  }

  public updateMtc(mtcId: string): StandardResponseViewModel {
    return new StandardResponseViewModel(
      `Update mtc by Id: ${mtcId}`,
      'success'
    );
  }

  public deleteMtc(mtcId: string): StandardResponseViewModel {
    return new StandardResponseViewModel(
      `Delete mtc by Id: ${mtcId}`,
      'success'
    );
  }
}

export const ModuleMtc_MtcService: MtcService = new MtcService();
