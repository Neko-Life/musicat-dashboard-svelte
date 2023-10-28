type timer_t = number | null;

export function clearTimer(timer: timer_t) {
	if (typeof timer !== 'number') return;
	clearTimeout(timer);
	timer = null;
}

export function setTimer(timer: timer_t, cb: () => void, timeout: number) {
	if (typeof timer === 'number') return timer;

	return setTimeout(cb, timeout);
}
