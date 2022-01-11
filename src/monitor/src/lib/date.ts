// @ts-ignore
import * as gdate from "gdate";
const { second, minute, hour, day, week, month, year } = gdate;

export const now = new Date();

export const tomorrow = gdate.advance(now).by(1 * day);
export const ten_minutes = gdate.advance(now).by(10 * minute);
export const yesterday = gdate.advance(now).by(-1 * day);
export const one_month = gdate.advance(now).by(30 * day);

export const last_year = gdate.advance(now).by(-1 * year);
export const next_year = gdate.advance(now).by(1 * year);
