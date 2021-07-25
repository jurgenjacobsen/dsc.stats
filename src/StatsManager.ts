import { Data, Database } from 'dsc.db';
import { Base } from './Base';

export class StatsManager extends Base {
  public db: Database;

  constructor(options: Options) {
    super();

    this.db = new Database({
      mongoURL: options.mongoURL,
      collection: 'STATS_MANAGER',
    });
  }

  public fetch(target: string, days = 0): Promise<User[] | null> {
    return new Promise(async (resolve) => {
      let raw: Data[] = await this.db.raw({ 'data.id': target});
      resolve(
        raw.map((r) => r.data)
        .sort((a: User, b: User) => b.date.getTime() - a.date.getTime())
        .slice(0, (days !== 0 ? days : raw.length))
      );
    });
  }

  public update(target: string, key: UserKey, amount: number): Promise<User> {
    return new Promise(async (resolve) => {
      let _old: Data[] = await this.db.raw({ 'data.id': target, 'data.formatedDate': this.formatDate() });
      if(_old.length < 1) await this.db.set(this.parseKey(), {
        date: new Date(),
        formatedDate: this.formatDate(),
        id: target,
        messages: 0,
        commands: 0,
        call: 0,
      });

      _old = await this.db.raw({ 'data.id': target, 'data.formatedDate': this.formatDate() });
      let _key = _old[0].ID;
      let __key = key.toLowerCase();

      let res = await this.db.add(`${_key}.${__key}`, amount);
      resolve(res);
    });
  }
}

export interface Options {
  mongoURL: string,
}

export interface User extends DataSet {
  messages: number;
  commands: number;
  call: number;
}

export interface Guild extends DataSet {
  messages: number;
  commands: number;
  call: number;
  join: number;
  leave: number;
}

export interface DataSet {
  date: Date;
  formatedDate: string;
  id: string;
}

export type UserKey = 'messages' | 'commands' | 'call';