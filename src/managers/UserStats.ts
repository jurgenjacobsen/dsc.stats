import { Data } from 'dsc.db';
import { Errors } from '../structures/errors';
import { Options, UserData, UserGraphicData, UserKey } from '../structures/typings';
import { Base } from './Base';

export class UserStats extends Base {
  constructor(options: Options) {
    super(options, 'userstats');
  }

  /**
   * Fetches data from a user
   * @param {string} userID User's id that will be fetched
   * @param {number} days The limit of days to fetch (Optional)
   * @returns Promise<UserData[] | null>
   */
  public fetch(userID: string, days: number = 0): Promise<UserData[] | null> {
    return new Promise(async (resolve) => {
      if (typeof userID !== 'string') throw new Error(Errors.FLAGS.INVALID_USER_ID);
      if (typeof days !== 'number') throw new Error(Errors.FLAGS.INVALID_DAYS);
      let raw: Data[] = await this.db.schema.find({ 'data.id': userID });
      if (!raw || raw.length < 1) return resolve(null);

      let data = raw
        .map((r) => r.data as UserData)
        .sort((a, b) => b.date.getTime() - a.date.getTime())
        .slice(0, days !== 0 ? days : raw.length);
      return resolve(data);
    });
  }

  /**
   * Adds a certain amount of counts to that user data on the date
   * @param {string} userID User id that will be updated
   * @param {string} key Which key will be updated on the user
   * @param {number} add The amount that should be added to the key
   * @returns Promise<UserData | null>
   */
  public update(userID: string, key: UserKey, add: number): Promise<UserData | null> {
    return new Promise(async (resolve) => {
      if (typeof userID !== 'string') throw new Error(Errors.FLAGS.INVALID_USER_ID);
      if (typeof key !== 'string' && !['messages', 'commands', 'voice'].includes(key)) throw new Error(Errors.FLAGS.INVALID_USERS_UPDATE_KEY);
      if (typeof add !== 'number') throw new Error(Errors.FLAGS.INVALID_ADD_AMOUNT);

      let old = await this.db.fetch({ 'data.id': userID, 'data.formated': this.formatDate() });
      let uuid = this.parseKey(userID);
      if (!old) {
        await this.db.set(uuid, {
          uuid: uuid,
          id: userID,
          date: new Date(),
          formated: this.formatDate(),
          messages: 0,
          commands: 0,
          voice: 0,
        } as UserData);
      }
      old = (await this.db.fetch({ 'data.id': userID, 'data.formated': this.formatDate() })) as Data;
      uuid = old.id;
      let res = await this.db.add(`${uuid}.${key}`, add ?? 1);
      return resolve(res?.data);
    });
  }

  /**
   * Fetches data from a user but formated to be used on graphjs.org
   * @param  {string} userID User's id that will be fetched
   * @param  {number} days The limit of days to fetch (Optional)
   * @returns Promise<UserGraphicData | null>
   */
  public graphicFormatData(userID: string, days: number = 0): Promise<UserGraphicData | null> {
    return new Promise(async (resolve) => {
      if (typeof userID !== 'string') throw new Error(Errors.FLAGS.INVALID_USER_ID);
      if (typeof days !== 'number') throw new Error(Errors.FLAGS.INVALID_DAYS);
      let raw = await this.fetch(userID, days);
      if (!raw) return resolve(null);
      raw = raw.reverse();
      let data: UserGraphicData = { messages: [], commands: [], voice: [], label: [] };
      for (let r of raw) {
        data.messages.push(r.messages ?? 0);
        data.commands.push(r.commands ?? 0);
        data.voice.push(r.voice ?? 0);
        data.label.push(r.formated ?? this.formatDate(r.date));
      }
      return resolve(data);
    });
  }
}
