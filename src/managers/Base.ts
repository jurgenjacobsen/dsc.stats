import { Database } from 'dsc.db';
import { v4 as uuid } from 'uuid';
import { Options } from '../structures/typings';

export class Base {
  public options: Options;
  public db: Database;
  constructor(options: Options, collection: string) {
    this.options = {
      dateFormat: ['DD/MM/YYYY', 'MM/DD/YYYY'].includes(options.dateFormat) ? options.dateFormat : 'DD/MM/YYYY',
      db: options.db instanceof Database ? options.db.options : options.db,
    };

    this.db = options.db instanceof Database ? options.db : new Database({ ...options.db, collection });
  }

  public parseKey(userID?: string): string {
    return `${uuid}`;
  }

  public formatDate(date: Date = new Date()): string {
    let year: string | number = date.getFullYear();
    let month: string | number = date.getMonth() + 1 > 9 ? date.getMonth() + 1 : `0${date.getMonth() + 1}`;
    let day: string | number = date.getDate() > 9 ? date.getDate() : `0${date.getDate()}`;
    return `${this.options.dateFormat === 'MM/DD/YYYY' ? `${month}/${day}/${year}` : `${day}/${month}/${year}`}`;
  }
}
