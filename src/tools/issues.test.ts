// src/tools/issues.test.ts
import { getIssuesTool } from './issues.js';

describe('getIssuesTool', () => {
  it('should have correct tool definition', () => {
    expect(getIssuesTool.name).toBe('get_issues');
    expect(getIssuesTool.description).toContain('issues');
  });
});
