import { fireEvent, render, screen, within } from '@testing-library/react';

import { SelectField, type SelectOption } from '@/shared/ui/select-field';

const options: SelectOption[] = [
  { value: 'a', label: 'Option A' },
  { value: 'b', label: 'Option B' },
];

const getHiddenSelect = (name: string) =>
  document.getElementById(name) as HTMLSelectElement;

describe('SelectField', () => {
  it('shows the placeholder and keeps the listbox closed initially', () => {
    render(<SelectField label="Marca" placeholder="Selecione" options={options} />);
    expect(screen.getByRole('combobox')).toHaveTextContent('Selecione');
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
  });

  it('opens the listbox with the options on trigger click', () => {
    render(<SelectField label="Marca" placeholder="Selecione" options={options} />);
    fireEvent.click(screen.getByRole('combobox'));
    const listbox = screen.getByRole('listbox');
    expect(within(listbox).getByText('Option A')).toBeInTheDocument();
    expect(within(listbox).getByText('Option B')).toBeInTheDocument();
  });

  it('selects an option by click, mirrors the hidden select and fires onChange', () => {
    const handleChange = jest.fn();
    render(
      <SelectField
        label="Marca"
        placeholder="Selecione"
        name="brand"
        options={options}
        onChange={handleChange}
      />,
    );
    fireEvent.click(screen.getByRole('combobox'));
    fireEvent.click(within(screen.getByRole('listbox')).getByText('Option B'));

    expect(getHiddenSelect('brand').value).toBe('b');
    expect(handleChange).toHaveBeenCalled();
    expect(screen.getByRole('combobox')).toHaveTextContent('Option B');
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
  });

  it('supports keyboard selection (ArrowDown then Enter)', () => {
    render(
      <SelectField label="Marca" placeholder="Selecione" name="brand" options={options} />,
    );
    const trigger = screen.getByRole('combobox');
    fireEvent.keyDown(trigger, { key: 'ArrowDown' }); // opens, active = first
    fireEvent.keyDown(trigger, { key: 'ArrowDown' }); // active = second
    fireEvent.keyDown(trigger, { key: 'Enter' }); // commit the active option

    expect(getHiddenSelect('brand').value).toBe('b');
  });

  it('closes the listbox on Escape', () => {
    render(<SelectField label="Marca" placeholder="Selecione" options={options} />);
    fireEvent.click(screen.getByRole('combobox'));
    expect(screen.getByRole('listbox')).toBeInTheDocument();
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
  });

  it('does not open when disabled', () => {
    render(<SelectField label="Marca" placeholder="Selecione" options={options} disabled />);
    fireEvent.click(screen.getByRole('combobox'));
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
  });
});
