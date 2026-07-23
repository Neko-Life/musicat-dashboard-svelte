export interface IGetLoginParams {
	headerRedirect?: string;
	isInvite?: boolean;
}

export interface IPostLoginData {
	code: string;
	state: string;
	redirect_uri: string;
}

export interface IUser {
	id: string;
	username: string;
	avatar: string;
	discriminator: string;
	public_flags: number;
	premium_type: number;
	flags: number;
	banner: string;
	accent_color: number;
	global_name: string;
	avatar_decoration_data: unknown;
	banner_color: string;
}

export interface IPostLoginResponse {
	redirect: string;
	user: IUser;
}

export interface IPagination {
	// 1-based
	page: number;
	// 1-based
	maxPage: number;
}
