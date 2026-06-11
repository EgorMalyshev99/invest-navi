import {
  Link as RouterLink,
  redirect as routerRedirect,
  useLocation,
  useNavigate,
} from '@tanstack/react-router';
import * as React from 'react';

import { parseAuthNavigateTarget } from '@/features/auth/lib/parse-auth-navigate-target';

type LinkProps = Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> & {
  href: string;
};

const isExternalHref = (href: string): boolean => /^(https?:|mailto:|tel:)/.test(href);

export const Link = React.forwardRef<HTMLAnchorElement, LinkProps>(
  ({ href, children, ...props }, ref) => {
    if (isExternalHref(href)) {
      return (
        <a ref={ref} href={href} {...props}>
          {children}
        </a>
      );
    }

    return (
      <RouterLink ref={ref} to={href} {...props}>
        {children}
      </RouterLink>
    );
  },
);

Link.displayName = 'Link';

export const usePathname = () => useLocation({ select: (location) => location.pathname });

export const useSearchParams = () => {
  const href = useLocation({ select: (location) => location.href });
  return React.useMemo(
    () => new URLSearchParams(new URL(href, window.location.origin).search),
    [href],
  );
};

export const useRouter = () => {
  const navigate = useNavigate();

  return React.useMemo(
    () => ({
      push: (href: string) => {
        const target = parseAuthNavigateTarget(href);
        navigate(target);
      },
      replace: (href: string) => {
        const target = parseAuthNavigateTarget(href);
        navigate({ ...target, replace: true });
      },
      back: () => window.history.back(),
      refresh: () => window.location.reload(),
    }),
    [navigate],
  );
};

export const redirect = (to: string) => {
  throw routerRedirect({ to });
};

export const getPathname = ({ href }: { href: string }) => href;
