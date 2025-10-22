import * as migration_20251019_095013 from './20251019_095013';
import * as migration_20251022_153719 from './20251022_153719';

export const migrations = [
  {
    up: migration_20251019_095013.up,
    down: migration_20251019_095013.down,
    name: '20251019_095013',
  },
  {
    up: migration_20251022_153719.up,
    down: migration_20251022_153719.down,
    name: '20251022_153719'
  },
];
