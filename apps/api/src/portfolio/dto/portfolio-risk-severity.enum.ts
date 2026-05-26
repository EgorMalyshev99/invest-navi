import { registerEnumType } from '@nestjs/graphql';

export enum PortfolioRiskSeverity {
  Info = 'info',
  Warning = 'warning',
}

registerEnumType(PortfolioRiskSeverity, { name: 'PortfolioRiskSeverity' });
