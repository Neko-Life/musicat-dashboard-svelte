export interface IUseGetLoginParams {
	successRedirect?: string;
	onSuccess?: (data: Response) => void;
        isInvite?: boolean;
}

export interface IGetDefaultGetLoginSuccessHandlerParams {
	origin: string;
	goto: typeof import('$app/navigation')['goto'];
	cb?: () => void;
}
