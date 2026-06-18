// Content moderation utilities for user-generated content (App Store Guideline 1.2).
// Provides: an objectionable-content filter applied before submission, plus
// report/block helpers that feed the moderation queue the developer acts on
// within 24 hours.
import { supabase } from './supabase';

export const TERMS_URL = 'https://visorup.co.uk/terms';
export const PRIVACY_URL = 'https://visorup.co.uk/privacy';
export const SUPPORT_EMAIL = 'hello@visorup.co.uk';

// Shown on the auth screen and in the in-app guidelines modal. Apple requires
// the agreement to make clear there is zero tolerance for objectionable content
// or abusive users.
export const EULA_SUMMARY =
  'VisorUp has zero tolerance for objectionable content or abusive behaviour. ' +
  'By creating an account you agree to our Terms of Use (EULA) and Community ' +
  'Guidelines: do not post content that is hateful, harassing, threatening, ' +
  'sexually explicit, violent, illegal, or otherwise objectionable, and do not ' +
  'abuse other riders. Content and accounts that breach these rules are removed ' +
  'and the responsible users are banned, usually within 24 hours of a report.';

export const COMMUNITY_GUIDELINES: string[] = [
  'Be respectful. No harassment, bullying, hate speech, or threats toward other riders.',
  'No objectionable content: nothing hateful, sexually explicit, violent, or illegal.',
  'No spam, scams, or unsolicited advertising.',
  'Only post content you own or have the right to share.',
  'Report anything that breaks these rules — we review reports and act within 24 hours.',
  'Abusive accounts are banned. Blocking a user hides all of their content from you instantly.',
];

export const REPORT_REASONS: { id: string; label: string }[] = [
  { id: 'spam', label: 'Spam or misleading' },
  { id: 'harassment', label: 'Harassment or bullying' },
  { id: 'hate', label: 'Hate speech or symbols' },
  { id: 'violence', label: 'Violence or threats' },
  { id: 'sexual', label: 'Nudity or sexual content' },
  { id: 'illegal', label: 'Illegal or dangerous activity' },
  { id: 'other', label: 'Something else' },
];

// Objectionable-term filter. Kept intentionally compact: catches the most common
// slurs and explicit terms with word-boundary + basic leetspeak normalisation so
// flagged content is blocked client-side before it is ever submitted. The server
// applies the same gate via report-driven moderation.
const BANNED_TERMS: string[] = [
  'nigger', 'nigga', 'faggot', 'fag', 'retard', 'spic', 'chink', 'kike',
  'wetback', 'tranny', 'coon', 'paki', 'cunt', 'whore', 'rape', 'rapist',
  'pedophile', 'paedophile', 'kill yourself', 'kys',
];

function normalise(text: string): string {
  return text
    .toLowerCase()
    .replace(/[@4]/g, 'a')
    .replace(/[1!|]/g, 'i')
    .replace(/[3]/g, 'e')
    .replace(/[0]/g, 'o')
    .replace(/[5$]/g, 's')
    .replace(/[7]/g, 't')
    .replace(/[^a-z\s]/g, '');
}

export function findObjectionable(text: string): string | null {
  if (!text) return null;
  const normalised = normalise(text);
  const padded = ' ' + normalised + ' ';
  for (const term of BANNED_TERMS) {
    if (term.includes(' ')) {
      if (normalised.includes(term)) return term;
    } else if (padded.includes(' ' + term + ' ')) {
      return term;
    }
  }
  return null;
}

export function containsObjectionable(text: string): boolean {
  return findObjectionable(text) !== null;
}

export type ReportInput = {
  contentType: 'post' | 'comment' | 'user';
  contentId: string;
  postId?: string | null;
  reportedUserId: string;
  reason: string;
  details?: string;
};

export async function reportContent(input: ReportInput): Promise<{ error: string | null }> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: 'You must be signed in to report content.' };

  const { error } = await supabase.from('content_reports').insert({
    reporter_id: user.id,
    content_type: input.contentType,
    content_id: input.contentId,
    post_id: input.postId ?? null,
    reported_user_id: input.reportedUserId,
    reason: input.reason,
    details: input.details ?? null,
  });
  return { error: error ? error.message : null };
}

export async function blockUser(
  blockedId: string,
  context?: { contentType?: 'post' | 'comment'; contentId?: string }
): Promise<{ error: string | null }> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: 'You must be signed in to block users.' };
  if (user.id === blockedId) return { error: 'You cannot block yourself.' };

  const { error } = await supabase
    .from('user_blocks')
    .upsert({ blocker_id: user.id, blocked_id: blockedId }, { onConflict: 'blocker_id,blocked_id' });
  if (error) return { error: error.message };

  // Blocking also notifies the developer of the offending account so it can be
  // reviewed and ejected (Guideline 1.2). Best-effort: never fail the block.
  await supabase.from('content_reports').insert({
    reporter_id: user.id,
    content_type: context?.contentType ?? 'user',
    content_id: context?.contentId ?? blockedId,
    post_id: null,
    reported_user_id: blockedId,
    reason: 'blocked',
    details: 'User blocked by reporter',
  });

  return { error: null };
}

export async function unblockUser(blockedId: string): Promise<{ error: string | null }> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: 'You must be signed in.' };
  const { error } = await supabase
    .from('user_blocks')
    .delete()
    .eq('blocker_id', user.id)
    .eq('blocked_id', blockedId);
  return { error: error ? error.message : null };
}

export async function getBlockedUserIds(): Promise<string[]> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];
  const { data } = await supabase
    .from('user_blocks')
    .select('blocked_id')
    .eq('blocker_id', user.id);
  return (data || []).map((r: { blocked_id: string }) => r.blocked_id);
}

export type BlockedProfile = { id: string; display_name: string | null };

export async function getBlockedProfiles(): Promise<BlockedProfile[]> {
  const ids = await getBlockedUserIds();
  if (ids.length === 0) return [];
  const { data } = await supabase
    .from('profiles')
    .select('id, display_name')
    .in('id', ids);
  const names = new Map((data || []).map((p: any) => [p.id, p.display_name]));
  return ids.map((id) => ({ id, display_name: names.get(id) ?? null }));
}
