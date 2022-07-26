import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import response, { errorResponse, paginateResponse } from 'src/common/response/response-func';
import { Specie } from 'src/entity/specie.entity';
import { Types } from 'src/entity/type.entity';
import { Repository, Like } from 'typeorm';
import { getSpeciesDTO, SpecieDTO } from './dto';

@Injectable()
export class SpecieService {
  constructor(
    @InjectRepository(Specie) private specieRepo: Repository<Specie>,
    @InjectRepository(Types) private typeRepo: Repository<Types>,
  ) { }

  async getSpecie(getSpeciesQuery: getSpeciesDTO) {
    const take = getSpeciesQuery.limit || 999;
    const page = getSpeciesQuery.page || 1;
    const skip = (page - 1) * take;
    const keyword = getSpeciesQuery.search || '';

    const data = await this.specieRepo.findAndCount({
      where: {
        name: Like('%' + keyword.trim() + '%') || getSpeciesQuery.name,
        id: getSpeciesQuery.id,
        isChecked: getSpeciesQuery.isChecked

      },
      order: { name: getSpeciesQuery.sortBy ? 'DESC' : 'ASC' },
      take: take,
      skip: skip,
    });
    return paginateResponse(data, page, take);
  }

  async createSpecie(specie: SpecieDTO) {
    const type = await this.typeRepo.findOne({
      where: { id: specie.idType },
      relations: ['species'],
    });
    delete specie.idType;
    const newSpecie = await this.specieRepo.create(specie as any);
    type.addSpecie(newSpecie as any);
    await this.typeRepo.save({ ...type });
    return response(200, newSpecie);
  }

  async updateSpecie(specie: SpecieDTO, id: string) {
    if (specie.idType) {
      const type = await this.typeRepo.findOne({
        where: { id: specie.idType },
        relations: ['species'],
      });
      const property = await this.specieRepo.findOneBy({ id });

      delete specie.idType;
      const update = await this.specieRepo.save({
        ...property,
        ...specie,
      });
      type.addSpecie(update as any);
      await this.typeRepo.save({ ...type });
      const updated = await this.specieRepo.findOneBy({ id });

      return response(200, updated);
    }
    const property = await this.specieRepo.findOneBy({ id });
    const updated = await this.specieRepo.save({
      ...property,
      ...specie,
    });
    return response(200, updated);
  }

  async deleteSpecie(id: string) {
    try {
      await this.specieRepo.delete({ id });
    } catch (error) {
      if (error.errno === 1451) {
        return errorResponse('Specie related Pet is exist');
      }
    }
    return response(200, 'Delete Successfully');
  }
}
