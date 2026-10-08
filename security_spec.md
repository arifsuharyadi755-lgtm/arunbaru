# Security Specification: Arun News Firestore Access Control

## 1. Data Invariants
1. **Public Read Integrity**: News articles (`/articles/{articleId}`), approved reader comments (`/comments/{commentId}`), public saweran donations (`/donations/{donationId}`), and public brand settings (`/settings/{settingId}`) can be read publicly without auth, enabling frictionless news consumption for citizens.
2. **Admin Authority**: Only verified admin users (`arifsuharyadi755@gmail.com`) can modify editorial identity settings, remove articles, approve/modify ads, or delete reader comments.
3. **Public Submissions Guard**: Readers can submit citizen journalism reports, public opinions, saweran tips, and advertising orders with strict payload type and size constraints (`isValidId`, max string length, positive amounts).
4. **Counter & View Increment Safety**: Readers can increment article view counts and comment upvotes/downvotes, but cannot tamper with editorial headline, slug, or content.
5. **No Orphaned or Poisoned IDs**: Document IDs must match strict alphanumeric slug patterns (`^[a-zA-Z0-9_-]+$`) and be bounded to <= 128 characters.

## 2. The "Dirty Dozen" Payloads (Must Return PERMISSION_DENIED)
1. **Payload 1 (Admin Spoofing)**: Unauthenticated write to `/settings/logo` trying to hijack brand visual identity.
2. **Payload 2 (Unverified Email Admin Escalation)**: User with email `arifsuharyadi755@gmail.com` but `email_verified: false` attempting to update `/settings/editorial`.
3. **Payload 3 (Oversized Article Injection / Denial of Wallet)**: Injecting article with a 500KB title into `/articles/{articleId}`.
4. **Payload 4 (Path Poisoning)**: Writing to `/articles/../../system_config` with path traversal.
5. **Payload 5 (Negative Coffee Tip)**: Creating a donation in `/donations/tip-evil` with `amount: -50000`.
6. **Payload 6 (Shadow Key Update on Article)**: Updating an article with non-whitelisted key `__shadowAdmin: true`.
7. **Payload 7 (Ad Status Hijack)**: Unauthenticated reader updating ad status directly to `approved` or changing `totalCost` to 0.
8. **Payload 8 (Comment Text Poisoning)**: Posting a comment exceeding 1000 characters or containing script injections.
9. **Payload 9 (Unauthorized Article Deletion)**: Regular reader attempting to delete an editorial news article.
10. **Payload 10 (System Collection Write)**: Arbitrary write to unlisted path `/__internal_eval/exploit`.
11. **Payload 11 (Negative Views Count Tampering)**: Modifying `viewsCount` to negative numbers or modifying article author during view count increment.
12. **Payload 12 (Direct Arbitrary Settings Write)**: Modifying `/settings/secret_keys` with arbitrary data.

## 3. Test Runner Specification
The test suite in `firestore.rules.test.ts` executes these 12 malicious payloads against the local/emulator rules evaluator, confirming each rejects with `PERMISSION_DENIED`.
