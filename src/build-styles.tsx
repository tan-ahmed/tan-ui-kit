// This file is ONLY used during build to generate CSS
// It imports all components with all variants to ensure Tailwind generates all utility classes

import './index.css'
import { Button } from './components/ui/button'
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from './components/ui/accordion'

// Render all variants to ensure CSS is generated
export default function BuildStyles() {
  return (
    <>
      <Button variant="default" size="default" />
      <Button variant="default" size="sm" />
      <Button variant="default" size="lg" />
      <Button variant="default" size="icon" />
      <Button variant="destructive" size="default" />
      <Button variant="destructive" size="sm" />
      <Button variant="destructive" size="lg" />
      <Button variant="outline" size="default" />
      <Button variant="outline" size="sm" />
      <Button variant="outline" size="lg" />
      <Button variant="secondary" size="default" />
      <Button variant="secondary" size="sm" />
      <Button variant="secondary" size="lg" />
      <Button variant="ghost" size="default" />
      <Button variant="ghost" size="sm" />
      <Button variant="ghost" size="lg" />
      <Button variant="link" size="default" />
      <Button variant="link" size="sm" />
      <Button variant="link" size="lg" />
      <Accordion collapsible>
        <AccordionItem value="item-1">
          <AccordionTrigger>Trigger</AccordionTrigger>
          <AccordionContent>Content</AccordionContent>
        </AccordionItem>
      </Accordion>
    </>
  )
}
