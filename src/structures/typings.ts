import { Database } from 'dsc.db';
import { v4 } from 'uuid';

/** All months of the year */
export type Month = '01' | '02' | '03' | '04' | '05' | '06' | '07' | '08' | '09' | '10' | '11' | '12';

/** All possible days of a month */
export type Day =
  | '01'
  | '02'
  | '03'
  | '04'
  | '05'
  | '06'
  | '07'
  | '08'
  | '09'
  | '10'
  | '11'
  | '12'
  | '13'
  | '14'
  | '15'
  | '16'
  | '17'
  | '18'
  | '19'
  | '20'
  | '21'
  | '22'
  | '23'
  | '24'
  | '25'
  | '26'
  | '27'
  | '28'
  | '29'
  | '30'
  | '31';

/** Possible years */
export type Year = '2021' | '2022' | '2023' | '2024' | '2025';

/**
 * How the developer prefers the date label to be formated.
 * - DD - Day
 * - MM - Month
 * - YYYY - Year
 * */
export type DateFormatType = 'DD/MM/YYYY' | 'MM/DD/YYYY';
export type DateFormat = `${Day}/${Month}/${Year}` | `${Month}/${Day}/${Year}`;

/** Basic options */
export interface Options {
  db: Database | DatabaseOptions;
  dateFormat: DateFormatType;
}

/** Statistics database options */
export interface DatabaseOptions {
  /** MongoDB connection uri */
  uri: string;
  /** Name of your database */
  name: string;
  /** Your mongodb user */
  user: string;
  /** Your mongodb user pass */
  pass: string;
}

/** Base data format */
export interface BaseData {
  /** Unique identification */
  uuid: string;
  /** User or guild id */
  id: string;
  /** Date of the record */
  date: Date;
  /** Date formated */
  formated: DateFormat;
}

/** User data format */
export interface UserData extends BaseData {
  /** Messages sent by user */
  messages: number;
  /** Commands used by the user */
  commands: number;
  /** Minutes that the user voice called */
  voice: number;
}

export interface UserGraphicData {
  messages: number[];
  commands: number[];
  voice: number[];
  label: DateFormat[];
}

export interface GuildGraphicData {
  /** Messages sent in the guild */
  messages: number[];
  /** Commands used in the guild */
  commands: number[];
  /** Voice call minutes in the guild */
  voice: number[];
  /** How many users joined the guild */
  newMembers: number[];
  /** How many users left the guild */
  leftMembers: number[];
  /** What was the maximum guild's members number */
  totalMembers: number[];
  /** Formated date to be used as a label */
  label: DateFormat[];
}

export type UserKey = 'messages' | 'commands' | 'voice';

/** Guild (Server) data format */
export interface GuildData extends BaseData {
  /** Messages sent in the guild */
  messages: number;
  /** Commands used in the guild */
  commands: number;
  /** Voice call minutes in the guild */
  voice: number;
  /** How many users joined the guild */
  newMembers: number;
  /** How many users left the guild */
  leftMembers: number;
  /** What was the maximum guild's members number */
  totalMembers: number;
}

export type GuildKey = 'messages' | 'commands' | 'voice' | 'newMembers' | 'leftMembers';
