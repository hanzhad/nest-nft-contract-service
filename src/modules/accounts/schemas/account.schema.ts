import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  HasMany,
  Model,
  Table,
} from 'sequelize-typescript';
import { NftSchema } from '../../nfts/schemas/nft.schema';
import { BidSchema } from '../../bids/schemas/bid.schema';
import { CollectionSchema } from '../../collections/schemas/collection.schema';
import { ArtistSchema } from '../../artists/schemas/artist.schema';
import { AgentSchema } from '../../agents/schemas/agent.schema';
import { OfferSchema } from '../../offers/schemas/offer.schema';

@Table({
  tableName: 'accounts',
  scopes: {
    public: {
      attributes: { exclude: ['nonce'] },
    },
  },
})
export class AccountSchema extends Model {

  @ForeignKey(() => CollectionSchema)
  @Column({
    type: DataType.INTEGER.UNSIGNED,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number;

  @Column
  address: string;

  @Column({ unique: true })
  name: string;

  @Column(DataType.INTEGER)
  rate: number;

  @Column
  nonce: string;

  @Column
  bio: string;

  @Column({ unique: true })
  slug: string;

  @Column(DataType.JSONB)
  socials: string;

  @Column
  twitter: string;

  @Column
  portfolio_url: string;

  @Column
  email: string;

  @Column
  avatar: string;

  @Column
  background: string;

  @ForeignKey(() => ArtistSchema)
  artistId: number;

  @ForeignKey(() => AgentSchema)
  agentId: number;

  @Column({ type: DataType.DATE })
  createdAt: Date;

  @Column({ type: DataType.DATE })
  updatedAt: Date;

  @BelongsTo(() => ArtistSchema)
  artist: ArtistSchema;

  @BelongsTo(() => AgentSchema)
  agent: AgentSchema;

  @HasMany(() => NftSchema)
  nft: NftSchema;

  @HasMany(() => BidSchema)
  bid: BidSchema;

  @HasMany(() => OfferSchema)
  offers: OfferSchema;
}
