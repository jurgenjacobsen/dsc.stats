import { Data, Database } from 'dsc.db';
import { Base } from './Base';
import { Guild, GuildGraphicData, GuildKey, Options, User } from './UserStats';

export class GuildStats extends Base {
  public db: Database;

  constructor(options: Options) {
    super();

    this.db = new Database({
      mongoURL: options.mongoURL,
      mongoPass: options.mongoPass,
      mongoUser: options.mongoUser,
      collection: 'guilds_stats_managers',
    });
  }

  public fetch(target: string, days = 0): Promise<Guild[] | null> {
    return new Promise(async (resolve) => {
      let raw: Data[] = await this.db.schema.find({ 'data.id': target });
      resolve(
        raw.map((r) => r.data)
        .sort((a: Guild, b: User) => b.date.getTime() - a.date.getTime())
        .slice(0, (days !== 0 ? days : raw.length))
      )
    });
  };

  public update(target: string, key: GuildKey, amount: number): Promise<Guild> {
    return new Promise(async (resolve) => {
      let query = { 'data.id': target, 'data.formatedDate': this.formatDate() };

      let _old: Data[] = await this.db.schema.find(query);
      if(_old.length < 1) await this.db.set(this.parseKey(), {
        date: new Date(),
        formatedDate: this.formatDate(),
        id: target,
        messages: 0,
        commands: 0,
        call: 0,
        joins: 0,
        leaves: 0,
        warns: 0,
      });

      _old = await this.db.schema.find(query);

      let _key = _old[0].ID;
      let __key = key.toLowerCase();

      let res = await this.db.add(`${_key}.${__key}`, amount);
      resolve(res);
    });
  };

  public graphicRender(target: string, days = 0): Promise<GuildGraphicData | null> {
    return new Promise(async (resolve) => {
      let data: Guild[] = await this.fetch(target, days) as Guild[];
      if(!data) resolve(null);
      data = data.reverse();
      let res = {
        l: [] as string[],
        m: [] as number[],
        cmd: [] as number[],
        c: [] as number[],
        j: [] as number[],
        ls: [] as number[],
        w: [] as number[],
      };

      for (let set of data) {
        res.l.push(set.formatedDate);
        res.m.push(set.messages);
        res.cmd.push(set.commands);
        res.c.push(set.call);
        res.j.push(set.joins);
        res.ls.push(set.leaves);
        res.w.push(set.warns);
      };

      resolve(res)
    });
  };
}