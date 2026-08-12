import { getAPIUrl } from '$lib/utils/services';
import { user } from '$lib/store';
import { isOnBrowser } from '$lib/utils/common';
import type { IUser } from '$lib/interfaces/services/auth';

const DEBUG_LOG = false;
let localUser: IUser | null = null;
if (isOnBrowser()) {
	user.subscribe(
		(u) => {
			localUser = u || null;
		},
		() => {
			localUser = null;
		}
	);
}

export enum EventTypeE {
	ERROR,
	PAUSE,
	PLAYBACK_INFO,
	PLAY,
	SEEK,
	STOP,
	FX,
	QUEUE,
	REGISTER,
	NEXT,
	PREV,
	JOINVC,
	LEAVEVC,
	PROGRESS
}

// prettier-ignore
export const BinaryEventTypeMap = {
	[EventTypeE.ERROR]              : 'e',
	[EventTypeE.PAUSE]              : 'p',
	[EventTypeE.PLAYBACK_INFO]      : 'P',
	[EventTypeE.PLAY]               : 'c',
	[EventTypeE.SEEK]               : 's',
	[EventTypeE.STOP]               : 'x',
	[EventTypeE.FX]                 : 'f',
	[EventTypeE.QUEUE]              : 'q',
	[EventTypeE.REGISTER]           : 'r',
	[EventTypeE.NEXT]               : 'n',
	[EventTypeE.PREV]               : 'z',
	[EventTypeE.JOINVC]             : 'j',
	[EventTypeE.LEAVEVC]            : 'l',
	[EventTypeE.PROGRESS]           : 'S'
}

export interface ErrorInfo {
	error: true;
	error_message: string | object; // !TODO: add interface
}

export interface FXInfo {
	tempo: number;
	pitch: number;
	equalizer: string;
	sampling_rate: number;
	vibrato_f: number;
	vibrato_d: number;
	tremolo_f: number;
	tremolo_d: number;
	earwax: boolean;
}

export interface TrackInfo {
	username: string;
	avatar: string;
	thumbnail: string;
	desc: string;
	title: string;
	url: string;
	// in ms
	progress: number;
	// in ms
	duration: number;
	average_bitrate: number;
}

export interface PlaybackInfo extends TrackInfo {
	active_fx: number;
	auto_play: boolean;
	// color_hint will always exist when other property might be not
	color_hint: number;
	// need enum
	loop_mode: number;
	paused: boolean;
	playing: boolean;
	repeat: number;
}

// prettier-ignore
export interface EventData {
	[EventTypeE.ERROR]              : ErrorInfo;
	[EventTypeE.PAUSE]              : null;
	[EventTypeE.PLAYBACK_INFO]      : PlaybackInfo;
	[EventTypeE.PLAY]               : null;
	[EventTypeE.SEEK]               : number;
	[EventTypeE.STOP]               : null;
	[EventTypeE.FX]                 : FXInfo;
	[EventTypeE.QUEUE]              : TrackInfo[];
	[EventTypeE.JOINVC]             : null;
	[EventTypeE.LEAVEVC]            : null;
	[EventTypeE.PROGRESS]           : number;
}

export interface BinaryArg {
	str: string;
	buf: ArrayBuffer;
}

function parse_int32(args: BinaryArg[]) {
	const num = args[1];

	if (num.str.length > 3) {
		const view = new DataView(num.buf);
		const val = view.getUint32(0);
		return val;
	}

	return Number(num.str);
}

function null_parser(args: BinaryArg[]) {
	return null;
}

// prettier-ignore
export const EventBinaryDataParser = {
	[EventTypeE.ERROR]              : null,
	[EventTypeE.PAUSE]              : null_parser,
	[EventTypeE.PLAYBACK_INFO]      : null,
	[EventTypeE.PLAY]               : null_parser,
	[EventTypeE.SEEK]               : parse_int32,
	[EventTypeE.STOP]               : null_parser,
	[EventTypeE.FX]                 : null,
	[EventTypeE.QUEUE]              : null,
	[EventTypeE.JOINVC]             : null_parser,
	[EventTypeE.LEAVEVC]            : null_parser,
	[EventTypeE.PROGRESS]           : parse_int32,
};

export interface EventPayload {
	[EventTypeE.PAUSE]: null;
	[EventTypeE.PLAY]: null;
	[EventTypeE.SEEK]: number;
	[EventTypeE.STOP]: null;
	[EventTypeE.NEXT]: null;
	[EventTypeE.PREV]: null;
	[EventTypeE.REGISTER]: {
		uid: string | undefined;
	};
}

