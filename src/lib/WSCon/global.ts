export class WSGlobal {
	con: WebSocket;
	url: string;
	guildId: string;
	reconnectInterval: number | null | undefined;

	constructor(url: string, guildId: string) {
		this.guildId = guildId;
		this.url = url;
		this.con = new WebSocket(url);
		this.setupHandlers();
	}

	reconnect(newUrl?: string, newGuildId?: string) {
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
		this.con.close();
	}

	setupHandlers() {
		this.con.addEventListener('open', (event) => {
			this.clearReconnectInterval();
			console.log('WSGlobal: Open!');
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
			console.error('WSGlobal: Error:', event);
		});

		this.con.addEventListener('close', (event) => {
			if (event.wasClean) {
				console.log(`WSGlobal: Closed cleanly, code=${event.code}, reason=${event.reason}`);
			} else {
				console.log('WSGlobal: Connection died');
				this.handleSeveredConnection();
			}
		});
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
}
