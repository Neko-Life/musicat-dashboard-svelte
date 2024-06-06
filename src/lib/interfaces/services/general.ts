export type IFetchParameters = Parameters<typeof fetch>;

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
	/**
	 * empty value indicates server error
	 */
	is_mutual?: boolean;
}