export type WSConJSONMessage<T = keyof EventData> = T extends keyof EventData
	? {
			e: T;
			d: EventData[T];
		}
	: unknown;

export type WSConJSONPayload<T = keyof EventPayload> = T extends keyof EventPayload
	? {
			e: T;
			d: EventPayload[T];
		}
	: unknown;

export interface WSConEventHandler {
	audioPlaying: (audioEl: HTMLAudioElement) => void;
	audioPaused: (audioEl: HTMLAudioElement) => void;
	audioLoading: (audioEl: HTMLAudioElement) => void;
	audioLoaded: (audioEl: HTMLAudioElement) => void;
	audioStopped: (audioEl: HTMLAudioElement) => void;
	audioTimeUpdate: (audioEl: HTMLAudioElement) => void;
	audioEmptied: (audioEl: HTMLAudioElement) => void;

	// websocket events
	error: (info: ErrorInfo) => void;
	pause: () => void;
	playbackInfo: (info: PlaybackInfo) => void;
	play: () => void;
	seek: (ms: number) => void;
	stop: () => void;
	fx: (info: FXInfo) => void;
	queue: (queue: TrackInfo[]) => void;
	join: () => void;
	leave: () => void;
	progress: (ms: number) => void;
}

async function installPromiseLogger(n: string, p: Promise<any>) {
	if (DEBUG_LOG) {
		return p
			.then((...args: any) => console.debug(n, 'then:', ...args))
			.catch((...args: any) => console.error(n, 'error:', ...args));
	}
	return p;
}

function handleEndAudioEl(audioEl?: HTMLAudioElement | null) {
	if (!elIsValidNode(audioEl)) return;
	audioEl.src = '';
	document.body.removeChild(audioEl);
}

function elIsValidNode(el: any): el is HTMLElement {
	return !!el && !!el.parentElement;
}

function audioElIsBuffered(audioEl: HTMLAudioElement) {
	return audioEl.readyState === HTMLMediaElement.HAVE_ENOUGH_DATA;
}

function getColorHint(n?: number, isBg?: boolean) {
	if (typeof n !== 'number') return;
	const R = (n & 0xff0000) >> 16;
	const G = (n & 0x00ff00) >> 8;
	const B = n & 0x0000ff;
	return `rgba(${R},${G},${B},${isBg ? '0.075' : '1'})`;
}

function setColorHint(nowPlaying?: PlaybackInfo) {
	if (typeof nowPlaying?.color_hint !== 'number') return;
	document.body.style.setProperty(
		'--default-color-hint',
		getColorHint(nowPlaying.color_hint) ||
			document.body.style.getPropertyValue('--default-color-hint')
	);
	document.body.style.setProperty(
		'--default-bg-color-hint',
		getColorHint(nowPlaying.color_hint, true) ||
			document.body.style.getPropertyValue('--default-bg-color-hint')
	);

	// keep previous style
	if (!nowPlaying.thumbnail) return;
	document.body.style.backgroundImage = `url(${nowPlaying.thumbnail || ''})`;
}

function parseBinaryToArgs(m: ArrayBuffer) {
	const view = new DataView(m);
	const args: BinaryArg[] = [];
	let arg = '';
	for (let i = 0; i < m.byteLength; i++) {
		const char = String.fromCharCode(view.getInt8(i));
		if (i === 0) {
			args.push({ str: char, buf: m.slice(0, 1) });
			continue;
		}
		arg += char;
	}

	if (arg.length) {
		args.push({ str: arg, buf: m.slice(1, m.byteLength) });
		arg = '';
	}

	return args;
}

export class WSCon {
	con: WebSocket;
	url: string;
	guildId: string;
	waved: boolean;
	// this element should be controlled by ws event!
	audioEl: HTMLAudioElement | undefined;
	reconnectInterval: number | null | undefined;
	debugMode: boolean;
	volume: number;
	muted: boolean;

	on: Partial<WSConEventHandler>;

	constructor(url: string, guildId: string) {
		this.debugMode = DEBUG_LOG;
		this.volume = 1;
		this.muted = false;
		this.on = {};
		this.waved = false;
		this.guildId = guildId;
		this.url = url;
		this.con = new WebSocket(url);
		this.setupHandlers();
	}

	reconnect(newUrl?: string, newGuildId?: string) {
		this.waved = false;
		this.guildId = newGuildId || this.guildId;
		this.url = newUrl || this.url;
		if (this.con) this.con.close();
		this.con = new WebSocket(this.url);
		this.setupHandlers();
	}

	onMount() {
		return () => this.unMount();
	}

	unMount() {
		this.clearReconnectInterval();
		this.con.close();
		this.resetAudioElement(true);
	}

