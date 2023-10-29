export interface IGetLoginParams {
	headerRedirect?: string;
}

export interface IPostLoginData {
	code: string;
	state: string;
	redirect_uri: string;
}

export interface IPostLoginResponse {
	redirect: string;
}
