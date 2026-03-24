import type { Location, NavigateFunction } from 'react-router-dom';

/** Landing page section id for the private invitation request form */
export const LANDING_INVITE_SECTION_ID = 'apply';

/**
 * Go to the landing page with the invitation-request section in view.
 */
export function navigateToLandingInviteRequest(navigate: NavigateFunction) {
  navigate({ pathname: '/', hash: LANDING_INVITE_SECTION_ID });
}

/**
 * Go to the top of the landing page. If already on `/`, clears hash (e.g. #apply) and scrolls up.
 */
export function navigateToLandingTop(
  navigate: NavigateFunction,
  location?: Pick<Location, 'pathname' | 'hash'>,
) {
  const onLanding = location?.pathname === '/';
  if (onLanding) {
    if (location.hash && location.hash !== '') {
      navigate({ pathname: '/', hash: '' }, { replace: true });
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
    return;
  }
  navigate({ pathname: '/', hash: '' });
  window.setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 0);
}
