import {InjectionToken} from '@angular/core';

export const ERROR_MESSAGES: { [key: string]: (args?: any) => string } = {
  required: () => 'Поле обязательно для заполнения',
  registrationNumberValidator: () => 'Номер должен содержать буквы и цифры',
  maxlength: (args) => 'Максимальное допустимое количество символов ' + args.requiredLength + ' сейчас ' + args.actualLength,
  dueData: () => 'Дата должна быть больше "Даты регистрации"',
  minDateInvalid: () => 'Дата должна быть больше',
  dueDateInvalid1: () => 'Дата должна быть больше "Даты регистрации"',
  dueDateInvalid2: () => 'Дата должна быть больше "Дата исходящего документа"',
};

export const VALIDATION_ERROR_MESSAGES = new InjectionToken(`Validation Messages`, {
  providedIn: 'root',
  factory: () => ERROR_MESSAGES,
});

