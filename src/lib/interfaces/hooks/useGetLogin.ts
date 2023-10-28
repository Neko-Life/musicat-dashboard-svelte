export interface IUseGetLoginParams {
	successRedirect?: string;
	onSuccess?: (data: Response) => void;
}

export interface IGetDefaultGetLoginSuccessHandlerParams {
	origin: string;
	goto: typeof import('$app/navigation')['goto'];
	cb?: () => void;
}
