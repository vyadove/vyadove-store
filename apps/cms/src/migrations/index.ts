import * as migration_20251019_095013 from './20251019_095013';
import * as migration_20251022_153719 from './20251022_153719';
import * as migration_20251023_094501 from './20251023_094501';
import * as migration_20251024_122727 from './20251024_122727';

export const migrations = [
  {
    up: migration_20251019_095013.up,
    down: migration_20251019_095013.down,
    name: '20251019_095013',
  },
  {
    up: migration_20251022_153719.up,
    down: migration_20251022_153719.down,
    name: '20251022_153719',
  },
  {
    up: migration_20251023_094501.up,
    down: migration_20251023_094501.down,
    name: '20251023_094501',
  },
  {
    up: migration_20251024_122727.up,
    down: migration_20251024_122727.down,
    name: '20251024_122727'
  },
];
