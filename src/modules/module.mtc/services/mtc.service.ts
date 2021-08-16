import { StandardResponseViewModel } from '../../../core/view-models';

class MtcService {
  public getAllMtcs(): StandardResponseViewModel {
    return new StandardResponseViewModel('Show all mtcs', 'success');
  }

  public getMtc(mtcId: string): StandardResponseViewModel {
    return new StandardResponseViewModel(`Show mtc by Id: ${mtcId}`, 'success');
  }

  public createMtc(): StandardResponseViewModel {
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
