import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { assertCreatePortfolioPositionInput, assertUpdatePortfolioPositionInput } from '@repo/api';

import { PortfolioPositionsRepository } from '../database/repositories/portfolio-positions.repository';
import { MarketService } from '../market/market.service';
import { CreatePortfolioPositionInput } from './dto/create-portfolio-position.input';
import { UpdatePortfolioPositionInput } from './dto/update-portfolio-position.input';
import { PortfolioPosition } from './entities/portfolio-position.type';
import { PortfolioSummary } from './entities/portfolio-summary.type';
import { computePortfolioSummary } from './lib/compute-portfolio-summary';
import { mapPortfolioPosition, type PortfolioMarketSnapshot } from './lib/map-portfolio-position';

import type { portfolioPositions } from '../database/schema/portfolio-positions';

@Injectable()
export class PortfolioService {
  constructor(
    private readonly portfolioPositionsRepository: PortfolioPositionsRepository,
    private readonly marketService: MarketService,
  ) {}

  async listPositions(userId: string): Promise<PortfolioPosition[]> {
    const rows = await this.portfolioPositionsRepository.findByUserId(userId);
    return this.enrichPositions(rows);
  }

  async getPosition(userId: string, positionId: string): Promise<PortfolioPosition> {
    const row = await this.portfolioPositionsRepository.findByIdForUser(positionId, userId);
    if (!row) {
      throw new NotFoundException('Portfolio position not found');
    }
    const positions = await this.enrichPositions([row]);
    const position = positions[0];
    if (!position) {
      throw new NotFoundException('Portfolio position not found');
    }
    return position;
  }

  async getSummary(userId: string): Promise<PortfolioSummary> {
    const positions = await this.listPositions(userId);
    return computePortfolioSummary(positions);
  }

  async createPosition(
    userId: string,
    input: CreatePortfolioPositionInput,
  ): Promise<PortfolioPosition> {
    const validated = this.validateCreate(input);
    await this.assertAssetExists(validated.assetSymbol);

    const [created] = await this.portfolioPositionsRepository.create({
      userId,
      assetSymbol: validated.assetSymbol,
      quantity: String(validated.quantity),
      entryPrice: String(validated.entryPrice),
      entryDate: validated.entryDate,
      goal: validated.goal,
    });

    if (!created) {
      throw new BadRequestException('Failed to create portfolio position');
    }

    return this.getPosition(userId, created.id);
  }

  async updatePosition(
    userId: string,
    positionId: string,
    input: UpdatePortfolioPositionInput,
  ): Promise<PortfolioPosition> {
    const existing = await this.portfolioPositionsRepository.findByIdForUser(positionId, userId);
    if (!existing) {
      throw new NotFoundException('Portfolio position not found');
    }

    const updates = this.validateUpdate(input);
    if (updates.assetSymbol) {
      await this.assertAssetExists(updates.assetSymbol);
    }

    const dbUpdates: Partial<typeof portfolioPositions.$inferInsert> = {};
    if (updates.assetSymbol !== undefined) {
      dbUpdates.assetSymbol = updates.assetSymbol;
    }
    if (updates.quantity !== undefined) {
      dbUpdates.quantity = String(updates.quantity);
    }
    if (updates.entryPrice !== undefined) {
      dbUpdates.entryPrice = String(updates.entryPrice);
    }
    if (updates.entryDate !== undefined) {
      dbUpdates.entryDate = updates.entryDate;
    }
    if (updates.goal !== undefined) {
      dbUpdates.goal = updates.goal;
    }

    const [updated] = await this.portfolioPositionsRepository.update(positionId, userId, dbUpdates);
    if (!updated) {
      throw new NotFoundException('Portfolio position not found');
    }

    return this.getPosition(userId, updated.id);
  }

  async deletePosition(userId: string, positionId: string): Promise<boolean> {
    const deleted = await this.portfolioPositionsRepository.delete(positionId, userId);
    if (!deleted.length) {
      throw new NotFoundException('Portfolio position not found');
    }
    return true;
  }

  private async enrichPositions(
    rows: (typeof portfolioPositions.$inferSelect)[],
  ): Promise<PortfolioPosition[]> {
    const marketBySymbol = new Map<string, PortfolioMarketSnapshot>();

    await Promise.all(
      [...new Set(rows.map((row) => row.assetSymbol))].map(async (symbol) => {
        const snapshot = await this.fetchMarketSnapshot(symbol);
        if (snapshot) {
          marketBySymbol.set(symbol, snapshot);
        }
      }),
    );

    return rows.map((row) => mapPortfolioPosition(row, marketBySymbol.get(row.assetSymbol)));
  }

  private async fetchMarketSnapshot(symbol: string): Promise<PortfolioMarketSnapshot | null> {
    try {
      const asset = await this.marketService.getAsset(symbol);
      return {
        assetName: asset.name,
        instrumentType: asset.instrumentType,
        currency: asset.currency,
        currentPrice: asset.lastPrice,
      };
    } catch {
      return null;
    }
  }

  private async assertAssetExists(symbol: string): Promise<void> {
    await this.marketService.getAsset(symbol);
  }

  private validateCreate(input: CreatePortfolioPositionInput) {
    try {
      return assertCreatePortfolioPositionInput({
        assetSymbol: input.assetSymbol,
        quantity: input.quantity,
        entryPrice: input.entryPrice,
        entryDate: input.entryDate,
        goal: input.goal,
      });
    } catch (error) {
      throw new BadRequestException(
        error instanceof Error ? error.message : 'Invalid portfolio position input',
      );
    }
  }

  private validateUpdate(input: UpdatePortfolioPositionInput) {
    try {
      return assertUpdatePortfolioPositionInput({
        assetSymbol: input.assetSymbol,
        quantity: input.quantity,
        entryPrice: input.entryPrice,
        entryDate: input.entryDate,
        goal: input.goal,
      });
    } catch (error) {
      throw new BadRequestException(
        error instanceof Error ? error.message : 'Invalid portfolio position input',
      );
    }
  }
}