	resetAudioElement(unMount: boolean = false) {
		if (!this.hasAudioElement()) return;

		if (unMount) {
			handleEndAudioEl(this.audioEl);
			return;
		}
	}

	getStreamUrl() {
		return getAPIUrl('/stream/' + this.guildId);
	}

	createAudioElement() {
		const ts = new Date().valueOf();
		const aid = '#playback-' + this.guildId + '-' + ts;
		const newAudio = document.createElement('audio');
		this.on?.audioLoading?.(newAudio);
		newAudio.id = aid;
		newAudio.volume = this.volume;
		newAudio.muted = this.muted;
		newAudio.src = this.getStreamUrl() + '?ts=' + ts;

		const endHandler = () => {
			handleEndAudioEl(newAudio);
			this.on?.audioStopped?.(newAudio);
		};
		newAudio.addEventListener('ended', endHandler);
		const playHandler = async () => {
			await installPromiseLogger('playHandler newAudio.play()', newAudio.play());

			this.on?.audioLoaded?.(newAudio);
			this.on?.audioPlaying?.(newAudio);
		};
		newAudio.addEventListener('canplaythrough', playHandler);
		const stallHandler = () => {
			this.on?.audioPaused?.(newAudio);
		};
		newAudio.addEventListener('stalled', stallHandler);

		const timeupdateHandler = () => {
			this.on.audioTimeUpdate?.(newAudio);
		};
		newAudio.addEventListener('timeupdate', timeupdateHandler);
		const emptiedHandler = () => {
			this.on.audioEmptied?.(newAudio);
		};
		newAudio.addEventListener('emptied', emptiedHandler);

		document.body.appendChild(newAudio);
		this.audioEl = newAudio;

		if (!DEBUG_LOG && !this.debugMode) return;
		const getLog = (n: string) =>
			[n, (...args) => console.debug(n, { params: args })] satisfies Parameters<
				HTMLAudioElement['addEventListener']
			>;

		newAudio.addEventListener(...getLog('ended'));
		newAudio.addEventListener(...getLog('canplaythrough'));
		newAudio.addEventListener(...getLog('stalled'));
		newAudio.addEventListener(...getLog('durationchange'));
		newAudio.addEventListener(...getLog('progress'));
		newAudio.addEventListener(...getLog('pause'));
		newAudio.addEventListener(...getLog('ended'));
		newAudio.addEventListener(...getLog('abort'));
		newAudio.addEventListener(...getLog('canplay'));
		newAudio.addEventListener(...getLog('emptied'));
		newAudio.addEventListener(...getLog('encrypted'));
		newAudio.addEventListener(...getLog('error'));
		newAudio.addEventListener(...getLog('loadeddata'));
		newAudio.addEventListener(...getLog('loadedmetadata'));
		newAudio.addEventListener(...getLog('loadstart'));
		newAudio.addEventListener(...getLog('play'));
		newAudio.addEventListener(...getLog('playing'));
		newAudio.addEventListener(...getLog('ratechange'));
		newAudio.addEventListener(...getLog('seeked'));
		newAudio.addEventListener(...getLog('seeking'));
		newAudio.addEventListener(...getLog('suspend'));

		// use this
		newAudio.addEventListener(...getLog('timeupdate'));
		// use this
		newAudio.addEventListener(...getLog('volumechange'));

		newAudio.addEventListener(...getLog('waiting'));
		newAudio.addEventListener(...getLog('waitingforkey'));
	}

	send(o: WSConJSONPayload) {
		this.con.send(JSON.stringify(o));
	}

	setupHandlers() {
		this.con.addEventListener('open', (event) => {
			this.clearReconnectInterval();

			console.log('WSCon: Open!');
			if (!localUser) throw new Error('You need to login to listen to voice session!');

			this.send({
				e: EventTypeE.REGISTER,
				d: {
					uid: localUser?.id
				}
			});
		});

		this.con.addEventListener('message', async (event: MessageEvent<Blob>) => {
			const data = event.data;
			if (!data.size) return;

			const peek = await data.slice(0, 1).text();
			const isJson = peek[0] === '{';
			if (isJson) {
				event.data.text().then((message: string) => {
					this.messageHandler(message);
				});
				return;
			}
			event.data.arrayBuffer().then((message: ArrayBuffer) => {
				this.handleBinaryMessage(message);
			});
		});

		this.con.addEventListener('error', (event) => {
			console.error('WSCon: Error:', event);
		});

		this.con.addEventListener('close', (event) => {
			if (event.wasClean) {
				console.log(`WSCon: Closed cleanly, code=${event.code}, reason=${event.reason}`);
			} else {
				console.log('WSCon: Connection died');
				this.handleSeveredConnection();
			}
		});
	}

