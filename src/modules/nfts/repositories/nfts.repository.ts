import axios from 'axios';
import * as _ from 'lodash';
import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Includeable, Op } from 'sequelize';
import { NftSchema } from '../schemas/nft.schema';
import { GetListNftDto } from '../dto/get-list-nft.dto';
import { CollectionSchema } from '../../collections/schemas/collection.schema';
import { CategorySchema } from '../../categories/schemas/category.schema';
import { ChainSchema } from '../../chains/schemas/chain.schema';
import { CurrentPageEnum } from '../enums/current-page.enum';
import { HighestBid, NftsWhereBuilder } from './query-builders/nfts.where.builder';
import { AccountSchema } from '../../accounts/schemas/account.schema';
import { CreateEventsNftDto } from '../dto/create-events-nft.dto';
import { NftTypeEnum } from '../enums/nft-type.enum';
import {
  IRawHttpContract,
  RawHttpContract,
} from '../../../common/blockchain/core/contacts/raw-http-contract.service';
import { ContractAbi, ContractType } from '../../../common/blockchain/core/enums';
import { parseDataEventsData } from '../../../common/blockchain/core/utils';
import { URIData } from '../../../common/blockchain/core/types';
import { CustomLogger } from '@opengeekslab_llc/nest-custom-logger';
import { NftPropertySchema } from '../schemas/nft-property.schema';
import { prepareNftPropertiesForSave } from '../../../common/utils/functions';
import { CreateNftDto } from '../dto/create-nft.dto';
import { UpdateNftDto } from '../dto/update-nft.dto';
import { NftPropertiesRepository } from './nft-properties.repository';
import { NftPropertiesWhereBuilder } from './query-builders/nft-properties.where.builder';

@Injectable()
export class NftsRepository {
  logger = CustomLogger(NftsRepository.name);

  constructor(
    @Inject(NftSchema.name) private readonly nftSchema: typeof NftSchema,
    private readonly nftPropertiesRepository: NftPropertiesRepository,
    @Inject(RawHttpContract.name) private readonly rawContract: IRawHttpContract,
  ) {
  }

  async getMyWalletNftData(tokenId: number, address: string) {
    const url: string = await this.rawContract
      .setAbi(ContractAbi[ContractType.C721])
      .setAddress(address)
      .methods
      .tokenURI(tokenId)
      .call();

    const { data: urlData }: { data: URIData } = await axios.get(url);
    return {
      url,
      urlData,
    };
  }

  async updateMyWallet(accountId: number, account: string): Promise<void> {
    try {
      const alchemyData = await axios(
        // TODO: move to env
        `https://eth-mainnet.g.alchemy.com/pr2uy4w9sTsRfnDmn0QIdGQVA6Bv6TCY/v1/getNFTs/?owner=${account}`,
      );

      const list = _.map(
        alchemyData?.data?.ownedNfts,
        ({
          contract,
          id,
        }) => ({
          contractAddress: contract.address,
          token_id: _.toNumber(id.tokenId),
        }),
      );

      const or = _.map(
        list,
        ({
          contractAddress,
          token_id,
        }) => (
          {
            [Op.not]: {
              contractAddress,
              token_id,
            },
          }
        ),
      );

      const dbList = await this.nftSchema.findAll({
        attributes: ['contractAddress', 'token_id'],
        where: {
          [Op.and]: [
            accountId,
            {
              [Op.or]: or,
            },
          ],

        },
      });

      const toProcess = _.filter(
        list,
        ({
          contractAddress,
          token_id,
        }) => !_.find(
          _.map(dbList, 'dataValues'),
          (item) => item.contractAddress === contractAddress && item.token_id === token_id),
      );

      const parseData = await Promise.all(
        _.map(
          toProcess,
          async (item): Promise<CreateEventsNftDto> => {
            try {
              const myWalletNftData = await this.getMyWalletNftData(item.token_id, item.contractAddress);

              return parseDataEventsData(
                {
                  eventData: {
                    tokenId: _.toString(item.token_id),
                    to: account,
                    from: '0x0',
                  },
                  contractAddress: item.contractAddress,
                  url: myWalletNftData.url,
                  urlData: myWalletNftData.urlData,
                },
              );
            } catch {
              return null;
            }
          },
        ),
      );

      await this.createCollectedNTFList(_.compact(parseData));
    } catch (e) {
      this.logger.error(e.message, e.stack);
    }
  }

  private getData(nft, currentAccountId?: number) {
    const data: Record<string, any> = {
      ..._.omit(
        nft, 'account', 'colection', 'chain', 'category',
        'created_by', 'updated_by', 'created_at', 'updated_at', 'createdAt', 'updatedAt', 'published_at',
      ),

      colectionId: nft.colection?.id || nft.colection,
      chainId: nft.chain?.id || nft.chain,
      categoryId: nft.category?.id || nft.category,
    };

    if (currentAccountId) {
      data.accountId = currentAccountId;
    }

    return data;
  }

