import { beforeEach, describe, expect, it, vi } from 'vitest';

const { findFirst } = vi.hoisted(() => ({ findFirst: vi.fn() }));

vi.mock('@/db', () => ({
  db: {
    query: {
      admins: {
        findFirst,
      },
    },
  },
}));

vi.mock('@/db/schema', () => ({
  admins: {
    privyDid: 'privy_did',
  },
}));

vi.mock('drizzle-orm', () => ({
  eq: (column: unknown, value: unknown) => ({ column, value }),
}));

import {
  checkIsUserAdmin,
  hasBootstrapAdminAccess,
} from '@/server/auth/admin-access';

describe('admin access', () => {
  beforeEach(() => {
    findFirst.mockReset();
  });

  it('grants bootstrap access to jan@openworklabs.com', async () => {
    await expect(
      checkIsUserAdmin({
        privyDid: 'did:privy:test',
        email: ' JAN@openworklabs.com ',
      }),
    ).resolves.toBe(true);

    expect(hasBootstrapAdminAccess('jan@openworklabs.com')).toBe(true);
    expect(findFirst).not.toHaveBeenCalled();
  });

  it('falls back to the admin table for non-allowlisted emails', async () => {
    findFirst.mockResolvedValue({ privyDid: 'did:privy:existing-admin' });

    await expect(
      checkIsUserAdmin({
        privyDid: ' did:privy:existing-admin ',
        email: 'someone@example.com',
      }),
    ).resolves.toBe(true);

    expect(findFirst).toHaveBeenCalledTimes(1);
  });

  it('rejects users without an allowlisted email or admin record', async () => {
    findFirst.mockResolvedValue(null);

    await expect(
      checkIsUserAdmin({
        privyDid: 'did:privy:not-admin',
        email: 'someone@example.com',
      }),
    ).resolves.toBe(false);
  });
});
