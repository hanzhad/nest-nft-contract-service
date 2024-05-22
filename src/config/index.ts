import * as dotenv from 'dotenv';

dotenv.config({ path: '.ignored.env' });
dotenv.config();

const config = {
  webhook: {
    authFinishAuctionToken: process.env.AUTH_FINISH_AUCTION_TOKEN,
  },
  frontend: {
    url: process.env.FRONT_END_URL,
  },
  port: process.env.PORT || 5000,
  redis: {
    connectionParams: {
      host: process.env.REDIS_HOST,
      port: process.env.REDIS_PORT,
      password: process.env.REDIS_PASSWORD,
    },
    prefix: process.env.REDIS_PREFIX || 'app:app_name:',
  },
  postgres: {
    dialect: 'postgres',
    host: process.env.PG_HOST,
    username: process.env.PG_USER || 'postgres',
    port: process.env.PG_PORT,
    database: process.env.PG_BASE,
    password: process.env.PG_PASS,
    define: {
      timestamps: true,
    },
  },
  cronJobs: {
    collectBlockchainEvents: process.env.COLLECT_BLOCKCHAIN_EVENTS_CRONE || '*/5 * * * *',
    collectNft: process.env.COLLECT_NFT_CRONE || '*/5 * * * *',
    updateOffers: process.env.UPDATE_OFFERS || '*/5 * * * *',
    collectCollections: process.env.COLLECT_NFT_COLLECTIONS_CRONE || '* * * * *',
    rectCollectionAddresses: process.env.READ_COLLECTION_ADDRESSES_CRONE || '* * * * *',
  },
  blockchain: {
    httpProvider: process.env.HTTP_PROVIDER,
    contracts: {
      GOVAddress: process.env.GOV_ADDRESS,
      NFT1155PAddress: process.env.NFT1155P_ADDRESS,
      NFTMarketSolidAddress: process.env.MARKET_SOLID_ADDRESS,
    },
    highest_bid_eth_without_fee: process.env.HIGHEST_BID_ETH_WITHOUT_FEE,
  },
  sockets: {
    port: process.env.WS_PORT ? +process.env.WS_PORT : undefined,
    path: process.env.WS_PATH,
  },
  jwt: {
    secret: process.env.AUTH_JWT_SECRET,
    expiresIn: process.env.AUTH_JWT_EXPIRES_IN,
  },
  scrapper: {
    url: process.env.SCRAPPER_BASE_URL,
  },
  email: {
    ses: {
      accessKeyId: process.env.AWS_SES_KEY,
      secretAccessKey: process.env.AWS_SES_SECRET,
      region: process.env.AWS_SES_REGION,
    },
  },
  storage: {
    s3: {
      accessKeyId: process.env.S3_ACCESS_KEY_ID,
      secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
      bucketName: process.env.S3_BUCKET_NAME,
      endpoint: process.env.S3_ENDPOINT,
    },
  },
  isCollectorCollectionsJobDisabled: process.env.IS_COLLECTOR_COLLECTIONS_JOB_DISABLED === 'true',
  isCollectorCollectionsJobEnabledOnStart: process.env.IS_COLLECTOR_COLLECTIONS_JOB_ENABLED_ON_START === 'true',
  isUpdateOffersJobEnabledOnStart: process.env.IS_UPDATE_OFFERS_JOB_ENABLED_ON_START === 'true',
};
export default config;
