import type {
  UseQueryOptions} from "@tanstack/react-query";
import {
  type QueryFunction,
  useQuery
} from "@tanstack/react-query";
import type { Config } from "@vyadove/types";

import { payloadSdk } from "@/utils/payload-sdk";

export type CollectionKeys = keyof Config["collections"];

type PayloadFindFn<Slug extends CollectionKeys> = typeof payloadSdk.find<
  Slug,
  any
>;

export type FindResult<Slug extends CollectionKeys> = Awaited<
  ReturnType<PayloadFindFn<Slug>>
> & { errors?: { message: string }[] };

export type FindArgs<Slug extends CollectionKeys> = Omit<
  Parameters<PayloadFindFn<Slug>>[0],
  "collection"
>;

export function usePayloadFindQuery<Slug extends CollectionKeys>(
  collection: Slug,
  args: {
    findArgs: FindArgs<Slug>;
    useQueryArgs?: Omit<
      UseQueryOptions<any, Error, FindResult<Slug>, any>,
      "queryFn" | "queryKey"
    >;
  },
) {
  const queryKeys = {
    all: [collection] as const,
    list: (a: FindArgs<Slug>) => [collection, a] as const,
  };

  const fetcher: QueryFunction<
    FindResult<Slug>,
    ReturnType<typeof queryKeys.list>
  > = async ({ queryKey }) => {
    const [, findArgs] = queryKey;

    return payloadSdk.find({
      collection,
      ...findArgs,
    });
  };

  return useQuery({
    queryKey: queryKeys.list(args.findArgs),
    queryFn: fetcher,
    ...args.useQueryArgs,
  });
}
