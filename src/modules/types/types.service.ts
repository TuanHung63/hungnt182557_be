import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import response, { errorResponse, paginateResponse } from 'src/common/response/response-func';
import { Types } from 'src/entity/type.entity';
import { Repository, Like } from 'typeorm';
import { getTypesDTO, TypesDTO } from './dto/types.dto';

@Injectable()
export class TypesService {
  constructor(@InjectRepository(Types) private typeRepo: Repository<Types>) { }

  async getType(getQuery?: getTypesDTO) {
    const take = getQuery.limit || 999;
    const page = getQuery.page || 1;
    const skip = (page - 1) * take;
    const keyword = getQuery.search || '';


    const data = await this.typeRepo.findAndCount({
      where: {
        name: Like('%' + keyword.trim() + '%') || getQuery.name,
        id: getQuery.id,
        isChecked: getQuery.isChecked,
      },
      order: { name: getQuery.sortBy ? 'DESC' : 'ASC' },
      take: take,
      skip: skip,
    });
    return paginateResponse(data, page, take);
  }

  async registerType(dto: TypesDTO) {
    const newType = await this.typeRepo.save(
      this.typeRepo.create({
        ...dto,
      }),
    );
    return response(200, newType);
  }
  async updateType(dto: TypesDTO, id: string) {
    const property = await this.typeRepo.findOneBy({ id });
    const res = await this.typeRepo.save({
      ...property, // existing fields
      ...dto, // updated fields
    });
    // delete res?.passWord;
    return response(200, res);
  }
  async deleteType(id: string) {
    // await this.typeRepo.delete({ id });
    // return response(200, '');

    try {
      await this.typeRepo.delete({ id });
    } catch (error) {
      if (error.errno === 1451) {
        return errorResponse('Type related Specie is exist');

      }


    }
    return response(200, 'Delete Successfully');

  }
}
