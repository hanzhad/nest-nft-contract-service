export interface BidCreatedEventProps {
  id: number;
  nftName: string,
  bidderId: number,
  sellerId: number,
  amount: number,
  currency: string,
}

export class BidCreatedEvent {
  readonly id: number;

  readonly nftName: string;

  readonly bidderId: number;

  readonly sellerId: number;

  readonly amount: number;

  readonly currency: string;

  constructor(props: BidCreatedEventProps) {
    this.id = props.id;
    this.nftName = props.nftName;
    this.bidderId = props.bidderId;
    this.sellerId = props.sellerId;
    this.amount = props.amount;
    this.currency = props.currency;
  }

}
