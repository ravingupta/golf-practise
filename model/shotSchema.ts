import { appSchema, tableSchema } from '@nozbe/watermelondb';

export const shotSchema = appSchema({
  version: 1,
  tables: [
    tableSchema({
      name: 'shots',
      columns: [
        { name: 'club', type: 'string' },
        { name: 'direction', type: 'string' }, // left, right, high, low
        { name: 'expectation', type: 'string' },
        { name: 'actual', type: 'string' },
        { name: 'distance', type: 'number' },
        { name: 'timestamp', type: 'number' },
      ],
    }),
  ],
});
