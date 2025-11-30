export interface Log {
  id: string;
  timestamp: number; // UTC timestamp
  localDateString: string; // ISO string for local date grouping
  count: number;
  nicotineAmount: number; // Snapshot of setting at time of log
}

export interface UserSettings {
  dailyGoal: number;
  nicotinePerPouch: number; // mg
  costPerUnit: number;
  currencySymbol: string;
}

export enum ViewState {
  HOME = 'HOME',
  STATS = 'STATS',
  SETTINGS = 'SETTINGS'
}

export interface DailyStat {
  date: string;
  count: number;
  nicotine: number;
}