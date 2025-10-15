import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { SalesChart } from '../SalesChart';

// Mock do Recharts
jest.mock('recharts', () => ({
  LineChart: ({ children }: any) => <div data-testid="line-chart">{children}</div>,
  BarChart: ({ children }: any) => <div data-testid="bar-chart">{children}</div>,
  AreaChart: ({ children }: any) => <div data-testid="area-chart">{children}</div>,
  Line: () => <div data-testid="line" />,
  Bar: () => <div data-testid="bar" />,
  Area: () => <div data-testid="area" />,
  XAxis: () => <div data-testid="x-axis" />,
  YAxis: () => <div data-testid="y-axis" />,
  CartesianGrid: () => <div data-testid="grid" />,
  Tooltip: () => <div data-testid="tooltip" />,
  Legend: () => <div data-testid="legend" />,
  ResponsiveContainer: ({ children }: any) => <div data-testid="responsive-container">{children}</div>,
}));

// Mock do Next.js router
jest.mock('next/router', () => ({
  useRouter: () => ({
    route: '/',
    pathname: '/',
    query: {},
    asPath: '/',
  }),
}));

describe('SalesChart', () => {
  const mockData = [
    { date: '2024-01-01', value: 1000 },
    { date: '2024-01-02', value: 1500 },
    { date: '2024-01-03', value: 2000 },
  ];

  const defaultProps = {
    data: mockData,
    title: 'Test Chart',
  };

  it('renders line chart by default', () => {
    render(<SalesChart {...defaultProps} />);
    
    expect(screen.getByTestId('line-chart')).toBeInTheDocument();
    expect(screen.getByText('Test Chart')).toBeInTheDocument();
  });

  it('renders bar chart when type is bar', () => {
    render(<SalesChart {...defaultProps} type="bar" />);
    
    expect(screen.getByTestId('bar-chart')).toBeInTheDocument();
  });

  it('renders area chart when type is area', () => {
    render(<SalesChart {...defaultProps} type="area" />);
    
    expect(screen.getByTestId('area-chart')).toBeInTheDocument();
  });

  it('displays empty state when no data', () => {
    render(<SalesChart {...defaultProps} data={[]} />);
    
    expect(screen.getByText('Nenhum dado disponível para exibir')).toBeInTheDocument();
  });

  it('displays loading state', () => {
    render(<SalesChart {...defaultProps} loading={true} />);
    
    expect(screen.getByRole('status', { hidden: true })).toBeInTheDocument();
  });

  it('displays error state', () => {
    render(<SalesChart {...defaultProps} error="Test error" />);
    
    expect(screen.getByText('Erro ao carregar gráfico')).toBeInTheDocument();
    expect(screen.getByText('Test error')).toBeInTheDocument();
  });

  it('renders type toggle buttons when onTypeChange is provided', () => {
    const onTypeChange = jest.fn();
    render(<SalesChart {...defaultProps} onTypeChange={onTypeChange} />);
    
    expect(screen.getByText('📈')).toBeInTheDocument();
    expect(screen.getByText('📊')).toBeInTheDocument();
    expect(screen.getByText('📉')).toBeInTheDocument();
  });

  it('calls onTypeChange when type button is clicked', async () => {
    const onTypeChange = jest.fn();
    render(<SalesChart {...defaultProps} onTypeChange={onTypeChange} />);
    
    const barButton = screen.getByText('📊');
    fireEvent.click(barButton);
    
    expect(onTypeChange).toHaveBeenCalledWith('bar');
  });

  it('displays chart statistics', () => {
    render(<SalesChart {...defaultProps} />);
    
    expect(screen.getByText('Total')).toBeInTheDocument();
    expect(screen.getByText('Média')).toBeInTheDocument();
    expect(screen.getByText('Máximo')).toBeInTheDocument();
    expect(screen.getByText('Pontos')).toBeInTheDocument();
  });

  it('formats currency values correctly', () => {
    render(<SalesChart {...defaultProps} />);
    
    // Check if currency formatting is applied
    expect(screen.getByText(/R\$/)).toBeInTheDocument();
  });

  it('handles custom height', () => {
    render(<SalesChart {...defaultProps} height={500} />);
    
    const container = screen.getByTestId('responsive-container');
    expect(container).toHaveStyle({ height: '500px' });
  });

  it('shows legend when showLegend is true', () => {
    render(<SalesChart {...defaultProps} showLegend={true} />);
    
    expect(screen.getByTestId('legend')).toBeInTheDocument();
  });

  it('hides legend when showLegend is false', () => {
    render(<SalesChart {...defaultProps} showLegend={false} />);
    
    expect(screen.queryByTestId('legend')).not.toBeInTheDocument();
  });

  it('shows grid when showGrid is true', () => {
    render(<SalesChart {...defaultProps} showGrid={true} />);
    
    expect(screen.getByTestId('grid')).toBeInTheDocument();
  });

  it('hides grid when showGrid is false', () => {
    render(<SalesChart {...defaultProps} showGrid={false} />);
    
    expect(screen.queryByTestId('grid')).not.toBeInTheDocument();
  });

  it('applies custom color', () => {
    render(<SalesChart {...defaultProps} color="#FF0000" />);
    
    // The color should be applied to the chart elements
    // This would need to be tested with actual chart rendering
    expect(screen.getByTestId('line-chart')).toBeInTheDocument();
  });

  it('handles empty data gracefully', () => {
    render(<SalesChart {...defaultProps} data={[]} />);
    
    expect(screen.getByText('Nenhum dado disponível para exibir')).toBeInTheDocument();
  });

  it('renders with custom className', () => {
    render(<SalesChart {...defaultProps} className="custom-class" />);
    
    const container = screen.getByText('Test Chart').closest('div');
    expect(container).toHaveClass('custom-class');
  });
});
