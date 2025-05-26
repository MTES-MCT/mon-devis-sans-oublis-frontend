type EnvOverrides = Record<string, string | undefined>;

export function mockEnv(overrides: EnvOverrides) {
  const originalEnv = { ...process.env };

  for (const key in overrides) {
    (process.env as any)[key] = overrides[key];
  }

  return () => {
    process.env = originalEnv;
  };
}
