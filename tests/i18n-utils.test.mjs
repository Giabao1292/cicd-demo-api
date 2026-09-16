import { describe, expect, it } from 'vitest';
import { collectSchema, compareSchemas, sortObject } from '../scripts/i18n-utils.mjs';

describe('i18n utility functions', () => {
  it('sorts nested translation keys alphabetically', () => {
    expect(sortObject({ zebra: 'z', apple: { zoo: 'z', ant: 'a' } })).toEqual({
      apple: { ant: 'a', zoo: 'z' },
      zebra: 'z',
    });
  });

  it('reports a translation field missing from a locale', () => {
    const english = collectSchema({ greeting: 'Hello', nested: { label: 'Label' } });
    const vietnamese = collectSchema({ greeting: 'Xin chào', nested: {} });

    expect(compareSchemas(english, vietnamese, 'en', 'vi')).toContain('vi.json thiếu key: nested.label');
  });
});
