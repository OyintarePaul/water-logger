export const GLASS_SIZE_ML = 300;

export const GOAL_STEP_ML = 250;
export const GOAL_MIN_ML = 500;
export const GOAL_MAX_ML = 5000;

export const REMINDER_INTERVALS_MIN = [30, 60, 120, 180] as const;

export const HOUR_MIN = 0;
export const HOUR_MAX = 23;

export const DEFAULT_SETTINGS = {
	dailyGoalMl: 2500,
	remindersEnabled: false,
	reminderIntervalMin: 120,
	reminderStartHour: 8,
	reminderEndHour: 22,
	onboardingCompleted: false,
};

/** @deprecated Read the goal from useSettings(). Remove in the cleanup pass. */
export const DAILY_GOAL_ML = DEFAULT_SETTINGS.dailyGoalMl;

export const PRESETS = [
	{ label: "Sip", amountMl: 50 },
	{ label: "Half Sachet", amountMl: 250 },
	{ label: "Full Sachet", amountMl: 500 },
	{ label: "Small Cup", amountMl: 300 },
	{ label: "Small Bottle", amountMl: 300 },
	{ label: "Medium Cup", amountMl: 500 },
] as const;
