import { Options } from '../structures/typings';
import { Base } from './Base';

export class GuildStats extends Base {
  constructor(options: Options) {
    super(options, 'guildstats');
  }
}
