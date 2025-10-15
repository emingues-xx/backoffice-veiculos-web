import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { DateRangePicker } from '../DateRangePicker';

// Mock do Next.js router
jest.mock('next/router', () => ({
  useRouter: () => ({
    route: '/',
    pathname: '/',
    query: {},
    asPath: '/',
  }),
}));

describe('DateRangePicker', () => {
  const defaultProps = {
    value: { startDate: null, endDate: null },
    onChange: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders with placeholder text', () => {
    render(<DateRangePicker {...defaultProps} />);
    
    expect(screen.getByText('Selecionar período')).toBeInTheDocument();
  });

  it('opens dropdown when clicked', async () => {
    const user = userEvent.setup();
    render(<DateRangePicker {...defaultProps} />);
    
    const button = screen.getByRole('button');
    await user.click(button);
    
    expect(screen.getByText('Períodos rápidos')).toBeInTheDocument();
  });

  it('displays selected date range', () => {
    const value = {
      startDate: new Date('2024-01-01'),
      endDate: new Date('2024-01-31'),
    };
    
    render(<DateRangePicker {...defaultProps} value={value} />);
    
    expect(screen.getByText('01/01/2024 - 31/01/2024')).toBeInTheDocument();
  });

  it('applies preset when selected', async () => {
    const user = userEvent.setup();
    const onChange = jest.fn();
    
    render(<DateRangePicker {...defaultProps} onChange={onChange} />);
    
    const button = screen.getByRole('button');
    await user.click(button);
    
    const todayButton = screen.getByText('Hoje');
    await user.click(todayButton);
    
    expect(onChange).toHaveBeenCalled();
  });

  it('validates date range correctly', async () => {
    const user = userEvent.setup();
    const onChange = jest.fn();
    
    render(<DateRangePicker {...defaultProps} onChange={onChange} />);
    
    const button = screen.getByRole('button');
    await user.click(button);
    
    const startDateInput = screen.getByLabelText('Data inicial');
    const endDateInput = screen.getByLabelText('Data final');
    
    // Set invalid date range (end before start)
    await user.type(startDateInput, '2024-01-31');
    await user.type(endDateInput, '2024-01-01');
    
    const applyButton = screen.getByText('Aplicar');
    await user.click(applyButton);
    
    expect(screen.getByText('Data de início deve ser anterior à data de fim')).toBeInTheDocument();
  });

  it('clears selection when clear button is clicked', async () => {
    const user = userEvent.setup();
    const onChange = jest.fn();
    
    const value = {
      startDate: new Date('2024-01-01'),
      endDate: new Date('2024-01-31'),
    };
    
    render(<DateRangePicker {...defaultProps} value={value} onChange={onChange} />);
    
    const clearButton = screen.getByRole('button', { name: /clear/i });
    await user.click(clearButton);
    
    expect(onChange).toHaveBeenCalledWith({ startDate: null, endDate: null });
  });

  it('closes dropdown when clicking outside', async () => {
    const user = userEvent.setup();
    render(<DateRangePicker {...defaultProps} />);
    
    const button = screen.getByRole('button');
    await user.click(button);
    
    expect(screen.getByText('Períodos rápidos')).toBeInTheDocument();
    
    // Click outside
    await user.click(document.body);
    
    await waitFor(() => {
      expect(screen.queryByText('Períodos rápidos')).not.toBeInTheDocument();
    });
  });

  it('displays error message when provided', () => {
    render(<DateRangePicker {...defaultProps} error="Invalid date range" />);
    
    expect(screen.getByText('Invalid date range')).toBeInTheDocument();
  });

  it('is disabled when disabled prop is true', () => {
    render(<DateRangePicker {...defaultProps} disabled={true} />);
    
    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
  });

  it('calls onPresetChange when preset is selected', async () => {
    const user = userEvent.setup();
    const onPresetChange = jest.fn();
    
    render(<DateRangePicker {...defaultProps} onPresetChange={onPresetChange} />);
    
    const button = screen.getByRole('button');
    await user.click(button);
    
    const lastWeekButton = screen.getByText('Última semana');
    await user.click(lastWeekButton);
    
    expect(onPresetChange).toHaveBeenCalledWith('lastWeek');
  });
});