  async findAllExpiredAuctions(highestBids: HighestBid[]) {
    const limit = 100;
    const offset = 0;

    const whereBuilder = new NftsWhereBuilder({});

    const where = whereBuilder
      .setExpiredAuctionFields(true)
      .setMinHighestBids(highestBids)
      .setField(true, 'on_sale')
      .setField(NftTypeEnum.fixed, 'type', true)
      .end();

    const items = await this.nftSchema.findAll({
      limit,
      offset,
      where,
      include: this.includeModelForFinishAuction(),
      order: [['updatedAt', 'DESC']],
    });
    return items.map(NftsRepository.prepareItem);
  }

  async findAll(getListNftDto: GetListNftDto, scope?: string) {
    const limit = getListNftDto?.limit || 100;
    const offset = getListNftDto?.offset || 0;

    const whereBuilder = new NftsWhereBuilder({});

    const where = whereBuilder
      .setSearch(getListNftDto.name_contains, 'name')
      .setIds(getListNftDto.collection, 'colectionId')
      .setIds(getListNftDto.chain, 'chainId')
      .setIds(getListNftDto.category, 'categoryId')
      .setStatus(getListNftDto.status)
      .setPriceAndCurrency(getListNftDto.currency, getListNftDto.priceMin, getListNftDto.priceMax)
      .setActiveAuctionFields(getListNftDto.live)
      .setExpiredAuctionFields(getListNftDto.expired)
      .setField(getListNftDto.on_sale, 'on_sale')
      .setField(getListNftDto.is_minted, 'is_minted')
      .end();

    const whereBuilderProps = new NftPropertiesWhereBuilder({});
    const whereProps = whereBuilderProps
      .setProperties(getListNftDto.property)
      .end();

    if (scope) {
      const res = await this.nftSchema.scope('publicList').findAndCountAll({
        limit,
        offset,
        where,
        include: this.includeListModel({
          whereNftPropertySchema: whereProps,
        }),
        order: [['updatedAt', 'DESC']],
      });
      return {
        items: res.rows.map(NftsRepository.prepareItem),
        count: res.count,
      };
    }
    const res = await this.nftSchema.findAndCountAll({
      limit,
      offset,
      where,
      include: this.includeModel(),
      order: [['updatedAt', 'DESC']],
    });
    return {
      items: res.rows.map(NftsRepository.prepareItem),
      count: res.count,
    };
  }

  async findMyAll(getListNftDto: GetListNftDto) {
    const limit = getListNftDto?.limit || 1000;
    const offset = getListNftDto?.offset || 0;
    const whereOld = this.getAllWhereByParams(getListNftDto);

    const whereBuilder = new NftsWhereBuilder(whereOld);

    const where = whereBuilder
      .setIds(getListNftDto.collection, 'colectionId')
      .setIds(getListNftDto.chain, 'chainId')
      .setIds(getListNftDto.category, 'categoryId')
      .setIds(getListNftDto.currentAccountId, 'accountId')
      .setStatus(getListNftDto.status)
      .setPriceAndCurrency(getListNftDto.currency, getListNftDto.priceMin, getListNftDto.priceMax)
      .setActiveAuctionFields(getListNftDto.live)
      .setExpiredAuctionFields(getListNftDto.expired)
      .setField(getListNftDto.on_sale, 'on_sale')
      .end();

    if (getListNftDto.current_page === 'owned') {
      await this.updateMyWallet(getListNftDto.currentAccountId, getListNftDto.currentAccountAddress);
    }

    const res = await this.nftSchema.findAndCountAll({
      limit,
      offset,
      where,
      include: this.includeModel(),
      order: [['updatedAt', 'DESC']],
    });
    return {
      items: res.rows.map(NftsRepository.prepareItem),
      count: res.count,
    };
  }

  async findOne(id: number, currentAccountId?: number) {
    const item = await this.nftSchema.findOne({
      where: { id },
      include: this.includeModel(),
    });

    if (!item) {
      throw new NotFoundException('Item not found');
    }

    const preparedItem = NftsRepository.prepareItem(item);
    if (!currentAccountId || preparedItem.accountId.toString() !== currentAccountId.toString()) {
      delete preparedItem.unlockable;
    }
    return preparedItem;
  }

  async create(dto: CreateNftDto, currentAccountId) {
    if (!dto.endDate && dto.start_date && dto.end_date) {
      dto.endDate = dto.start_date + dto.end_date * 1000;
    }

    const { id } = await this.nftSchema.create({
      ...this.getData(dto, currentAccountId),
      properties: prepareNftPropertiesForSave(dto.properties),
    }, {
      include: [NftPropertySchema],
    });

    return this.findOne(id);
  }

