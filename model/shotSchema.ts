import { appSchema, tableSchema } from '@nozbe/watermelondb';

export const shotSchema = appSchema({
  version: 4,
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
        { name: 'mode', type: 'string' }, // 'driving_range' or 'golf_course'
        { name: 'holeNumber', type: 'number' },
        { name: 'par', type: 'number' },
        { name: 'score', type: 'number' },
        { name: 'pinPosition', type: 'string' },
        { name: 'greenSpeed', type: 'string' },
        { name: 'practiceType', type: 'string' },
        { name: 'targetDistance', type: 'number' },
      ],
    }),
  ],
});
