import { Inject, Injectable } from '@nestjs/common';
import { NftPropertySchema } from '../schemas/nft-property.schema';

@Injectable()
export class NftPropertiesRepository {
  constructor(@Inject(NftPropertySchema.name) private readonly nftPropertySchema: typeof NftPropertySchema) {
  }

  async bulkCreateOrUpdate(propertiesDto: any[]) {
    await this.nftPropertySchema.bulkCreate(propertiesDto, { updateOnDuplicate: ['key', 'value', 'maxValue'] });
  }

  async deleteMany(propertiesIds: number[]) {
    await this.nftPropertySchema.destroy({
      where: {
        id: propertiesIds,
      },
    });
  }
}
