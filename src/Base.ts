import { v4 as uuidv4 } from 'uuid';

export class Base {
  constructor() { }

  public parseKey(key?: string): string {
    //return `${uuidv4()}-${key}`;
    return `${uuidv4()}`;
  }

  public unParseKey(key: string): string {
    let _key: string | string[] = key;
    _key = _key.split('-');
    _key = _key[_key.length - 1];
    return _key;
  }

  public formatDate(date?: Date): string {
    let data = date ?? new Date();
    return `${data.getDate()}/${data.getMonth() + 1}/${data.getFullYear()}`;
  }
}