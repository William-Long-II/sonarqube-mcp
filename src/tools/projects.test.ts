// src/tools/projects.test.ts
import { listProjectsTool } from './projects.js';

describe('listProjectsTool', () => {
  it('should have correct tool definition', () => {
    expect(listProjectsTool.name).toBe('list_projects');
    expect(listProjectsTool.description).toContain('project');
  });
});
