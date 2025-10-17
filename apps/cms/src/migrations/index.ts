import * as migration_20251015_205003 from './20251015_205003';
import * as migration_20251015_213127 from './20251015_213127';
import * as migration_20251015_220017 from './20251015_220017';
import * as migration_20251016_055814 from './20251016_055814';
import * as migration_20251016_055827 from './20251016_055827';

export const migrations = [
  {
    up: migration_20251015_205003.up,
    down: migration_20251015_205003.down,
    name: '20251015_205003',
  },
  {
    up: migration_20251015_213127.up,
    down: migration_20251015_213127.down,
    name: '20251015_213127',
  },
  {
    up: migration_20251015_220017.up,
    down: migration_20251015_220017.down,
    name: '20251015_220017',
  },
  {
    up: migration_20251016_055814.up,
    down: migration_20251016_055814.down,
    name: '20251016_055814',
  },
  {
    up: migration_20251016_055827.up,
    down: migration_20251016_055827.down,
    name: '20251016_055827'
  },
];
