import { useState } from 'react';
import { ChevronUp } from 'lucide-react';
import { DesktopFooter } from './DesktopFooter';

const STRIP_HEIGHT = '2rem';
const PANEL_MAX_HEIGHT = '70vh';

/**
 * Desktop footer hidden by default; slides up when hovering the trigger strip
 * at the bottom. Uses two hover zones (strip + panel) so layout never changes.
 * Sizes use rem/vh only (no fixed px).
 */
export function DesktopFooterReveal() {
  const [stripHovered, setStripHovered] = useState(false);
  const [panelHovered, setPanelHovered] = useState(false);
  const isOpen = stripHovered || panelHovered;

  return (
    <div className="hidden md:block fixed bottom-0 left-48 right-0 z-30" style={{ height: STRIP_HEIGHT }}>
      <div
        className="absolute left-0 right-0 bottom-8 z-0 overflow-hidden border-t border-border bg-card shadow-[0_-4px_20px_-4px_rgba(0,0,0,0.08)] transition-transform duration-300 ease-out"
        style={{
          maxHeight: PANEL_MAX_HEIGHT,
          transform: isOpen ? 'translateY(0)' : 'translateY(100%)',
          pointerEvents: isOpen ? 'auto' : 'none',
        }}
        onMouseEnter={() => setPanelHovered(true)}
        onMouseLeave={() => setPanelHovered(false)}
      >
        <div className="overflow-y-auto max-h-[70vh] px-6 pt-6 pb-2">
          <DesktopFooter />
        </div>
      </div>
      <div
        className="absolute inset-x-0 bottom-0 z-10 flex items-center justify-center border-t border-border bg-card/95 backdrop-blur-sm cursor-pointer text-xs text-muted-foreground hover:text-foreground transition-colors"
        style={{ height: STRIP_HEIGHT }}
        aria-label="Show footer"
        onMouseEnter={() => setStripHovered(true)}
        onMouseLeave={() => setStripHovered(false)}
      >
        <ChevronUp className="w-4 h-4 mr-1" />
        <span>Footer</span>
      </div>
    </div>
  );
}
