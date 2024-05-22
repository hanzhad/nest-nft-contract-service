import config from 'config';
import { InjectQueue } from '@nestjs/bull';
import { QueuesName } from 'common/constants/queues/name';
import { JobOptions, Queue } from 'bull';
import { Injectable } from '@nestjs/common';

import { QueueDataType } from 'common/types/queue.data.type';
import { CustomLogger } from '@opengeekslab_llc/nest-custom-logger';
import { FetchNFTService } from '../utlis/blockchain/fetch-nft.service';
import { QueueProcessorMethodsNames } from 'common/constants/queues/methods-names';
import { clearQueueJobs } from '../../../common/utils/functions';

@Injectable()
export class NftsQueueService {
  logger = CustomLogger(NftsQueueService.name);

  constructor(
    @InjectQueue(QueuesName.COLLECT_NFT_QUEUE) private readonly statsQueue: Queue,
    private readonly fetchNFTService: FetchNFTService,
  ) {}

  async [QueueProcessorMethodsNames.COLLECT_NFT]() {
    try {
      const data = await this.fetchNFTService.getNftList();
    } catch (e) {
      this.logger.error(e.message, e.stack);
    }
    return true;
  }

  async run(): Promise<void> {
    const cronData: QueueDataType = {
      method: QueueProcessorMethodsNames.COLLECT_NFT,
    };

    const cronOptions: JobOptions = {
      repeat: {
        cron: config.cronJobs.collectNft,
      },
    };

    await clearQueueJobs(this.statsQueue, QueueProcessorMethodsNames.COLLECT_NFT, this.logger);

    await this.statsQueue.add(
      QueueProcessorMethodsNames.COLLECT_NFT,
      cronData,
      cronOptions,
    );
  }
}
