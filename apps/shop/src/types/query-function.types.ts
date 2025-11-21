import type { Config } from "@vyadove/types";

import type { payloadSdk } from "@/utils/payload-sdk";

export type CollectionKeys = keyof Config["collections"];

type PayloadFindFn<Slug extends CollectionKeys> = typeof payloadSdk.find<
  Slug,
  any
>;
export type FindResult<Slug extends CollectionKeys> = Awaited<
  ReturnType<PayloadFindFn<Slug>>
>;

export type FindArgs<Slug extends CollectionKeys> = Omit<
  Parameters<PayloadFindFn<Slug>>[0],
  "collection"
>;
