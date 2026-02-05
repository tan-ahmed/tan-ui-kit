import type { Meta, StoryObj } from '@storybook/react-vite';

import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from '../components/ui/accordion';

const meta = {
  title: 'Components/Accordion',
  component: Accordion,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    collapsible: {
      control: 'boolean',
    },
    multiple: {
      control: 'boolean',
    },
  },
  args: {
    collapsible: true,
    multiple: false,
  },
} satisfies Meta<typeof Accordion>;

export default meta;
type Story = StoryObj<typeof meta>;

function SampleAccordion(props: React.ComponentProps<typeof Accordion>) {
  return (
    <div className="w-[360px]">
      <Accordion {...props}>
        <AccordionItem value="item-1">
          <AccordionTrigger>What is Tan UI Kit?</AccordionTrigger>
          <AccordionContent>
            Tan UI Kit is a React component library built with Tailwind CSS v4 and Base UI.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-2">
          <AccordionTrigger>Is it customizable?</AccordionTrigger>
          <AccordionContent>
            Yes. You can theme it with CSS variables, Tailwind tokens, and your own components.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-3">
          <AccordionTrigger>Can I use it in existing apps?</AccordionTrigger>
          <AccordionContent>
            Absolutely. Install the package, import the components, and include the CSS bundle.
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}

export const Default: Story = {
  render: (args) => <SampleAccordion {...args} />,
};

export const MultipleOpen: Story = {
  args: {
    multiple: true,
  },
  render: (args) => <SampleAccordion {...args} />,
};

