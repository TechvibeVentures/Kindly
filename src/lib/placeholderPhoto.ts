/**
 * Placeholder profile photo URLs when user has not uploaded one.
 * Picking by userId gives a consistent "random" avatar per user.
 */
export const PLACEHOLDER_PHOTOS = [
  'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=500&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=500&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=500&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=500&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=500&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=500&fit=crop&crop=face',
];

export function getPlaceholderPhoto(userId: string | null | undefined): string {
  if (!userId) return PLACEHOLDER_PHOTOS[0];
  let n = 0;
  for (let i = 0; i < userId.length; i++) n += userId.charCodeAt(i);
  return PLACEHOLDER_PHOTOS[Math.abs(n) % PLACEHOLDER_PHOTOS.length];
}
