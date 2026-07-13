import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

// getSanityEnv/getContactEnv memoize their first parse, so each test gets a
// fresh module via resetModules + dynamic import, against a controlled env.
const ORIGINAL_ENV = process.env;

const SANITY_VARS = {
  NEXT_PUBLIC_SANITY_PROJECT_ID: "abc123",
  NEXT_PUBLIC_SANITY_DATASET: "production",
  SANITY_API_VERSION: "2025-01-01",
  SANITY_READ_TOKEN: "sk-read",
  SANITY_REVALIDATE_SECRET: "hook-secret",
};

const CONTACT_VARS = {
  RESEND_API_KEY: "re_123",
  CONTACT_RECIPIENT_EMAIL: "council@example.com",
  CONTACT_SENDER_EMAIL: "site@example.com",
};

async function freshEnvModule(vars: Record<string, string>) {
  vi.resetModules();
  process.env = { ...ORIGINAL_ENV };
  for (const key of [...Object.keys(SANITY_VARS), ...Object.keys(CONTACT_VARS)]) {
    delete process.env[key];
  }
  Object.assign(process.env, vars);
  return import("./env");
}

beforeEach(() => {
  vi.resetModules();
});

afterEach(() => {
  process.env = ORIGINAL_ENV;
});

describe("getSanityEnv", () => {
  it("parses a fully configured Sanity env", async () => {
    const { getSanityEnv } = await freshEnvModule(SANITY_VARS);
    expect(getSanityEnv().NEXT_PUBLIC_SANITY_PROJECT_ID).toBe("abc123");
  });

  it("applies dataset and API version defaults when unset", async () => {
    const rest: Record<string, string> = { ...SANITY_VARS };
    delete rest.NEXT_PUBLIC_SANITY_DATASET;
    delete rest.SANITY_API_VERSION;
    const { getSanityEnv } = await freshEnvModule(rest);
    const env = getSanityEnv();
    expect(env.NEXT_PUBLIC_SANITY_DATASET).toBe("production");
    expect(env.SANITY_API_VERSION).toBe("2025-01-01");
  });

  it("throws a message naming each missing variable", async () => {
    const { getSanityEnv } = await freshEnvModule({});
    expect(() => getSanityEnv()).toThrowError(
      /NEXT_PUBLIC_SANITY_PROJECT_ID[\s\S]*SANITY_READ_TOKEN/,
    );
  });

  it("memoizes the parsed result", async () => {
    const { getSanityEnv } = await freshEnvModule(SANITY_VARS);
    expect(getSanityEnv()).toBe(getSanityEnv());
  });
});

describe("getContactEnv", () => {
  it("parses a fully configured contact env", async () => {
    const { getContactEnv } = await freshEnvModule(CONTACT_VARS);
    expect(getContactEnv().CONTACT_RECIPIENT_EMAIL).toBe("council@example.com");
  });

  it("rejects a non-email recipient", async () => {
    const { getContactEnv } = await freshEnvModule({
      ...CONTACT_VARS,
      CONTACT_RECIPIENT_EMAIL: "not-an-email",
    });
    expect(() => getContactEnv()).toThrowError(/CONTACT_RECIPIENT_EMAIL/);
  });

  it("does not require Sanity vars for the contact feature (lazy per-feature groups)", async () => {
    const { getContactEnv } = await freshEnvModule(CONTACT_VARS);
    expect(() => getContactEnv()).not.toThrow();
  });
});
