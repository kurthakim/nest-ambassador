import { Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard';
import { LinkService } from './link.service';

@Controller()
export class LinkController {
  constructor(private linkService: LinkService) {}

  @UseGuards(AuthGuard)
  @Get('admin/users/:id/links')
  async all(@Param('id') id: number) {
    return this.linkService.find({
      user: id,
      relations: ['orders'],
    });
  }

  @UseGuards(AuthGuard)
  @Post('ambassador/links')
  async create() {}
}
