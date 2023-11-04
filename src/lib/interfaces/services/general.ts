export interface IBotPreview {
	username: string;
	avatar_url: string;
	description: string;
}

export interface IUserGuild {
	features: string[];
	icon: string;
	id: string;
	name: string;
	owner: boolean;
	permissions: string;
	// !TODO: add mutual, etc
}
