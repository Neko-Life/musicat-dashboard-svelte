import { createQuery, type DefaultError, type QueryKey } from '@tanstack/svelte-query';

export type UseQueryQueryKey<T> = Readonly<T extends Array<unknown> ? T[] : [T]>;

export type CreateQueryParam<
	TQueryFnData,
	TError,
	TData,
	TQueryKey extends QueryKey = QueryKey
> = Parameters<typeof createQuery<TQueryFnData, TError, TData, TQueryKey>>[0];

export type UseQueryOpts<
	TQueryFnData,
	TError,
	TData,
	TQueryKey extends QueryKey = QueryKey,
	O = unknown
> = O extends string
	? Omit<CreateQueryParam<TQueryFnData, TError, TData, TQueryKey>, O>
	: CreateQueryParam<TQueryFnData, TError, TData, TQueryKey>;

export function useQuery<
	T = unknown,
	TQueryFnData = unknown,
	TError = DefaultError,
	TData = TQueryFnData,
	TQueryKey extends QueryKey = UseQueryQueryKey<T>
>(
	keys: T,
	fn: () => Promise<TQueryFnData>,
	opt: UseQueryOpts<TQueryFnData, TError, TData, TQueryKey, 'queryKey' | 'queryFn'> = {}
) {
	return createQuery<TQueryFnData, TError, TData, TQueryKey>(() => ({
		queryKey: (Array.isArray(keys) ? keys : [keys]) as any,
		queryFn: fn,
		...opt
	}));
}
