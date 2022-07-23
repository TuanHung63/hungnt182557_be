import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CustomerService } from './customer.service';
import { CustomerDTO, CustomerResponseDTO, getCustomerDTO } from './dto/customer.dto';

@Controller('customer')
@ApiBearerAuth()
@ApiTags('Khách hàng')
export class CustomerController {

  constructor(private customerService: CustomerService) { }

  @ApiOperation({ summary: 'Lấy toàn bộ danh sách khách hàng' })
  @UseGuards(AuthGuard('jwt'))
  @ApiOkResponse({ type: CustomerResponseDTO, isArray: true })
  @Get('/')
  async getAllCustomer(@Query() getQuery: getCustomerDTO) {
    return await this.customerService.getCustomer(getQuery);
  }
  @ApiOperation({ summary: 'Tạo Khách Hàng' })
  @UseGuards(AuthGuard('jwt'))
  @ApiOkResponse({ type: CustomerResponseDTO })
  @Post('')
  async registerCustomer(@Body() customerDTO: CustomerDTO) {
    return await this.customerService.registerCustomer(customerDTO);
  }

  @ApiOperation({ summary: 'Cập Nhật Khách Hàng' })
  @UseGuards(AuthGuard('jwt'))
  @ApiOkResponse({ type: CustomerResponseDTO })
  @Put('/:id')
  async updateTypes(@Body() customerDTO: CustomerDTO, @Param('id') id: string) {
    return await this.customerService.updateCustomer(customerDTO, id);
  }

  // @ApiOperation({ summary: 'Xóa Loài' })
  // @UseGuards(AuthGuard('jwt'))
  // @Delete('/:id')
  // async deleteTypes(@Param('id') id: string) {
  //   return await this.typesService.deleteType(id);
  // }


  @ApiOperation({ summary: 'Xóa Khách Hàng' })
  @UseGuards(AuthGuard('jwt'))
  @Delete('/:id')
  async deleteSpecie(@Param('id') id: string) {
    return await this.customerService.deleteCustomer(id);
  }

}
