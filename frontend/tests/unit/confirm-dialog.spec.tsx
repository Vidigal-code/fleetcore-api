import { fireEvent, render, screen } from '@testing-library/react';

import { ConfirmDialog } from '@/shared/ui/confirm-dialog';

describe('ConfirmDialog', () => {
  const setup = (overrides: Partial<Parameters<typeof ConfirmDialog>[0]> = {}) => {
    const onConfirm = jest.fn();
    const onClose = jest.fn();
    render(
      <ConfirmDialog
        open
        onClose={onClose}
        onConfirm={onConfirm}
        title="Remover marca"
        description="Esta ação não pode ser desfeita."
        confirmLabel="Remover"
        {...overrides}
      />,
    );
    return { onConfirm, onClose };
  };

  it('does not render anything while closed', () => {
    render(
      <ConfirmDialog open={false} onClose={jest.fn()} onConfirm={jest.fn()} title="Remover marca" />,
    );
    expect(screen.queryByText('Remover marca')).not.toBeInTheDocument();
  });

  it('renders the title and description', () => {
    setup();
    expect(screen.getByText('Remover marca')).toBeInTheDocument();
    expect(screen.getByText('Esta ação não pode ser desfeita.')).toBeInTheDocument();
  });

  it('invokes onConfirm when the confirm button is clicked', () => {
    const { onConfirm } = setup();
    fireEvent.click(screen.getByRole('button', { name: 'Remover' }));
    expect(onConfirm).toHaveBeenCalledTimes(1);
  });

  it('invokes onClose when the cancel button is clicked', () => {
    const { onClose } = setup();
    fireEvent.click(screen.getByRole('button', { name: 'Cancelar' }));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('disables the cancel button while loading', () => {
    setup({ loading: true });
    expect(screen.getByRole('button', { name: 'Cancelar' })).toBeDisabled();
  });
});
