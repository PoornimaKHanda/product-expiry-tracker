# Expo Upgrade Plan (Safe, feature-branch)

Branch: `upgrade/expo-safety-test`

Goal

- Safely evaluate upgrading the Expo SDK and related dependencies without impacting `master`.

High-level steps

1. Create and work on the feature branch (done): `upgrade/expo-safety-test`.
2. Run the full test & build matrix on the branch before merging:
   - `npm ci` then `npm run type-check` (if available) and `npm test`.
3. Identify minimal set of package bumps required by `npm audit` (avoid `--force`).
4. Incrementally upgrade Expo SDK (minor steps):
   - Prefer upgrading to the next compatible SDK (e.g., 56 then 57) instead of jumping to latest.
   - After each bump: `npm install`, `npx expo prebuild`, `npx expo run:android` / `npx expo run:ios` for smoke tests.
5. Resolve breaking changes (consult Expo release notes):
   - Update `app.json` / config plugins and iOS/Android permission strings.
   - Fix TypeScript or runtime API changes.
6. Re-run `npm audit` and validate security findings are reduced.
7. When stable, open a PR with clear testing instructions and device verification checklist.

Testing checklist (on the branch)

- Manual device tests using dev client (see README): notifications, camera, attachments, and denied->settings flows.
- Run EAS dev builds if CI requires native verification.

Safety notes

- Do not run `npm audit fix --force` on `master` — it can upgrade Expo and cause large breaking changes.
- Keep the branch isolated; iterate small upgrades and commit often.
- If package resolution conflicts arise, prefer using `overrides` in `package.json` or testing dependency upgrades in feature branches.

Rollback

- If upgrade introduces regressions, revert the branch or open PR back to `master` with fixes. Use the commit history to bisect problematic changes.

Follow-up actions I can take on this branch

- Run `npm install` after proposing specific version bumps.
- Attempt an incremental Expo SDK bump and report runtime issues.
