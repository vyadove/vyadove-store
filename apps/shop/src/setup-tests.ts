import "next";

import { loadEnvConfig } from "@next/env";
import * as matchers from "@testing-library/jest-dom/matchers";
import { cleanup } from "@testing-library/react";
import { afterEach, expect } from "bun:test";

loadEnvConfig(".");

/**
 * Bun test setup logic
 */

expect.extend(matchers);

afterEach(() => {
  cleanup();
});
