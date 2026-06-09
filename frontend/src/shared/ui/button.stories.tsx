import type { Meta, StoryObj } from '@storybook/react';

import { Button, type ButtonProps } from './button';

const meta: Meta<ButtonProps> = {
  title: 'Shared/Button',
  component: Button,
  tags: ['autodocs'],
  args: {
    children: 'Continuar',
    variant: 'primary',
    size: 'md',
  },
};

export default meta;

type Story = StoryObj<ButtonProps>;

export const Primary: Story = {};

export const Secondary: Story = {
  args: {
    variant: 'secondary',
    children: 'Cancelar',
  },
};

export const Danger: Story = {
  args: {
    variant: 'danger',
    children: 'Remover',
  },
};

export const WithIcon: Story = {
  args: {
    children: 'Adicionar',
    icon: <span aria-hidden>＋</span>,
  },
};
