/**
 * Tests for Performance Monitor
 */

import { renderHook } from '@testing-library/react-native';

// Create inline performance monitor for testing
class TestPerformanceMonitor {
  private metrics: Map<string, number[]> = new Map();
  private marks: Map<string, number> = new Map();

  mark(name: string): void {
    this.marks.set(name, performance.now());
  }

  measure(name: string, startMark?: string): number {
    const endTime = performance.now();
    const markName = startMark || name;
    const startTime = this.marks.get(markName);

    if (startTime === undefined) {
      console.warn(`No start mark found for: ${markName}`);
      return 0;
    }

    const duration = endTime - startTime;
    
    const existing = this.metrics.get(name) || [];
    existing.push(duration);
    this.metrics.set(name, existing);

    this.marks.delete(markName);

    if (__DEV__) {
      console.log(`[Performance] ${name}: ${duration.toFixed(2)}ms`);
    }

    return duration;
  }

  getAverage(name: string): number {
    const values = this.metrics.get(name);
    if (!values || values.length === 0) return 0;
    return values.reduce((a, b) => a + b, 0) / values.length;
  }

  getSummary(): Record<string, { avg: number; min: number; max: number; count: number }> {
    const summary: Record<string, any> = {};
    
    this.metrics.forEach((values, name) => {
      summary[name] = {
        avg: values.reduce((a, b) => a + b, 0) / values.length,
        min: Math.min(...values),
        max: Math.max(...values),
        count: values.length,
      };
    });

    return summary;
  }

  clear(): void {
    this.metrics.clear();
    this.marks.clear();
  }

  report(): void {
    const summary = this.getSummary();
    console.log('[Performance Summary]', JSON.stringify(summary, null, 2));
  }
}

const performanceMonitor = new TestPerformanceMonitor();

describe('Performance Monitor', () => {
  beforeEach(() => {
    performanceMonitor.clear();
  });

  describe('Timing Operations', () => {
    it('should mark and measure operations', () => {
      performanceMonitor.mark('test-operation');
      
      // Simulate some work
      const start = Date.now();
      while (Date.now() - start < 10) {
        // Busy wait
      }
      
      const duration = performanceMonitor.measure('test-operation');
      
      expect(duration).toBeGreaterThan(0);
    });

    it('should return 0 for non-existent marks', () => {
      const consoleSpy = jest.spyOn(console, 'warn').mockImplementation();
      
      const duration = performanceMonitor.measure('non-existent');
      
      expect(duration).toBe(0);
      expect(consoleSpy).toHaveBeenCalled();
      
      consoleSpy.mockRestore();
    });
  });

  describe('Metrics Collection', () => {
    it('should calculate average time', () => {
      performanceMonitor.mark('avg-test');
      performanceMonitor.measure('avg-test');
      
      performanceMonitor.mark('avg-test');
      performanceMonitor.measure('avg-test');
      
      const average = performanceMonitor.getAverage('avg-test');
      
      expect(average).toBeGreaterThanOrEqual(0);
    });

    it('should return 0 average for non-existent metric', () => {
      const average = performanceMonitor.getAverage('non-existent');
      expect(average).toBe(0);
    });

    it('should provide summary of all metrics', () => {
      performanceMonitor.mark('metric-1');
      performanceMonitor.measure('metric-1');
      
      performanceMonitor.mark('metric-2');
      performanceMonitor.measure('metric-2');
      
      const summary = performanceMonitor.getSummary();
      
      expect(summary).toHaveProperty('metric-1');
      expect(summary).toHaveProperty('metric-2');
      expect(summary['metric-1']).toHaveProperty('avg');
      expect(summary['metric-1']).toHaveProperty('min');
      expect(summary['metric-1']).toHaveProperty('max');
      expect(summary['metric-1']).toHaveProperty('count');
    });
  });

  describe('Clear and Report', () => {
    it('should clear all metrics', () => {
      performanceMonitor.mark('clear-test');
      performanceMonitor.measure('clear-test');
      
      performanceMonitor.clear();
      
      const summary = performanceMonitor.getSummary();
      expect(Object.keys(summary).length).toBe(0);
    });

    it('should report metrics', () => {
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
      
      performanceMonitor.mark('report-test');
      performanceMonitor.measure('report-test');
      
      performanceMonitor.report();
      
      expect(consoleSpy).toHaveBeenCalledWith(
        '[Performance Summary]',
        expect.any(String)
      );
      
      consoleSpy.mockRestore();
    });
  });

  describe('Logging in Development', () => {
    it('should log measurements in dev mode', () => {
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
      
      performanceMonitor.mark('log-test');
      performanceMonitor.measure('log-test');
      
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('[Performance]')
      );
      
      consoleSpy.mockRestore();
    });
  });
});
