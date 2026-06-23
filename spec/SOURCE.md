# Spec source

`spec/client.yaml` is **vendored** (committed) from the Lunogram platform repo.
The SDK's low-level layer (`src/gen/schema.ts`) is generated from it via
`pnpm generate`. Do not hand-edit either file.

| Field        | Value                                                                                 |
| ------------ | ------------------------------------------------------------------------------------- |
| Source repo  | https://github.com/lunogram/platform                                                  |
| Spec path    | `internal/http/controllers/v1/client/oapi/resources.yml`                              |
| Pinned ref   | `a12f901dc98e7ced44efbad27a388e8bf5ee0f3a`                                            |

Raw URL used by `spec-sync.yml` to re-fetch:

```
https://raw.githubusercontent.com/lunogram/platform/a12f901dc98e7ced44efbad27a388e8bf5ee0f3a/internal/http/controllers/v1/client/oapi/resources.yml
```

## About the pin

The ref above is the head of platform **PR #262**'s branch — a branch/commit
pin used during development. Pinning to a commit means **no platform release is
required** to consume the spec: any ref (branch, tag, or SHA) is fetchable from
the public repo via the raw URL.

**TODO:** once the platform cuts a release that ships the client spec (e.g.
`client.yaml` from a `v*.*.*` tag), flip the pinned ref to that tag for a stable,
reproducible source.

## How to bump the pin

1. Update the **Pinned ref** value above (and the raw URL).
2. Run `pnpm generate` to regenerate `src/gen/schema.ts`.
3. Commit `spec/` and `src/gen/` together.

The `spec-sync.yml` workflow automates re-fetching at the current pin and opens a
PR when the spec or generated output drifts; bumping the pin itself is a manual
edit to this file.
