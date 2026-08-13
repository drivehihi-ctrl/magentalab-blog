# AI Content Security & WordPress Credential Rotation

## Goal

Remove runtime hardcoded WordPress credentials, require one strict AI Content Bearer secret, and rotate any previously exposed WordPress Application Password without downtime.

## Runtime authentication contract

All `/api/ai-content/**` routes must use `isAIContentAuthenticated(req)` from `lib/ai-content-auth.ts`.

Accepted authentication form only:

```http
Authorization: Bearer <AI_CONTENT_API_SECRET>
```

Not accepted:

- URL query secrets
- `x-api-secret`
- `x-ai-secret`
- `REVALIDATION_SECRET`
- hardcoded fallback tokens
- any non-empty arbitrary token

## WordPress write credentials

All WordPress write operations must use `lib/wp-write-auth.ts`.

Preferred Vercel environment variables:

```text
WORDPRESS_API_URL
WORDPRESS_API_USERNAME
WORDPRESS_API_APP_PASSWORD
```

During rotation only, the helper also recognizes existing environment-only aliases:

```text
WP_USER
WP_SEO_APP_PASSWORD
WP_APP_PASSWORD
```

There must be no password literal in runtime source code.

## Safe rotation order

1. In WordPress, create a new dedicated Application Password for the API user. Do not revoke the old one yet.
2. In Vercel Production environment variables, set/update:
   - `WORDPRESS_API_URL`
   - `WORDPRESS_API_USERNAME`
   - `WORDPRESS_API_APP_PASSWORD`
3. Confirm `AI_CONTENT_API_SECRET` is present and is a long random server-only value.
4. Redeploy Production.
5. Run read-only smoke tests for AI Content endpoints using the strict Bearer header.
6. Run one controlled WordPress write test through the Revision → Approve → Apply → Rollback flow on a safe test post.
7. Verify Supabase revision/backup/audit-log persistence.
8. Only after the new credential is proven in Production, revoke the old WordPress Application Password.
9. Remove legacy Vercel aliases (`WP_SEO_APP_PASSWORD`, `WP_APP_PASSWORD`) after confirming nothing else depends on them. Keep `WP_USER` only if another non-AI runtime still needs it.

## Failure behavior

If WordPress write environment variables are missing, write endpoints must fail closed with `WORDPRESS_WRITE_CONFIG_MISSING`; they must never fall back to a source-code credential.

If `AI_CONTENT_API_SECRET` is missing or the request is not a valid Bearer request, AI Content endpoints must return authentication failure.

## Git history note

Removing a secret from current source does not erase it from Git history. Any credential that has ever been committed must be considered compromised and rotated. Do not attempt to make the old credential safe by merely deleting the literal from the latest commit.

## Production pass criteria

- No runtime hardcoded WordPress password
- All AI Content routes use shared strict Bearer authentication
- Production write operations use Vercel environment credentials
- New WordPress Application Password verified through Apply + Rollback
- Old WordPress Application Password revoked
- Supabase audit trail confirms the test cycle
