import { Accordion as AccordionPrimitive } from "@base-ui/react/accordion"

import { cn } from "@/lib/utils"
import { ChevronDown } from "lucide-react"
import { accordionVariants } from "./accordion.variants"

export type AccordionProps = AccordionPrimitive.Root.Props & {
  /** When true, multiple sections can be open at once. */
  multiple?: boolean
}

function Accordion({
  className,
  multiple = false,
  children,
  ...rootProps
}: AccordionProps) {
  return (
    <AccordionPrimitive.Root
      data-slot="accordion"
      multiple={multiple}
      className={cn(accordionVariants(), className)}
      {...rootProps}
    >
      {children}
    </AccordionPrimitive.Root>
  )
}

function AccordionItem({
  className,
  ...props
}: AccordionPrimitive.Item.Props) {
  return (
    <AccordionPrimitive.Item
      data-slot="accordion-item"
      className={cn("border-b border-border last:border-b-0", className)}
      {...props}
    />
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
          className="shrink-0 text-muted-foreground transition-transform duration-200"
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
