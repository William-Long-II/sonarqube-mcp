// src/tools/rules.test.ts
import { getRuleTool } from './rules.js';

describe('getRuleTool', () => {
  it('should have correct tool definition', () => {
    expect(getRuleTool.name).toBe('get_rule');
    expect(getRuleTool.description).toContain('rule');
  });
});