	messageHandler(message: string) {
		if (message === '0') return;
		if (message === 'meow~') return this.con.send('meow!');
		if (message === '(^v^)') return (this.waved = true);

		try {
			const j = JSON.parse(message);
			this.handleJsonMessage(j);
		} catch (e) {
			console.error(e);
			console.error('Got unexpected message:');
			console.error(message);
		}
	}

	handleBinaryMessage(m: ArrayBuffer) {
		const args = parseBinaryToArgs(m);
		const typeChar = args[0].str;

		let eventType: keyof typeof EventBinaryDataParser | undefined;
		for (const k in BinaryEventTypeMap) {
			const key: keyof typeof EventBinaryDataParser = Number(k);
			if (BinaryEventTypeMap[key] !== typeChar) continue;
			eventType = key;
			break;
		}

		if (!eventType) return;
		const parser = EventBinaryDataParser[eventType];
		if (!parser) {
			if (args.length === 1 && args[0].str.length > 1) {
				this.messageHandler(typeChar);
				return;
			}
			return;
		}
		const d = parser(args);
		this.handleJsonMessage({ e: eventType, d } as WSConJSONMessage);
	}

	handleJsonMessage(json: WSConJSONMessage) {
		if (DEBUG_LOG || this.debugMode) console.debug(json);

		switch (json.e) {
			case EventTypeE.ERROR:
				console.error('[ERROR]', json.d.error_message);
				this.on.error?.(json.d);
				break;
			case EventTypeE.PAUSE:
				this.audioEl?.pause();
				this.on.pause?.();
				break;
			case EventTypeE.PLAYBACK_INFO:
				this.handlePlaybackInfo(json.d);
				break;
			case EventTypeE.PLAY:
				if (this.audioEl?.paused) this.audioEl.play();
				this.on.play?.();
				break;
			case EventTypeE.SEEK:
				this.on.seek?.(json.d);
				break;
			case EventTypeE.STOP:
				handleEndAudioEl(this.audioEl);
				this.on.stop?.();
				break;
			case EventTypeE.FX:
				this.on.fx?.(json.d);
				break;
			case EventTypeE.QUEUE:
				this.on.queue?.(json.d);
				break;
			case EventTypeE.JOINVC:
				this.on.join?.();
				break;
			case EventTypeE.LEAVEVC:
				this.on.leave?.();
				break;
			case EventTypeE.PROGRESS:
				this.on.progress?.(json.d);
				break;
		}
	}

	handlePlaybackInfo(d: PlaybackInfo) {
		this.resetAudioElement();
		setColorHint(d);
		this.on?.playbackInfo?.(d);
		if (!d?.title) return;

		// timeout to make sure audio element is loading correctly
		setTimeout(() => {
			this.createAudioElement();
			this.audioEl?.load();
		}, 100);
	}

	handleSeveredConnection() {
		// reconnect on interval
		if (typeof this.reconnectInterval === 'number') return;
		this.reconnectInterval = setInterval(() => this.reconnect(), 1000);
	}

	clearReconnectInterval() {
		if (typeof this.reconnectInterval === 'number') {
			clearInterval(this.reconnectInterval);
			this.reconnectInterval = null;
		}
	}

	hasAudioElement() {
		return elIsValidNode(this.audioEl);
	}

	setVolume(volume: number) {
		if (!this.audioEl) return;
		if (volume < 0) volume = 0;
		if (volume > 1) volume = 1;
		this.audioEl.volume = volume;
		this.volume = this.audioEl.volume;
		return this.volume;
	}

	toggleMute() {
		if (!this.audioEl) return;
		this.audioEl.muted = !this.audioEl.muted;
		this.muted = this.audioEl.muted;
		return this.audioEl.muted;
	}

	tryPlayIfNotPlaying() {
		if (!this.audioEl || this.audioEl.played.end(0) || this.audioEl.paused) return;
		this.audioEl.play();
	}

	////////////////////////////////////////////////////////////////////////////////

	play() {
		this.send({
			e: EventTypeE.PLAY,
			d: null
		});
	}

	pause() {
		this.send({
			e: EventTypeE.PAUSE,
			d: null
		});
	}

	stop() {
		this.send({
			e: EventTypeE.STOP,
			d: null
		});
	}

	seek(ms: number) {
		this.send({
			e: EventTypeE.SEEK,
			d: Math.floor(ms)
		});
	}

	prev() {
		this.send({
			e: EventTypeE.PREV,
			d: null
		});
	}

	next() {
		this.send({
			e: EventTypeE.NEXT,
			d: null
		});
	}
}
