export interface IGetLoginParams {
	headerRedirect?: string;
}

export interface IPostLoginData {
	code: string;
	state: string;
}

export interface IPostLoginResponse {
	redirect: string;
}
