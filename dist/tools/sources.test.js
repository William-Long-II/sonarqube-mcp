// src/tools/sources.test.ts
import { getSourceWithIssuesTool } from './sources.js';
describe('getSourceWithIssuesTool', () => {
    it('should have correct tool definition', () => {
        expect(getSourceWithIssuesTool.name).toBe('get_source_with_issues');
        expect(getSourceWithIssuesTool.description).toContain('source');
    });
});
//# sourceMappingURL=sources.test.js.map