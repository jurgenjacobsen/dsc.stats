import { Data } from 'dsc.db';
import { Errors } from '../structures/errors';
import { GuildData, GuildGraphicData, GuildKey, Options } from '../structures/typings';
import { Base } from './Base';

export class GuildStats extends Base {
  constructor(options: Options) {
    super(options, 'guildstats');
  }

  /**
   * Fetches data from a user
   * @param {string} guildID User's id that will be fetched
   * @param {number} days The limit of days to fetch (Optional)
   * @returns Promise<GuildData[] | null>
   */
  public fetch(guildID: string, days: number = 0): Promise<GuildData[] | null> {
    return new Promise(async (resolve) => {
      if (typeof guildID !== 'string') throw new Error(Errors.FLAGS.INVALID_GUILD_ID);
      if (typeof days !== 'number') throw new Error(Errors.FLAGS.INVALID_DAYS);
      let raw: Data[] = await this.db.schema.find({ 'data.id': guildID });
      if (!raw || raw.length < 1) return resolve(null);

      let data = raw
        .map((r) => r.data as GuildData)
        .sort((a, b) => b.date.getTime() - a.date.getTime())
        .slice(0, days !== 0 ? days : raw.length);
      return resolve(data);
    });
  }

  /**
   * Adds a certain amount of counts to that guild data on the date
   * @param {string} guildID Guild id that will be updated
   * @param {string} key Which key will be updated on the guild
   * @param {number} add The amount that should be added to the key
   * @returns Promise<GuildData | null>
   */
  public update(guildID: string, key: GuildKey, add: number): Promise<GuildData | null> {
    return new Promise(async (resolve) => {
      if (typeof guildID !== 'string') throw new Error(Errors.FLAGS.INVALID_USER_ID);
      if (typeof key !== 'string' && !['messages', 'commands', 'voice'].includes(key)) throw new Error(Errors.FLAGS.INVALID_USERS_UPDATE_KEY);
      if (typeof add !== 'number') throw new Error(Errors.FLAGS.INVALID_ADD_AMOUNT);

      let old = await this.db.fetch({ 'data.id': guildID, 'data.formated': this.formatDate() });
      let uuid = this.parseKey(guildID);
      if (!old) {
        await this.db.set(uuid, {
          uuid: uuid,
          id: guildID,
          date: new Date(),
          formated: this.formatDate(),
          messages: 0,
          commands: 0,
          voice: 0,
          newMembers: 0,
          leftMembers: 0,
          totalMembers: 0,
        } as GuildData);
      }
      old = (await this.db.fetch({ 'data.id': guildID, 'data.formated': this.formatDate() })) as Data;
      uuid = old.id;
      let res = key !== 'totalMembers' ? await this.db.add(`${uuid}.${key}`, add ?? 1) : await this.db.set(`${uuid}.${key}`, add);
      return resolve(res?.data);
    });
  }

  /**
   * Fetches data from a guild but formated to be used on graphjs.org
   * @param  {string} userID Guild's id that will be fetched
   * @param  {number} days The limit of days to fetch (Optional)
   * @returns Promise<GuildGraphicData | null>
   */
  public graphicFormatData(userID: string, days: number = 0): Promise<GuildGraphicData | null> {
    return new Promise(async (resolve) => {
      if (typeof userID !== 'string') throw new Error(Errors.FLAGS.INVALID_GUILD_ID);
      if (typeof days !== 'number') throw new Error(Errors.FLAGS.INVALID_DAYS);
      let raw = await this.fetch(userID, days);
      if (!raw) return resolve(null);
      raw = raw.reverse();
      let data: GuildGraphicData = { messages: [], commands: [], voice: [], label: [], newMembers: [], leftMembers: [], totalMembers: [] };
      for (let r of raw) {
        data.messages.push(r.messages ?? 0);
        data.commands.push(r.commands ?? 0);
        data.voice.push(r.voice ?? 0);
        data.newMembers.push(r.newMembers ?? 0);
        data.leftMembers.push(r.leftMembers ?? 0);
        data.totalMembers.push(r.totalMembers ?? 0);
        data.label.push(r.formated ?? this.formatDate(r.date));
      }
      return resolve(data);
    });
  }
}
