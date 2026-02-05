import * as React from "react"
import { Accordion as AccordionPrimitive } from "@base-ui/react/accordion"

import { cn } from "@/lib/utils"
import { ChevronDown } from "lucide-react"
import { accordionVariants } from "./accordion.variants"


export type AccordionProps = AccordionPrimitive.Root.Props & {
  /** When true, multiple sections can be open at once. */
  multiple?: boolean
  /** Colour of the divider between accordion items. Useful for CMS/theming. */
  dividerColor?: string
}

function Accordion({
  className,
  multiple = false,
  dividerColor,
  style,
  children,
  ...rootProps
}: AccordionProps) {
  const cssVars = {
    ...(dividerColor != null && { "--accordion-divider": dividerColor }),
  } as React.CSSProperties
  return (
    <AccordionPrimitive.Root
      data-slot="accordion"
      multiple={multiple}
      className={cn(accordionVariants(), className)}
      style={{ ...cssVars, ...style }}
      {...rootProps}
    >
      {children}
    </AccordionPrimitive.Root>
  )
}

function AccordionItem({
  className,
  children,
  ...props
}: AccordionPrimitive.Item.Props) {
  return (
    <AccordionPrimitive.Item
      data-slot="accordion-item"
      className={cn("group", className)}
      {...props}
    >
      {children}
      <div
        aria-hidden
        className="border-b border-(--accordion-divider,var(--color-gray-800)) mx-5 group-last:border-b-0"
      />
    </AccordionPrimitive.Item>
  )
}

function AccordionTrigger({
  className,
  children,
  ...props
}: AccordionPrimitive.Trigger.Props) {
  return (
    <AccordionPrimitive.Header className="flex">
      <AccordionPrimitive.Trigger
        data-slot="accordion-trigger"
        className={cn(
          "flex w-full flex-1 items-center justify-between py-4 px-4 text-left text-sm font-medium text-foreground",
          "hover:opacity-80 transition-all",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
          "disabled:pointer-events-none disabled:opacity-50",
          "[&[data-panel-open]>svg]:rotate-180",
          className
        )}
        {...props}
      >
        {children}
        <ChevronDown
          className="shrink-0 text-black transition-transform duration-200"
          size={20}
        />
      </AccordionPrimitive.Trigger>
    </AccordionPrimitive.Header>
  )
}

function AccordionContent({
  className,
  children,
  ...props
}: AccordionPrimitive.Panel.Props) {
  return (
    <AccordionPrimitive.Panel
      data-slot="accordion-content"
      className="overflow-hidden data-open:animate-accordion-down data-closed:animate-accordion-up"
      {...props}
    >
      <div
        className={cn(
          "pt-0 pb-4 px-4 text-sm text-muted-foreground h-(--accordion-panel-height) data-ending-style:h-0 data-starting-style:h-0",
          "[&_p:not(:last-child)]:mb-4",
          className
        )}
      >
        {children}
      </div>
    </AccordionPrimitive.Panel>
  )
}

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent }
