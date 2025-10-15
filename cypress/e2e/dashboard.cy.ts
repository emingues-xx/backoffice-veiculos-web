describe('Dashboard E2E Tests', () => {
  beforeEach(() => {
    // Mock da API
    cy.intercept('GET', '**/api/metrics/**', {
      statusCode: 200,
      body: {
        revenue: {
          totalRevenue: 125000,
          period: {
            startDate: '2024-01-01',
            endDate: '2024-01-31'
          }
        },
        salesByDay: {
          salesByDay: [
            { date: '2024-01-01', count: 5, revenue: 10000 },
            { date: '2024-01-02', count: 8, revenue: 15000 },
            { date: '2024-01-03', count: 12, revenue: 20000 }
          ],
          period: {
            startDate: '2024-01-01',
            endDate: '2024-01-31'
          }
        },
        topSellers: {
          topSellers: [
            {
              sellerId: '1',
              sellerName: 'João Silva',
              salesCount: 25,
              revenue: 50000,
              commission: 2500
            }
          ],
          period: {
            startDate: '2024-01-01',
            endDate: '2024-01-31'
          }
        },
        totalSales: {
          totalSales: 50,
          totalRevenue: 125000,
          period: {
            startDate: '2024-01-01',
            endDate: '2024-01-31'
          },
          growth: 15.5
        }
      }
    }).as('getMetrics');

    // Mock do login
    cy.intercept('POST', '**/api/users/login', {
      statusCode: 200,
      body: {
        success: true,
        data: {
          user: {
            id: '1',
            email: 'admin@backoffice.com',
            role: 'admin'
          },
          token: 'mock-jwt-token'
        }
      }
    }).as('login');
  });

  it('should display dashboard with metrics after login', () => {
    // Visit login page
    cy.visit('/');
    
    // Login
    cy.get('input[type="email"]').type('admin@backoffice.com');
    cy.get('input[type="password"]').type('Admin123!@#');
    cy.get('button[type="submit"]').click();
    
    // Wait for login and redirect
    cy.wait('@login');
    cy.url().should('include', '/dashboard');
    
    // Wait for metrics to load
    cy.wait('@getMetrics');
    
    // Check if metric cards are displayed
    cy.get('[data-testid="metric-card"]').should('have.length.at.least', 4);
    
    // Check specific metrics
    cy.contains('Receita Total').should('be.visible');
    cy.contains('Total de Vendas').should('be.visible');
    cy.contains('Melhor Vendedor').should('be.visible');
    cy.contains('Ticket Médio').should('be.visible');
  });

  it('should display charts on dashboard', () => {
    cy.visit('/dashboard');
    cy.wait('@getMetrics');
    
    // Check if charts are rendered
    cy.get('[data-testid="sales-chart"]').should('have.length.at.least', 2);
    
    // Check chart titles
    cy.contains('Vendas por Dia').should('be.visible');
    cy.contains('Melhores Vendedores').should('be.visible');
  });

  it('should allow changing chart types', () => {
    cy.visit('/dashboard');
    cy.wait('@getMetrics');
    
    // Find a chart with type toggle
    cy.get('[data-testid="chart-type-toggle"]').first().should('be.visible');
    
    // Click on bar chart type
    cy.get('[data-testid="chart-type-toggle"]').first().within(() => {
      cy.contains('📊').click();
    });
    
    // Verify chart type changed
    cy.get('[data-testid="bar-chart"]').should('be.visible');
  });

  it('should display filters and allow date selection', () => {
    cy.visit('/dashboard');
    cy.wait('@getMetrics');
    
    // Check if filter bar is visible
    cy.get('[data-testid="filter-bar"]').should('be.visible');
    
    // Click on date range picker
    cy.get('[data-testid="date-range-picker"]').click();
    
    // Check if date picker dropdown is open
    cy.contains('Períodos rápidos').should('be.visible');
    
    // Select a preset
    cy.contains('Última semana').click();
    
    // Verify metrics are refreshed
    cy.wait('@getMetrics');
  });

  it('should handle loading states', () => {
    // Mock slow API response
    cy.intercept('GET', '**/api/metrics/**', {
      delay: 2000,
      statusCode: 200,
      body: {}
    }).as('getMetricsSlow');
    
    cy.visit('/dashboard');
    
    // Check if loading skeletons are displayed
    cy.get('[data-testid="metric-skeleton"]').should('be.visible');
    
    // Wait for API response
    cy.wait('@getMetricsSlow');
  });

  it('should handle error states', () => {
    // Mock API error
    cy.intercept('GET', '**/api/metrics/**', {
      statusCode: 500,
      body: { error: 'Internal Server Error' }
    }).as('getMetricsError');
    
    cy.visit('/dashboard');
    cy.wait('@getMetricsError');
    
    // Check if error message is displayed
    cy.contains('Erro ao carregar dashboard').should('be.visible');
    cy.contains('Tentar novamente').should('be.visible');
  });

  it('should be responsive on mobile', () => {
    cy.viewport('iphone-x');
    cy.visit('/dashboard');
    cy.wait('@getMetrics');
    
    // Check if layout adapts to mobile
    cy.get('[data-testid="metric-card"]').should('be.visible');
    
    // Check if sidebar is hidden on mobile
    cy.get('[data-testid="sidebar"]').should('not.be.visible');
    
    // Check if mobile menu button is visible
    cy.get('[data-testid="mobile-menu-button"]').should('be.visible');
  });

  it('should allow navigation between pages', () => {
    cy.visit('/dashboard');
    cy.wait('@getMetrics');
    
    // Click on vehicles link in sidebar
    cy.get('[data-testid="sidebar"]').within(() => {
      cy.contains('Veículos').click();
    });
    
    // Verify navigation
    cy.url().should('include', '/veiculos');
    
    // Navigate back to dashboard
    cy.get('[data-testid="sidebar"]').within(() => {
      cy.contains('Dashboard').click();
    });
    
    cy.url().should('include', '/dashboard');
  });

  it('should display user information in header', () => {
    cy.visit('/dashboard');
    cy.wait('@getMetrics');
    
    // Check if user email is displayed
    cy.get('[data-testid="user-menu"]').should('contain', 'admin@backoffice.com');
    
    // Check if user role is displayed
    cy.get('[data-testid="user-menu"]').should('contain', 'admin');
  });

  it('should allow logout', () => {
    cy.visit('/dashboard');
    cy.wait('@getMetrics');
    
    // Click on user menu
    cy.get('[data-testid="user-menu"]').click();
    
    // Click logout
    cy.contains('Sair').click();
    
    // Verify redirect to login page
    cy.url().should('include', '/');
    cy.contains('Login').should('be.visible');
  });

  it('should filter metrics by date range', () => {
    cy.visit('/dashboard');
    cy.wait('@getMetrics');
    
    // Open date picker
    cy.get('[data-testid="date-range-picker"]').click();
    
    // Set custom date range
    cy.get('input[type="date"]').first().type('2024-01-01');
    cy.get('input[type="date"]').last().type('2024-01-15');
    
    // Apply changes
    cy.contains('Aplicar').click();
    
    // Verify new API call with date parameters
    cy.wait('@getMetrics').then((interception) => {
      expect(interception.request.url).to.include('startDate=2024-01-01');
      expect(interception.request.url).to.include('endDate=2024-01-15');
    });
  });

  it('should display empty state when no data', () => {
    // Mock empty response
    cy.intercept('GET', '**/api/metrics/**', {
      statusCode: 200,
      body: {
        revenue: { totalRevenue: 0, period: {} },
        salesByDay: { salesByDay: [], period: {} },
        topSellers: { topSellers: [], period: {} },
        totalSales: { totalSales: 0, totalRevenue: 0, period: {}, growth: 0 }
      }
    }).as('getEmptyMetrics');
    
    cy.visit('/dashboard');
    cy.wait('@getEmptyMetrics');
    
    // Check if empty state is handled gracefully
    cy.get('[data-testid="metric-card"]').should('be.visible');
    cy.contains('R$ 0,00').should('be.visible');
  });
});
