import {Injectable} from '@angular/core';
import moment from 'moment';

@Injectable({
  providedIn: 'root',
})
export class DatetimeService {
  parseDateIntoElements(dete: any): any {
    let datetime = new Date(dete);
    let month = datetime.getMonth() + 1;
    return {
      year: datetime.getFullYear(),
      month: month < 10 ? '0' + month : month,
      day: datetime.getDate() < 10 ? '0' + datetime.getDate() : datetime.getDate(),
      hours: datetime.getHours() < 10 ? '0' + datetime.getHours() : datetime.getHours(),
      minutes: datetime.getMinutes() < 10 ? '0' + datetime.getMinutes() : datetime.getMinutes(),
      seconds: datetime.getSeconds() < 10 ? '0' + datetime.getSeconds() : datetime.getSeconds(),
    };
  }

  convertDateTime(value: Date): string {
    return value ? moment(value).format('DD.MM.yyyy, HH:mm') : '';
  }

  convertTime(value: Date): string {
    return value ? moment(value).format('HH:mm') : '';
  }

  convertDate(value: Date): string {
    return value ? moment(value).format('DD.MM.yyyy') : '';
  }
}
