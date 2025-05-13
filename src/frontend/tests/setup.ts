import '@testing-library/jest-dom';
import { vi } from "vitest";

class IntersectionObserver {
  observe = vi.fn();
  unobserve = vi.fn();
  disconnect = vi.fn();
}
Object.defineProperty(global, "IntersectionObserver", {
  writable: true,
  configurable: true,
  value: IntersectionObserver,
});

class ResizeObserver {
  observe = vi.fn();
  unobserve = vi.fn();
  disconnect = vi.fn();
}
Object.defineProperty(global, "ResizeObserver", {
  writable: true,
  configurable: true,
  value: ResizeObserver,
});