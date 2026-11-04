export function formatDateKey(date: Date): string {
	const year = date.getFullYear();
	const month = String(date.getMonth() + 1).padStart(2, "0");
	const day = String(date.getDate()).padStart(2, "0");
	return `${year}-${month}-${day}`;
}

export function getTodayKey(): string {
	return formatDateKey(new Date());
}

export function getLast7DayKeys(): string[] {
	const keys: string[] = [];
	for (let i = 6; i >= 0; i--) {
		const d = new Date();
		d.setDate(d.getDate() - i);
		keys.push(formatDateKey(d));
	}
	return keys;
}
