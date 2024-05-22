import { Inject, Injectable } from '@nestjs/common';
import { NftReferralSchema } from '../schemas/nft-referral.schema';
import { CreateNftReferralLinkInterface } from './interfaces/create-nft-referral-link.interface';
import { AccountSchema } from '../../accounts/schemas/account.schema';
import { NftSchema } from '../schemas/nft.schema';

@Injectable()
export class NftReferralsRepository {
  constructor(@Inject(NftReferralSchema.name) private readonly nftReferralSchema: typeof NftReferralSchema) {
  }

  async findOne(id: number): Promise<NftReferralSchema> {
    return this.nftReferralSchema.findOne({
      where: {
        id,
      },
      include: this.includeModel(),
    });
  }

  findOneForNftByRef(nftId: number, ref: string): Promise<NftReferralSchema> {
    return this.nftReferralSchema.findOne({
      where: {
        nftId,
        ref,
      },
      include: this.includeModel(),
    });
  }

  async create(referral: CreateNftReferralLinkInterface): Promise<NftReferralSchema> {
    const [{ id }] = await this.nftReferralSchema.findOrCreate({
      where: {
        nftId: referral.nftId,
        accountId: referral.accountId,
      },
      include: this.includeModel(),
      defaults: referral,
    });
    // TODO: fix create response and refactor it. Include Account and NFT after create? than this.findOne(id) => res
    return this.findOne(id);
  }

  async deleteAllByNftId(nftId: number): Promise<void> {
    await this.nftReferralSchema.destroy({
      where: {
        nftId,
      },
    });
  }

  private includeModel() {
    return [
      {
        model: AccountSchema,
      },
      {
        model: NftSchema,
      },
    ];
  }
}
