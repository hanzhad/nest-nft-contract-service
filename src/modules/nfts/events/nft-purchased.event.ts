export interface NftPurchasedEventProps {
  id: number;
  nftName: string,
  customerId: number,
  sellerId: number,
  amount: number,
  currency: string,
}

export class NftPurchasedEvent {
  readonly id: number;

  readonly nftName: string;

  readonly customerId: number;

  readonly sellerId: number;

  readonly amount: number;

  readonly currency: string;

  constructor(props: NftPurchasedEventProps) {
    this.id = props.id;
    this.nftName = props.nftName;
    this.customerId = props.customerId;
    this.sellerId = props.sellerId;
    this.amount = props.amount;
    this.currency = props.currency;
  }

}
