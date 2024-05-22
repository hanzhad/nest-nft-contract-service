import * as _ from 'lodash';
import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { convertCurrency, toEther } from 'common/utils/functions';
import { NFTMarketSolidContract } from 'common/blockchain/contracts/nft-market-solid/NFT-market-solid.contract';
import { NFT1155PAbi } from 'common/blockchain/abi';
import { IRawHttpContract } from 'common/blockchain/core/contacts/raw-http-contract.service';

@Injectable()
export class FetchNFTService {
  constructor(
    private readonly rawContract: IRawHttpContract,
    private readonly nftMarketSolidContract: NFTMarketSolidContract,
  ) {
  }

  async getUri(nft) {
    const contract = this.rawContract
      .setAddress(nft?.nft)
      .setAbi(NFT1155PAbi)
      .contract;

    const method = contract.methods.uri;

    return method(nft?.id)
      .call();
  }

  async getMarketList() {
    const list = await this.nftMarketSolidContract.methods.fetchMarketItems()
      .call();
    const items = [];

    await Promise.all(_.map(list, async (nft) => {
      try {
        const tokenUri = await this.getUri(nft);
        const meta = await axios.get(tokenUri);
        const price = toEther(nft.unitPrice);

        const item = {
          id: _.toNumber(nft.id),
          price,
          currency: convertCurrency(nft.currency),
          tokenId: _.toNumber(nft.tokenId),
          seller: nft.seller,
          owner: nft.owner,
          image: meta.data.image,
          name: meta.data.name,
          title: meta.data.name,
          description: meta.data.description,
          type: 'fixed',
          url: tokenUri,
          users: [],
          brokerFee: _.toNumber(nft.brokerFee) / 10,
        };
        items?.push(item);
      } catch (e) {
        console.log('e', e);
      }
    }));

    return items;
  }

  async getNftList(): Promise<{ nftList: any[] }> {
    return {
      nftList: await this.getMarketList(),
    };
  }

  //
  // async getAuctionNFT(nftContract, auctionContract) {
  //   try {
  //     const provider = await nftContract.provider;
  //     const signer = provider.getSigner();
  //
  //     const auctionNFT = await auctionContract.fetchAuctions();
  //     const currentDate = new Date();
  //     const items = [];
  //
  //     await Promise.all(auctionNFT.map(async (nft) => {
  //       try {
  //         const tokenUri = await getUri(nft, signer);
  //
  //         const meta = await axios.get(tokenUri);
  //
  //         let minBid = await auctionContract.getMinBid(nft.id.toNumber(), 1);
  //         minBid = ethers.utils.formatUnits(minBid.toString(), 'ether');
  //
  //         // TODO return it
  //         const startTime = toLocalTimeInMilliseconds(nft.startTime.toNumber() * 1000);
  //         const durationTime = nft.durationTime.toNumber();
  //         const startDate = new Date(startTime);
  //
  //         let startDateMessage = '';
  //         let timeLeft = '';
  //
  //         if (currentDate > startDate) {
  //           timeLeft = getTimeLeft(currentDate, startTime, durationTime);
  //         } else {
  //           startDateMessage = `Start on ${moment(startTime).format('lll')}`;
  //         }
  //
  //         const item = {
  //           id: nft.id.toNumber(),
  //           tokenId: nft.tokenId.toNumber(),
  //           startTime,
  //           startDateMessage,
  //           durationTime,
  //           timeLeft,
  //           minPrice: _.toNumber(ethers.utils.formatUnits(nft.minUnitPrice.toString(), 'ether')),
  //           minPriceStep: _.toNumber(ethers.utils.formatUnits(nft.minPriceStep.toString(), 'ether')),
  //           minBid: _.toNumber(minBid),
  //           highestBid: _.toNumber(ethers.utils.formatUnits(nft.highestBid.toString(), 'ether')),
  //           highestBidder: nft.highestBidder,
  //           seller: nft.seller,
  //           buyer: nft.buyer,
  //           nft: nft.nft,
  //           currency: convertCurrency(nft.currency),
  //           status: Number(nft.status),
  //           image: meta.data.image,
  //           name: meta.data.name,
  //           description: meta.data.description,
  //           type: 'bid',
  //           brokerFee: nft.brokerFee.toNumber() / 10,
  //         };
  //
  //         items?.push(item);
  //       } catch (e) {
  //         console.log('e', e);
  //       }
  //     }));
  //
  //     return items;
  //   } catch (e) {
  //     console.error('getAuctionNFT', e.message, '\n', e);
  //     return [];
  //   }
  // }
  //
  // convertOneNFT(nft, currentDate) {
  //   nft.currency = convertCurrency(nft.currency);
  //
  //   if (nft.type === 'bid') {
  //     const startTime = toLocalTimeInMilliseconds(nft.startTime * 1000);
  //     const durationTime = nft.durationTime;
  //     const startDate = new Date(startTime);
  //
  //     let startDateMessage = '';
  //     let timeLeft = '';
  //
  //     if (currentDate > startDate) {
  //       timeLeft = getTimeLeft(currentDate, startTime, durationTime);
  //     } else {
  //       startDateMessage = `Start on ${moment(startTime).format('lll')}`;
  //     }
  //
  //     _.assignIn(nft, {
  //       startTime,
  //       startDateMessage,
  //       durationTime,
  //       timeLeft,
  //     });
  //   }
  //   return nft;
  // }
  //
  // convertNFTData(nfts) {
  //   const currentDate = new Date();
  //   return _.map(nfts, (nft) => convertOneNFT(nft, currentDate));
  // };
}
