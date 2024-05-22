import { Inject, Injectable } from '@nestjs/common';
import * as _ from 'lodash';
import { ChainSchema } from '../schemas/chain.schema';
import { WhereBuilder } from '../../../common/repository/where.builder';
import { GetListChainsDto } from '../dto/get-list-chains.dto';
import { CreateChainDto } from '../dto/create-chain.dto';
import { UpdateChainDto } from '../dto/update-chain.dto';
import { SystemContractsSchema } from '../schemas/system_contracts.schema';
import { CurrencySchema } from '../schemas/currency.schema';

@Injectable()
export class ChainsRepository {
  constructor(@Inject(ChainSchema.name) private readonly chainSchema: typeof ChainSchema) {
  }

  async findAll(dto: GetListChainsDto): Promise<ChainSchema[]> {
    const limit = dto.limit || 10;
    const offset = dto.offset || 0;

    const whereBuilder = new WhereBuilder({ active: true });
    const where = whereBuilder.setSearch(dto.name, 'name')
      .setField(dto.slug, 'slug')
      .end();

    return this.chainSchema.findAll({
      where,
      limit,
      offset,
      include: this.includeModel(),
      order: [['name', 'ASC']],
    });
  }

  async findOne(id: number): Promise<ChainSchema> {
    return this.chainSchema.findByPk(id, { include: this.includeModel() });
  }

  async create(dto: CreateChainDto): Promise<ChainSchema> {
    const { id } = await this.chainSchema.create(dto);
    return this.findOne(id);
  }

  async update(id: number, dto: UpdateChainDto): Promise<ChainSchema> {
    await this.chainSchema.update(
      dto,
      {
        where: {
          id: _.toNumber(id),
        },
      });
    return this.findOne(id);
  }

  async delete(id: number): Promise<number> {
    return this.chainSchema.destroy({ where: { id } });
  }

  private includeModel() {
    return [
      {
        model: CurrencySchema,
        as: 'currenciesList',
        required: true,
      },
      {
        model: SystemContractsSchema,
        as: 'systemContractsList',
        required: true,
      },
    ];
  }
}
