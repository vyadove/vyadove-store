import * as migration_20251028_075056 from './20251028_075056';
import * as migration_20251110_050500 from './20251110_050500';
import * as migration_20251114_164554 from './20251114_164554';

export const migrations = [
  {
    up: migration_20251028_075056.up,
    down: migration_20251028_075056.down,
    name: '20251028_075056',
  },
  {
    up: migration_20251110_050500.up,
    down: migration_20251110_050500.down,
    name: '20251110_050500',
  },
  {
    up: migration_20251114_164554.up,
    down: migration_20251114_164554.down,
    name: '20251114_164554'
  },
];
