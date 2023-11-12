import type { Meta, StoryObj } from '@storybook/react';

import Button from '../ui/Button/Button';

// More on how to set up stories at: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
const meta = {
  title: 'UI/Button',
  component: Button,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    type: {
      control: { type: 'select', options: [ 'primary', 'secondary' ] },
      description: 'Defines the button style type',
    },
    size: {
      control: { type: 'select', options: [ 'xs', 's', 'm', 'l', 'xl' ] },
      description: 'Defines the size of the button',
    },
    roundedCorners: {
      control: { type: 'select', options: [ 'all', 'top', 'none' ] },
      description: 'Defines border-radius of corners. Use value "top" for tabs'
    },
    disabled: {
      control: { type: 'boolean' },
      description: 'Disables the button if true',
    },
    fullWidth: {
      control: { type: 'boolean' },
      description: 'Make a button fills full available width',
    },
    onClick: { action: 'clicked', description: 'Event handler for click' },
    children: {
      description: 'The content of the button',
    },
  },
  decorators: [
    (Story) => (
      <div style={{
        background: '#111822',
        minWidth: '500px',
        padding: '10px 20px',
        border: 'solid 1px #87C2EA',
        display: 'flex',
        justifyContent: 'center'
      }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/react/writing-stories/args
export const Primary: Story = {
  args: {
    type: 'primary',
    size: 'm',
    children: 'I am a Primary Button'
  },
};

export const Secondary: Story = {
  args: {
    type: 'secondary',
    size: 'm',
    children: 'I am a Secondary Button'
  },
};

export const ExtraLarge: Story = {
  args: {
    size: 'xl',
    children: 'Extra Large Button',
  },
};

export const Large: Story = {
  args: {
    size: 'l',
    children: 'Large Button',
  },
};

export const Medium: Story = {
  args: {
    size: 'm',
    children: 'Medium Button',
  },
};

export const Small: Story = {
  args: {
    size: 's',
    children: 'Small Button',
  },
};

export const ExtraSmall: Story = {
  args: {
    size: 'xs',
    children: 'Extra Small Button',
  },
};

export const FullWidth: Story = {
  args: {
    type: 'primary',
    size: 'm',
    fullWidth: true,
    children: 'Full Width Button',
  },
};
