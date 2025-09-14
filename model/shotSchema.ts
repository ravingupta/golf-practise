import { appSchema, tableSchema } from '@nozbe/watermelondb';

export const shotSchema = appSchema({
  version: 3,
  tables: [
    tableSchema({
      name: 'shots',
      columns: [
        { name: 'club', type: 'string' },
        { name: 'direction', type: 'string' }, // legacy field
        { name: 'lateralDirection', type: 'string' },
        { name: 'inclination', type: 'string' },
        { name: 'expectation', type: 'string' },
        { name: 'actual', type: 'string' },
        { name: 'distance', type: 'number' },
        { name: 'carry', type: 'number' },
        { name: 'total', type: 'number' },
        { name: 'lie', type: 'string' },
        { name: 'wind', type: 'string' },
        { name: 'notes', type: 'string' },
        { name: 'timestamp', type: 'number' },
      ],
    }),
  ],
});
