import * as _ from 'lodash';
import { Inject, Injectable } from '@nestjs/common';
import { AccountSchema } from '../schemas/account.schema';
import { CreateAccountDto } from '../dto/create-account.dto';
import { UpdateAccountDto } from '../dto/update-account.dto';
import { AgentSchema } from '../../agents/schemas/agent.schema';
import { ArtistSchema } from '../../artists/schemas/artist.schema';
import { TeamSchema } from 'modules/teams/schemas/team.schema';
import { AccountCreatedEvent } from '../events/account-created.event';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Op } from 'sequelize';

@Injectable()
export class AccountsRepository {
  constructor(
    @Inject(AccountSchema.name) private readonly accountSchema: typeof AccountSchema,
    private readonly eventEmitter: EventEmitter2,
  ) {
    this.accountSchema.afterCreate((account) => {
      this.eventEmitter.emit(
        'account.created',
        new AccountCreatedEvent({
          id: account.id,
          address: account.address,
        }),
      );
    });
    this.accountSchema.afterBulkCreate((accountList) => {
      _.forEach(accountList, (account) => {
        if (!_.isNull(account.id)) {
          this.eventEmitter.emit(
            'account.created',
            new AccountCreatedEvent({
              id: account.id,
              address: account.address,
            }),
          );
        }
      });
    });
  }

  async bulkCreate(accountList) {
    await this.accountSchema.bulkCreate(
      accountList,
      {
        ignoreDuplicates: true,
      },
    );

    return this.accountSchema.findAll({
      where: {
        address: _.map(accountList, 'address'),
      },
    });
  }

  async findOne(id: number) {
    return this.accountSchema.scope('public')
      .findOne({
        where: { id },
        include: [
          {
            model: AgentSchema,
            required: false,
            // include: [
            //   {
            //     model: TeamSchema,
            //     required: false,
            //   },
            // ],
          },
          {
            model: ArtistSchema,
            required: false,
            include: [
              {
                model: TeamSchema,
                required: false,
                include: [
                  {
                    model: AgentSchema,
                    required: false,
                  },
                ],
              },
            ],
          },
        ],
      });
  }

  async findOneByIdOrSlug(slug: number | string) {
    return this.accountSchema.findOne({
      where: {
        [Op.or]: [
          {
            id: +slug || 0,
          },
          {
            slug,
          },
        ],
      },
      include: this.includeModel(),
    });
  }

  async findOneByParams(where) {
    return this.accountSchema.scope('public')
      .findOne({
        where,
        include: this.includeModel(),
      });
  }

  async findOneByAddress(address: string) {
    return this.accountSchema.scope('public').findOne({
      where: { address },
      include: this.includeModel(),
    });
  }

  async findOneByAddressPrivate(address: string) {
    return this.accountSchema.findOne({
      where: { address },
      include: this.includeModel(),
    });
  }

  findOneByEmail(email: string) {
    return this.accountSchema.findOne({
      where: { email },
      include: this.includeModel(),
    });
  }

  async getNonce(address: string) {
    return this.accountSchema.findOne({
      attributes: [
        'nonce',
      ],
      where: { address },
    });
  }

  async updateNonce(address: string, nonce: string): Promise<void> {
    await this.accountSchema.update(
      { nonce },
      {
        where: {
          address,
        },
      });
  }

  async create(dto: CreateAccountDto): Promise<AccountSchema> {
    const { id } = await this.accountSchema.create(dto);
    return this.findOne(id);
  }

  async update(address: string, dto: UpdateAccountDto): Promise<AccountSchema> {
    await this.accountSchema.update(
      dto,
      {
        where: {
          address,
        },
      });
    return this.findOneByAddress(address);
  }

  private includeModel() {
    return [
      {
        model: AgentSchema,
        required: false,
        // include: [
        //   {
        //     model: TeamSchema,
        //     required: false,
        //   },
        // ],
      },
      {
        model: ArtistSchema,
        required: false,
        include: [
          {
            model: TeamSchema,
            required: false,
            include: [
              {
                model: AgentSchema,
                required: false,
              },
            ],
          },
        ],
      },
    ];
  }
}
