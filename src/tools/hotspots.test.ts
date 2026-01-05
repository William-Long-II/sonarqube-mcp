// src/tools/hotspots.test.ts
import { getHotspotsTool } from './hotspots.js';

describe('getHotspotsTool', () => {
  it('should have correct tool definition', () => {
    expect(getHotspotsTool.name).toBe('get_hotspots');
    expect(getHotspotsTool.description).toContain('hotspot');
  });
});
