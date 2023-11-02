import type { IUser } from './services/auth';

export type ILocalStorageDatas = Readonly<{
	user: IUser;
}>;

export type ILocalStorageDatasKeys = keyof ILocalStorageDatas;
