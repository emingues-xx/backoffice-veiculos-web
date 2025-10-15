import React from 'react';
import { render, screen } from '@testing-library/react';
import { MetricCard } from '../Dashboard/MetricCard';
import { DollarSign } from 'lucide-react';

// Mock do Next.js router
jest.mock('next/router', () => ({
  useRouter: () => ({
    route: '/',
    pathname: '/',
    query: {},
    asPath: '/',
  }),
}));

describe('MetricCard', () => {
  const defaultProps = {
    title: 'Test Metric',
    value: '1,000',
    icon: DollarSign,
    color: 'blue' as const,
  };

  it('renders with correct title and value', () => {
    render(<MetricCard {...defaultProps} />);
    
    expect(screen.getByText('Test Metric')).toBeInTheDocument();
    expect(screen.getByText('1,000')).toBeInTheDocument();
  });

  it('renders with correct icon', () => {
    render(<MetricCard {...defaultProps} />);
    
    const icon = screen.getByRole('img', { hidden: true });
    expect(icon).toBeInTheDocument();
  });

  it('applies correct color class', () => {
    render(<MetricCard {...defaultProps} color="green" />);
    
    const iconContainer = screen.getByRole('img', { hidden: true }).parentElement;
    expect(iconContainer).toHaveClass('bg-green-500');
  });

  it('renders change indicator when provided', () => {
    const change = {
      value: 5.2,
      type: 'increase' as const,
    };
    
    render(<MetricCard {...defaultProps} change={change} />);
    
    expect(screen.getByText('+5.2%')).toBeInTheDocument();
    expect(screen.getByText('vs mês anterior')).toBeInTheDocument();
  });

  it('renders decrease change with correct styling', () => {
    const change = {
      value: 3.1,
      type: 'decrease' as const,
    };
    
    render(<MetricCard {...defaultProps} change={change} />);
    
    const changeElement = screen.getByText('-3.1%');
    expect(changeElement).toBeInTheDocument();
    expect(changeElement).toHaveClass('text-red-600');
  });

  it('renders increase change with correct styling', () => {
    const change = {
      value: 8.5,
      type: 'increase' as const,
    };
    
    render(<MetricCard {...defaultProps} change={change} />);
    
    const changeElement = screen.getByText('+8.5%');
    expect(changeElement).toBeInTheDocument();
    expect(changeElement).toHaveClass('text-green-600');
  });

  it('handles numeric values correctly', () => {
    render(<MetricCard {...defaultProps} value={1500} />);
    
    expect(screen.getByText('1500')).toBeInTheDocument();
  });

  it('applies all color variants correctly', () => {
    const colors = ['blue', 'green', 'yellow', 'red', 'purple'] as const;
    
    colors.forEach(color => {
      const { unmount } = render(<MetricCard {...defaultProps} color={color} />);
      
      const iconContainer = screen.getByRole('img', { hidden: true }).parentElement;
      expect(iconContainer).toHaveClass(`bg-${color}-500`);
      
      unmount();
    });
  });

  it('has correct accessibility attributes', () => {
    render(<MetricCard {...defaultProps} />);
    
    const card = screen.getByRole('region', { hidden: true });
    expect(card).toBeInTheDocument();
  });

  it('renders without change indicator when not provided', () => {
    render(<MetricCard {...defaultProps} />);
    
    expect(screen.queryByText('vs mês anterior')).not.toBeInTheDocument();
  });
});
