import { registerEnumType } from '@nestjs/graphql';
import { InstrumentType, MarketDataSource } from '@repo/api';

registerEnumType(InstrumentType, { name: 'InstrumentType' });
registerEnumType(MarketDataSource, { name: 'MarketDataSource' });
