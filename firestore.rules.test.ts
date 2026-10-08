/**
 * Security Rule Tests for Arun News Firestore Security Rules
 * Validates that all "Dirty Dozen" malicious payloads return PERMISSION_DENIED.
 */

export interface TestPayload {
  description: string;
  path: string;
  operation: 'get' | 'list' | 'create' | 'update' | 'delete';
  data?: any;
  auth?: {
    uid: string;
    email?: string;
    email_verified?: boolean;
  } | null;
  expectedResult: 'PERMISSION_DENIED';
}

export const DIRTY_DOZEN_PAYLOADS: TestPayload[] = [
  {
    description: '1. Unauthenticated write to settings/logo',
    path: '/settings/logo',
    operation: 'create',
    data: { textArun: 'HACKED' },
    auth: null,
    expectedResult: 'PERMISSION_DENIED'
  },
  {
    description: '2. Unverified email admin escalation',
    path: '/settings/editorial',
    operation: 'update',
    data: { hotline: '+123456789' },
    auth: { uid: 'spoof-1', email: 'arifsuharyadi755@gmail.com', email_verified: false },
    expectedResult: 'PERMISSION_DENIED'
  },
  {
    description: '3. Oversized article injection',
    path: '/articles/art-huge',
    operation: 'create',
    data: { title: 'A'.repeat(500000), slug: 'huge', category: 'politik' },
    auth: null,
    expectedResult: 'PERMISSION_DENIED'
  },
  {
    description: '4. Path poisoning with invalid characters',
    path: '/articles/$$$invalid-id$$$',
    operation: 'create',
    data: { title: 'Invalid ID' },
    auth: null,
    expectedResult: 'PERMISSION_DENIED'
  },
  {
    description: '5. Negative donation amount',
    path: '/donations/tip-neg',
    operation: 'create',
    data: { name: 'Attacker', amount: -50000, cups: -1 },
    auth: null,
    expectedResult: 'PERMISSION_DENIED'
  },
  {
    description: '6. Shadow key injection on article update',
    path: '/articles/art-1',
    operation: 'update',
    data: { __shadowAdmin: true },
    auth: null,
    expectedResult: 'PERMISSION_DENIED'
  },
  {
    description: '7. Ad totalCost hijack by non-admin',
    path: '/ads/ad-1',
    operation: 'update',
    data: { totalCost: 0, status: 'approved' },
    auth: null,
    expectedResult: 'PERMISSION_DENIED'
  },
  {
    description: '8. Oversized comment text poisoning',
    path: '/comments/c-huge',
    operation: 'create',
    data: { author: 'Spammer', text: 'X'.repeat(5000), articleId: 'art-1' },
    auth: null,
    expectedResult: 'PERMISSION_DENIED'
  },
  {
    description: '9. Unauthorized article deletion by regular user',
    path: '/articles/art-1',
    operation: 'delete',
    auth: { uid: 'user-normal', email: 'reader@example.com', email_verified: true },
    expectedResult: 'PERMISSION_DENIED'
  },
  {
    description: '10. Arbitrary write to unlisted path',
    path: '/__internal_eval/exploit',
    operation: 'create',
    data: { pwned: true },
    auth: null,
    expectedResult: 'PERMISSION_DENIED'
  },
  {
    description: '11. Tampering with article author during views increment',
    path: '/articles/art-1',
    operation: 'update',
    data: { viewsCount: 100, author: 'Attacker' },
    auth: null,
    expectedResult: 'PERMISSION_DENIED'
  },
  {
    description: '12. Arbitrary settings creation',
    path: '/settings/backdoor',
    operation: 'create',
    data: { backdoor: true },
    auth: null,
    expectedResult: 'PERMISSION_DENIED'
  }
];
