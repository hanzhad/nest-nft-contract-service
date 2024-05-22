import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { ChainsService } from './services/chains.service';
import { ChainDto } from './dto/chain.dto';
import { GetListChainsDto } from './dto/get-list-chains.dto';

@ApiTags('Chains')
@Controller('chains')
export class ChainsController {
  constructor(private readonly chainsService: ChainsService) {
  }

  @ApiOkResponse({ type: [ChainDto] })
  @Get()
  async findAll(@Query() dto: GetListChainsDto) {
    return this.chainsService.findAll(dto);
  }

  @ApiOkResponse({ type: ChainDto })
  @Get(':id')
  async findOne(@Param('id') id: number) {
    return this.chainsService.findOne(id);
  }
}
