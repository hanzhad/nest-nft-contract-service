import { Injectable } from '@nestjs/common';
import { ChainsRepository } from '../repositories/chains.repository';
import { ChainSchema } from '../schemas/chain.schema';
import { GetListChainsDto } from '../dto/get-list-chains.dto';
import { CreateChainDto } from '../dto/create-chain.dto';
import { UpdateChainDto } from '../dto/update-chain.dto';

@Injectable()
export class ChainsService {
  constructor(private readonly chainsRepository: ChainsRepository) {
  }

  async findAll(dto: GetListChainsDto): Promise<ChainSchema[]> {
    return this.chainsRepository.findAll(dto);
  }

  async findOne(id: number): Promise<ChainSchema> {
    return this.chainsRepository.findOne(id);
  }

  async create(dto: CreateChainDto): Promise<ChainSchema> {
    return this.chainsRepository.create(dto);
  }

  async update(id: number, dto: UpdateChainDto): Promise<ChainSchema> {
    return this.chainsRepository.update(id, dto);
  }

  async delete(id: number): Promise<number> {
    return this.chainsRepository.delete(id);
  }
}
