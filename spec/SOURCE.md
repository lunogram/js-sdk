# Spec source

`spec/client.yaml` is **vendored** (committed) from a Lunogram platform
**release**. The SDK's low-level layer (`src/gen/schema.ts`) is generated from
it via `pnpm generate`. Do not hand-edit either file.

| Field       | Value                                |
| ----------- | ------------------------------------ |
| Source repo | https://github.com/lunogram/platform |
| Pinned tag  | `v0.1.0-rc.1`                        |
| Spec asset  | `client.yaml`                        |

Release asset URL to re-fetch the spec:

```
https://github.com/lunogram/platform/releases/download/v0.1.0-rc.1/client.yaml
```

## About the pin

The SDK pins a specific platform **release tag**. Every tagged platform release
publishes the client OpenAPI spec as a `client.yaml` asset (see the platform's
`.github/workflows/release.yml` → `openapi-specs` job), so the spec is fetched
from a stable, versioned, immutable source — no platform checkout or branch pin
required.

## How to bump the pin

1. Update the **Pinned tag** value above and the release asset URL to the new tag.
2. Re-fetch the spec into `spec/client.yaml` from the release asset URL above.
3. Run `pnpm generate` to regenerate `src/gen/schema.ts`.
4. Commit `spec/` and `src/gen/` together.
