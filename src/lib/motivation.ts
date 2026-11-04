export function getMotivation(count: number, goal: number): string {
	const ratio = goal > 0 ? count / goal : 0;
	if (count === 0) return "Let's get hydrated today!";
	if (ratio < 0.25) return "Great start — keep it up.";
	if (ratio < 0.5) return "You're building momentum!";
	if (ratio < 0.75) return "Halfway there, keep going.";
	if (ratio < 1) return "Almost at your goal!";
	return "Goal reached. Well done 🎉";
}
