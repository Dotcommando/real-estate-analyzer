export interface BaseLaunchSettings {
  firstRun: boolean;
}

export interface LaunchSettingsWithFirstRunFromDayStart extends BaseLaunchSettings {
  firstRunFromDayStart?: boolean;
}

export interface LaunchSettingsWithFirstRunPast extends BaseLaunchSettings {
  firstRunPast?: string; // 2h | 1d | 1d3h4m
}

export type LaunchSettings = LaunchSettingsWithFirstRunFromDayStart | LaunchSettingsWithFirstRunPast;
