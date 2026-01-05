// src/tools/metrics.test.ts
import { getMetricsTool } from './metrics.js';
describe('getMetricsTool', () => {
    it('should have correct tool definition', () => {
        expect(getMetricsTool.name).toBe('get_metrics');
        expect(getMetricsTool.description).toContain('metric');
    });
});
//# sourceMappingURL=metrics.test.js.map