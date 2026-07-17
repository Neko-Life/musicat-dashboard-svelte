import { getAPIUrl } from '$lib/utils/services';

const DEBUG_LOG = false;

export enum EventTypeE {
	ERROR,
	PAUSE,
	PLAYBACK_INFO
}

export interface PlaybackInfo {
	active_fx: number;
	auto_play: boolean;
	avatar: string;
	average_bitrate: number;
	color_hint: number;
	desc: string;
	// in ms
	duration: number;
	// need enum
	loop_mode: number;
	paused: boolean;
	playing: boolean;
	// in ms
	progress: number;
	repeat: number;
	thumbnail: string;
	title: string;
	url: string;
	username: string;
}

export interface EventData {
	[EventTypeE.ERROR]: null;
	[EventTypeE.PAUSE]: unknown;
	[EventTypeE.PLAYBACK_INFO]: PlaybackInfo;
}

export type WSConJSONMessage<T = EventTypeE> = T extends EventTypeE
	? {
			e: T;
			d: EventData[T];
		}
	: unknown;

export class WSCon {
	con: WebSocket;
	url: string;
	guildId: string;
	waved: boolean;
	audioEl: HTMLAudioElement | undefined;
	reconnectInterval: number | null | undefined;

	constructor(url: string, guildId: string) {
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
		if (!this.audioEl) return;

		if (unMount) {
			this.audioEl.src = '';
			document.body.removeChild(this.audioEl);
			return;
		}
	}

	createAudioElement() {
		const ts = new Date().valueOf();
		const aid = '#playback-' + this.guildId + '-' + ts;
		const newAudio = document.createElement('audio');
		newAudio.id = aid;
		newAudio.src = getAPIUrl('/stream/' + this.guildId + '?ts=' + ts);

		const endHandler = () => {
			newAudio.src = '';
			document.body.removeChild(newAudio);
		};
		newAudio.addEventListener('ended', endHandler);
		document.body.appendChild(newAudio);

		newAudio.play();
		this.audioEl = newAudio;

		if (!DEBUG_LOG) return;
		const getLog =
			(n: string) =>
			(...args: any[]) =>
				console.log(n, ...args);

		this.audioEl.addEventListener('ended', getLog('ended'));
		this.audioEl.addEventListener('abort', getLog('abort'));
		this.audioEl.addEventListener('canplay', getLog('canplay'));
		this.audioEl.addEventListener('canplaythrough', getLog('canplaythrough'));
		this.audioEl.addEventListener('durationchange', getLog('durationchange'));
		this.audioEl.addEventListener('emptied', getLog('emptied'));
		this.audioEl.addEventListener('encrypted', getLog('encrypted'));
		this.audioEl.addEventListener('error', getLog('error'));
		this.audioEl.addEventListener('loadeddata', getLog('loadeddata'));
		this.audioEl.addEventListener('loadedmetadata', getLog('loadedmetadata'));
		this.audioEl.addEventListener('loadstart', getLog('loadstart'));
		this.audioEl.addEventListener('pause', getLog('pause'));
		this.audioEl.addEventListener('play', getLog('play'));
		this.audioEl.addEventListener('playing', getLog('playing'));
		this.audioEl.addEventListener('progress', getLog('progress'));
		this.audioEl.addEventListener('ratechange', getLog('ratechange'));
		this.audioEl.addEventListener('seeked', getLog('seeked'));
		this.audioEl.addEventListener('seeking', getLog('seeking'));
		this.audioEl.addEventListener('stalled', getLog('stalled'));
		this.audioEl.addEventListener('suspend', getLog('suspend'));
		this.audioEl.addEventListener('timeupdate', getLog('timeupdate'));
		this.audioEl.addEventListener('volumechange', getLog('volumechange'));
		this.audioEl.addEventListener('waiting', getLog('waiting'));
		this.audioEl.addEventListener('waitingforkey', getLog('waitingforkey'));
	}

	setupHandlers() {
		this.con.addEventListener('open', (event) => {
			this.clearReconnectInterval();

			console.log('WSCon: Open!');
		});

		this.con.addEventListener('message', (event) => {
			event.data.text().then((message: string) => {
				this.messageHandler(message);
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
		if (message == '0') return;
		if (message == 'meow~') return this.con.send('meow!');
		if (message == '(^v^)') return (this.waved = true);

		try {
			const j = JSON.parse(message);
			this.handleJsonMessage(j);
		} catch (e) {
			console.error(e);
			console.error('Got unexpected message:');
			console.error(message);
		}
	}

	handleJsonMessage(json: WSConJSONMessage) {
		switch (json.e) {
			case EventTypeE.ERROR:
				json.d;
				break;
			case EventTypeE.PAUSE:
				json.d;
				break;
			case EventTypeE.PLAYBACK_INFO:
				this.handlePlaybackInfo(json.d);
				break;
		}
	}

	handlePlaybackInfo(d: PlaybackInfo) {
		console.log(d);
		this.resetAudioElement();
		if (!d) return;
		this.createAudioElement();
	}

	handleSeveredConnection() {
		// reconnect on interval
		this.reconnectInterval = setInterval(() => this.reconnect(), 1000);
	}

	clearReconnectInterval() {
		if (typeof this.reconnectInterval === 'number') {
			clearInterval(this.reconnectInterval);
			this.reconnectInterval = null;
		}
	}
}
