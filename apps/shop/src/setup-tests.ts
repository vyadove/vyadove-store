import "next";

import { GlobalRegistrator } from "@happy-dom/global-registrator";
import { loadEnvConfig } from "@next/env";
import * as matchers from "@testing-library/jest-dom/matchers";
import { cleanup } from "@testing-library/react";
import { afterEach, expect } from "bun:test";

// Register happy-dom globals (document, window, etc.)
GlobalRegistrator.register();

loadEnvConfig(".");

// Set SECRET for auth tests
process.env.SECRET = process.env.SECRET || "test-secret-key";

/**
 * Bun test setup logic
 */

expect.extend(matchers);

afterEach(() => {
  cleanup();
});
