import { Op } from 'sequelize';
import { BadRequestException } from '@nestjs/common';
import { WhereBuilder } from 'common/repository/where.builder';

export interface HighestBid {
  currency: string;
  highest_bid: number;
}

export class NftsWhereBuilder extends WhereBuilder {

  setStatus(status?: string | string[]) {
    if (status) {
      const values = Array.isArray(status) ? status : [status];
      const types = values.map(value => {
        let type = null;
        switch (value) {
          case 'buy_now':
            type = 'fixed';
            break;
          case 'on_auction':
            type = 'bid';
            break;
        }
        return type;
      }).filter(t => t);
      this.where = {
        ...this.where,
        type: {
          [Op.in]: types,
        },
      };
    }
    return this;
  }

  setPriceAndCurrency(currency?: string, priceMin?: number, priceMax?: number) {
    if (currency) {
      this.setCurrency(currency);
      if (priceMin || priceMax) {
        if (priceMin && priceMax) {
          if (priceMax < priceMin) {
            throw new BadRequestException('The maximum price cannot be less than the minimum');
          }
          this.where = {
            ...this.where,
            price: {
              [Op.between]: [priceMin, priceMax],
            },
          };
        } else {
          if (priceMin) {
            this.where = {
              ...this.where,
              price: {
                [Op.gte]: priceMin,
              },
            };
          }
          if (priceMax) {
            this.where = {
              ...this.where,
              price: {
                [Op.lte]: priceMax,
              },
            };
          }
        }
      }
    }
    return this;
  }

  setActiveAuctionFields(isLive?: boolean) {
    if (isLive) {
      this.setField(true, 'on_sale');
      const now = Date.now();
      this.where = {
        ...this.where,
        start_date: {
          [Op.lte]: now,
        },
        endDate: {
          [Op.gte]: now,
        },
      };
    }
    return this;
  }

  setExpiredAuctionFields(isExpired?: boolean) {
    if (isExpired) {
      this.setField(true, 'on_sale');
      const now = Date.now();
      this.where = {
        ...this.where,
        endDate: {
          [Op.lt]: now,
        },
      };
    }
    return this;
  }

  setMinHighestBids(highestBids?: HighestBid[]) {
    if (highestBids.length) {
      this.where = {
        ...this.where,
        [Op.or]: highestBids.map(b => ({
          highest_bid: {
            [Op.gt]: b.highest_bid,
          },
          currency: b.currency,
        })),
      };
    }
    return this;
  }

  private setCurrency(currency?: string) {
    if (currency) {
      this.where = {
        ...this.where,
        currency: currency.toUpperCase(),
      };
    }
    return this;
  }
}
