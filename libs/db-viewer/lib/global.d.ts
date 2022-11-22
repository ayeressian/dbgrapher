import type { TestingLibraryMatchers } from "@testing-library/jest-dom/matchers";

declare global {
  namespace jest {
    type Matchers<R = void> = TestingLibraryMatchers<
      typeof expect.stringContaining,
      R
    >;
  }
}
