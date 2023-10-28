export interface IBaseAPIResponse<T> {
	success: boolean;
	data: T;
}

export interface IErrorPayload {
	code: number;
	message: string;
}