  async createCollectedNTFList(nftList: CreateEventsNftDto[]) {
    return this.nftSchema.bulkCreate(nftList, {
      updateOnDuplicate: ['accountId', 'colectionId'],
      include: [{
        model: NftPropertySchema,
        as: 'properties',
        required: false,
      }],
    },
    );
  }

  async update(id: number, dto: UpdateNftDto, currentAccountId: number) {
    if (dto?.currency) {
      dto.currency = dto?.currency?.toUpperCase?.();
    }

    await this.nftSchema.update(
      this.getData(dto),
      {
        where: {
          id: _.toNumber(id),
          accountId: _.toNumber(currentAccountId),
          contractAddress: {
            [Op.not]: null,
          },
        },
      });

    if (_.isArray(dto.properties)) {
      const nft = await this.findOne(id);
      const propsKeysInDto = dto.properties.map(p => p.key);
      const propertiesDeleteIds = nft.properties.filter(p => !propsKeysInDto.includes(p.key)).map(p => p.id);
      const propertiesUpdate = nft.properties.filter(p => propsKeysInDto.includes(p.key));

      const properties = prepareNftPropertiesForSave(dto.properties).map(p => {
        const prop = propertiesUpdate.find(pr => pr.key === p.key);
        return {
          id: prop?.id || null,
          ...p,
          nftId: id,
        };
      });
      await this.nftPropertiesRepository.bulkCreateOrUpdate(properties);
      await this.nftPropertiesRepository.deleteMany(propertiesDeleteIds);
    }

    return this.findOne(id);

    // const nft = await this.nftSchema.findOne({
    //   where: {
    //     id: _.toNumber(id),
    //     accountId: _.toNumber(currentAccountId),
    //   },
    //   include: [{
    //     model: NftPropertySchema,
    //     as: 'properties',
    //   }],
    // });
    //
    // if (_.isArray(dto.properties) || _.isArray(dto.stats)) {
    //   const properties = prepareNftPropertiesForSave([
    //     ...dto.properties,
    //     ...dto.stats,
    //   ]).map(p => NftPropertySchema.build(p));
    //   delete dto.properties;
    //   nft.set(dto);
    //   await nft.$set('properties', properties);
    //   return nft.save();
    // }
    // nft.set(dto);
    // return nft.save();
  }

  async transfer(id: number, nft: any) {
    await this.nftSchema.update(
      this.getData(nft),
      {
        where: {
          id: _.toNumber(id),
        },
      });

    return this.findOne(id);
  }

  async delete(id: number) {
    return this.nftSchema.destroy({ where: { id } });
  }

  private getAllWhereByParams(getListNftDto: GetListNftDto = null): any {
    if (!getListNftDto) {
      return {};
    }
    const currentAccountId = Number(getListNftDto.currentAccountId);

    switch (getListNftDto.current_page) {
      case CurrentPageEnum.on_sale:
        return {
          on_sale: true,
          accountId: currentAccountId,
        };
      case CurrentPageEnum.drafts:
        return {
          on_sale: {
            [Op.not]: true,
          },
          is_minted: {
            [Op.not]: true,
          },
          accountId: currentAccountId,
        };
      case CurrentPageEnum.owned:
        return {
          is_minted: true,
          accountId: currentAccountId,
        };
      case CurrentPageEnum.minted:
        return {
          is_minted: true,
          accountId: currentAccountId,
        };
      default:
        return {};
    }
  }

  private static prepareItem(itemSchema: NftSchema): any {
    const item: any = itemSchema.toJSON();
    item.description = item?.description?.replace?.(/(<([^>]+)>)/gi, '');
    return item;
  }

  private includeListModel(where?: { whereNftPropertySchema: any }) {
    const models: Includeable[] = _.filter(this.includeModel(), ({ model }) => !_.isEqual(NftPropertySchema, model));

    if (!_.isEmpty(where.whereNftPropertySchema)) {
      models.push({
        model: NftPropertySchema,
        where: where?.whereNftPropertySchema || {},
      });
    }

    return models;
  }

  private includeModelForFinishAuction() {
    return [{ model: ChainSchema, required: true, as: 'chain' }];
  }

  private includeModel() {
    return [
      {
        model: CollectionSchema,
        required: false,
      },
      {
        model: CategorySchema,
        required: false,
      },
      {
        model: ChainSchema,
        required: false,
      },
      {
        model: AccountSchema,
      },
      {
        model: AccountSchema,
      },
      {
        model: NftPropertySchema,
        required: false,
      },
    ];
  }
}
