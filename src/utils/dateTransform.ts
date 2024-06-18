import { ValueTransformer } from 'typeorm';
import * as moment from 'moment';

export class DateTransformer implements ValueTransformer {
  to(value: Date): Date {
    return value;
  }

  from(value: Date): string {
    return moment(value).format('YYYY-MM-DD HH:mm:ss');
  }
}
