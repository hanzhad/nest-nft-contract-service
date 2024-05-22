export interface AccountCreatedEventProps {
  id: number;
  address: string;
}

export class AccountCreatedEvent {
  readonly id: number;

  readonly address: string;

  constructor(props: AccountCreatedEventProps) {
    this.id = props.id;
    this.address = props.address;
  }

}
