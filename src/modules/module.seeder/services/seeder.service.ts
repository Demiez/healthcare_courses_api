import * as fs from 'fs';
import { Service } from 'typedi';
import { StandardResponseViewModel } from '../../../core/view-models';
import { MtcModel } from '../../module.mtc/db-models/mtc.db';

@Service()
export class SeederService {
  public async seedMtcs() {
    const mtcs = JSON.parse(
      fs.readFileSync(`${process.cwd()}/data-examples/mtcs.json`, 'utf-8')
    );

    await MtcModel.create(mtcs);

    return new StandardResponseViewModel(
      undefined,
      'Mtc data imported',
      'success'
    );
  }

  public async deleteMtcs() {
    await MtcModel.deleteMany();

    return new StandardResponseViewModel(
      undefined,
      'Mtc data deleted',
      'success'
    );
  }
}
