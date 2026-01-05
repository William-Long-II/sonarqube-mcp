// src/tools/quality-gates.test.ts
import { getQualityGateStatusTool, getQualityGateTool } from './quality-gates.js';

describe('quality gate tools', () => {
  it('should have correct get_quality_gate_status definition', () => {
    expect(getQualityGateStatusTool.name).toBe('get_quality_gate_status');
    expect(getQualityGateStatusTool.description).toContain('quality gate');
  });

  it('should have correct get_quality_gate definition', () => {
    expect(getQualityGateTool.name).toBe('get_quality_gate');
    expect(getQualityGateTool.description).toContain('quality gate');
  });
});
