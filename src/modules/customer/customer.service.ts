import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { paginateResponse } from 'src/common/response';
import response, { errorResponse } from 'src/common/response/response-func';
import { Customer } from 'src/entity/customer.entity';
import { Like, Repository } from 'typeorm';
import { CustomerDTO, getCustomerDTO } from './dto/customer.dto';

@Injectable()
export class CustomerService {
  constructor(@InjectRepository(Customer) private customerRepo: Repository<Customer>) { }


  async getCustomer(getQuery?: getCustomerDTO) {
    const take = getQuery.limit || 999;
    const page = getQuery.page || 1;
    const skip = (page - 1) * take;
    const keyword = getQuery.search || '';

    const data = await this.customerRepo.findAndCount({
      where: {
        name: Like('%' + keyword.trim() + '%') || getQuery.name,
        id: getQuery.id,
      },
      order: { name: getQuery.sortBy ? 'DESC' : 'ASC' },
      take: take,
      skip: skip,
      relations: ['pets'],
    });
    return paginateResponse(data, page, take);
  }

  async registerCustomer(dto: CustomerDTO) {

    const newCustomer = await this.customerRepo.save(
      this.customerRepo.create({
        ...dto,
      }),
    );

    return response(200, newCustomer);
  }
  async updateCustomer(dto: CustomerDTO, id: string) {
    const property = await this.customerRepo.findOneBy({ id });
    const res = await this.customerRepo.save({
      ...property, // existing fields
      ...dto, // updated fields
    });
    // delete res?.passWord;
    return response(200, res);
  }

  async deleteCustomer(id: string) {
    try {
      await this.customerRepo.delete({ id });
    } catch (error) {
      if (error.errno === 1451) {
        return errorResponse('Customer related Pet is exist ');
      }
    }
    return response(200, 'Delete Successfully');
  }
}
