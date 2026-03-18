import { db } from '@/db';
import { admins } from '@/db/schema';
import { eq } from 'drizzle-orm';

const BOOTSTRAP_ADMIN_EMAIL_ALLOWLIST = new Set(['jan@openworklabs.com']);

function normalizeEmail(email?: string | null): string | null {
  const normalizedEmail = email?.trim().toLowerCase();
  return normalizedEmail ? normalizedEmail : null;
}

export function hasBootstrapAdminAccess(email?: string | null): boolean {
  const normalizedEmail = normalizeEmail(email);
  return normalizedEmail
    ? BOOTSTRAP_ADMIN_EMAIL_ALLOWLIST.has(normalizedEmail)
    : false;
}

export async function checkIsUserAdmin(input: {
  privyDid?: string | null;
  email?: string | null;
}): Promise<boolean> {
  if (hasBootstrapAdminAccess(input.email)) {
    return true;
  }

  const normalizedId = input.privyDid?.trim();
  if (!normalizedId) {
    return false;
  }

  try {
    const admin = await db.query.admins.findFirst({
      where: eq(admins.privyDid, normalizedId),
    });

    return !!admin;
  } catch (error) {
    console.error('Admin check: Database error:', error);
    return false;
  }
}
