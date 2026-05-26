import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';

import { CreatePortfolioPositionInput } from './dto/create-portfolio-position.input';
import { UpdatePortfolioPositionInput } from './dto/update-portfolio-position.input';
import { PortfolioPosition } from './entities/portfolio-position.type';
import { PortfolioSummary } from './entities/portfolio-summary.type';
import { PortfolioService } from './portfolio.service';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { GqlAuthGuard } from '../auth/guards/gql-auth.guard';

import type { AuthenticatedUser } from '../auth/auth.service';

@Resolver()
export class PortfolioResolver {
  constructor(private readonly portfolioService: PortfolioService) {}

  @UseGuards(GqlAuthGuard)
  @Query(() => [PortfolioPosition], { name: 'portfolioPositions' })
  portfolioPositions(@CurrentUser() user: AuthenticatedUser): Promise<PortfolioPosition[]> {
    return this.portfolioService.listPositions(user.userId);
  }

  @UseGuards(GqlAuthGuard)
  @Query(() => PortfolioPosition, { name: 'portfolioPosition' })
  portfolioPosition(
    @CurrentUser() user: AuthenticatedUser,
    @Args('id') id: string,
  ): Promise<PortfolioPosition> {
    return this.portfolioService.getPosition(user.userId, id);
  }

  @UseGuards(GqlAuthGuard)
  @Query(() => PortfolioSummary, { name: 'portfolioSummary' })
  portfolioSummary(@CurrentUser() user: AuthenticatedUser): Promise<PortfolioSummary> {
    return this.portfolioService.getSummary(user.userId);
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => PortfolioPosition, { name: 'createPortfolioPosition' })
  createPortfolioPosition(
    @CurrentUser() user: AuthenticatedUser,
    @Args('input') input: CreatePortfolioPositionInput,
  ): Promise<PortfolioPosition> {
    return this.portfolioService.createPosition(user.userId, input);
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => PortfolioPosition, { name: 'updatePortfolioPosition' })
  updatePortfolioPosition(
    @CurrentUser() user: AuthenticatedUser,
    @Args('id') id: string,
    @Args('input') input: UpdatePortfolioPositionInput,
  ): Promise<PortfolioPosition> {
    return this.portfolioService.updatePosition(user.userId, id, input);
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => Boolean, { name: 'deletePortfolioPosition' })
  deletePortfolioPosition(
    @CurrentUser() user: AuthenticatedUser,
    @Args('id') id: string,
  ): Promise<boolean> {
    return this.portfolioService.deletePosition(user.userId, id);
  }
}
