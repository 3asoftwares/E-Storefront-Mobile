import { useCallback } from 'react';
import { Platform, Alert } from 'react-native';

// Performance monitoring utility
class PerformanceMonitor {
  private metrics: Map<string, number[]> = new Map();
  private marks: Map<string, number> = new Map();

  // Start timing an operation
  mark(name: string): void {
    this.marks.set(name, performance.now());
  }

  // End timing and record the measurement
  measure(name: string, startMark?: string): number {
    const endTime = performance.now();
    const markName = startMark || name;
    const startTime = this.marks.get(markName);

    if (startTime === undefined) {
      console.warn(`No start mark found for: ${markName}`);
      return 0;
    }

    const duration = endTime - startTime;
    
    // Store metrics
    const existing = this.metrics.get(name) || [];
    existing.push(duration);
    this.metrics.set(name, existing);

    // Clean up mark
    this.marks.delete(markName);

    if (__DEV__) {
      console.log(`[Performance] ${name}: ${duration.toFixed(2)}ms`);
    }

    return duration;
  }

  // Get average time for a metric
  getAverage(name: string): number {
    const values = this.metrics.get(name);
    if (!values || values.length === 0) return 0;
    return values.reduce((a, b) => a + b, 0) / values.length;
  }

  // Get all metrics summary
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

  // Clear all metrics
  clear(): void {
    this.metrics.clear();
    this.marks.clear();
  }

  // Report metrics (send to server or log)
  report(): void {
    const summary = this.getSummary();
    console.log('[Performance Summary]', JSON.stringify(summary, null, 2));
    // Send to your analytics/monitoring service
  }
}

export const performanceMonitor = new PerformanceMonitor();

// Memory monitoring (development only)
export const checkMemoryUsage = (): void => {
  if (__DEV__ && Platform.OS !== 'web') {
    // @ts-ignore - performance.memory is non-standard
    const memory = (performance as any).memory;
    if (memory) {
      console.log('[Memory]', {
        usedJSHeapSize: `${(memory.usedJSHeapSize / 1048576).toFixed(2)} MB`,
        totalJSHeapSize: `${(memory.totalJSHeapSize / 1048576).toFixed(2)} MB`,
      });
    }
  }
};

// FPS Monitor hook
export const useFPSMonitor = (enabled: boolean = __DEV__) => {
  const frameCount = { current: 0 };
  const lastTime = { current: performance.now() };
  const fps = { current: 60 };

  const measureFPS = useCallback(() => {
    if (!enabled) return;

    frameCount.current++;
    const now = performance.now();
    const delta = now - lastTime.current;

    if (delta >= 1000) {
      fps.current = Math.round((frameCount.current * 1000) / delta);
      frameCount.current = 0;
      lastTime.current = now;

      if (fps.current < 30) {
        console.warn(`[FPS Warning] Low frame rate: ${fps.current} FPS`);
      }
    }

    requestAnimationFrame(measureFPS);
  }, [enabled]);

  return { startMonitoring: measureFPS, getFPS: () => fps.current };
};

// Network request timing wrapper
export const timedFetch = async (
  url: string,
  options?: RequestInit,
  metricName?: string
): Promise<Response> => {
  const name = metricName || `fetch:${new URL(url).pathname}`;
  performanceMonitor.mark(name);

  try {
    const response = await fetch(url, options);
    performanceMonitor.measure(name);
    return response;
  } catch (error) {
    performanceMonitor.measure(name);
    throw error;
  }
};

// Component render timing HOC
export const withRenderTiming = <P extends object>(
  WrappedComponent: React.ComponentType<P>,
  componentName: string
) => {
  return (props: P) => {
    performanceMonitor.mark(`render:${componentName}`);
    
    // Note: This is a simplified version. For accurate timing,
    // use React Profiler API or react-native-performance
    setTimeout(() => {
      performanceMonitor.measure(`render:${componentName}`);
    }, 0);

    return <WrappedComponent {...props} />;
  };
};
