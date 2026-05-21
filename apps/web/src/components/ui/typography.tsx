import { cva, type VariantProps } from 'class-variance-authority';
import { Slot } from 'radix-ui';
import * as React from 'react';

import { cn } from '@/lib/utils';

const typographyVariants = cva('text-foreground', {
  variants: {
    variant: {
      display: 'scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl',
      h1: 'scroll-m-20 text-3xl font-bold tracking-tight',
      h2: 'scroll-m-20 border-b border-border pb-2 text-2xl font-semibold tracking-tight',
      h3: 'scroll-m-20 text-xl font-semibold tracking-tight',
      h4: 'scroll-m-20 text-lg font-medium tracking-tight',
      body: 'leading-7 [&:not(:first-child)]:mt-6',
      lead: 'text-xl text-muted-foreground',
      large: 'text-lg font-semibold',
      small: 'text-sm leading-none font-medium',
      muted: 'text-sm text-muted-foreground',
      blockquote: 'mt-6 border-l-2 border-border pl-6 italic text-secondary-foreground',
      list: 'my-6 ml-6 list-disc [&>li]:mt-2',
      inlineCode:
        'relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold text-foreground',
    },
    numeric: {
      default: '',
      tabular: 'tabular-nums',
    },
  },
  defaultVariants: {
    variant: 'body',
    numeric: 'default',
  },
});

const variantTagMap: Record<
  NonNullable<VariantProps<typeof typographyVariants>['variant']>,
  React.ElementType
> = {
  display: 'h1',
  h1: 'h1',
  h2: 'h2',
  h3: 'h3',
  h4: 'h4',
  body: 'p',
  lead: 'p',
  large: 'p',
  small: 'small',
  muted: 'p',
  blockquote: 'blockquote',
  list: 'ul',
  inlineCode: 'code',
};

type TypographyProps = React.HTMLAttributes<HTMLElement> &
  VariantProps<typeof typographyVariants> & {
    asChild?: boolean;
  };

function Typography({
  className,
  variant = 'body',
  numeric = 'default',
  asChild = false,
  ...props
}: TypographyProps) {
  const Comp = asChild ? Slot.Root : variantTagMap[variant];

  return (
    <Comp
      data-slot="typography"
      data-variant={variant}
      className={cn(typographyVariants({ variant, numeric, className }))}
      {...props}
    />
  );
}

export { Typography, typographyVariants };
