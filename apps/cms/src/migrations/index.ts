import * as migration_20251028_075056 from "./20251028_075056";
import * as migration_20251110_050500 from "./20251110_050500";
import * as migration_20251114_164554 from "./20251114_164554";
import * as migration_20251127_202804 from "./20251127_202804";
import * as migration_20251215_183759_new_checkout_collection_which_holds_cart_and_checkout_session from "./20251215_183759_new_checkout_collection_which_holds_cart_and_checkout_session";

export const migrations = [
    {
        up: migration_20251028_075056.up,
        down: migration_20251028_075056.down,
        name: "20251028_075056",
    },
    {
        up: migration_20251110_050500.up,
        down: migration_20251110_050500.down,
        name: "20251110_050500",
    },
    {
        up: migration_20251114_164554.up,
        down: migration_20251114_164554.down,
        name: "20251114_164554",
    },
    {
        up: migration_20251127_202804.up,
        down: migration_20251127_202804.down,
        name: "20251127_202804",
    },
    {
        up: migration_20251215_183759_new_checkout_collection_which_holds_cart_and_checkout_session.up,
        down: migration_20251215_183759_new_checkout_collection_which_holds_cart_and_checkout_session.down,
        name: "20251215_183759_new_checkout_collection_which_holds_cart_and_checkout_session",
    },
];
