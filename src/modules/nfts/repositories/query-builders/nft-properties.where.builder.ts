import { Op } from 'sequelize';
import { WhereBuilder } from 'common/repository/where.builder';

export class NftPropertiesWhereBuilder extends WhereBuilder {

  setProperties(properties?: any) {
    if (properties) {
      Object.keys(properties).forEach(key => {
        const values = Array.isArray(properties[key]) ? properties[key] : [properties[key]];
        this.where = {
          ...this.where,
          key,
          value: {
            [Op.in]: values,
          },
        };
      });
    }
    return this;
  }
}
