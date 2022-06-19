import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { paginateResponse } from 'src/common/response';
import response from 'src/common/response/response-func';
import { Customer } from 'src/entity/customer.entity';
import { Pet } from 'src/entity/pet.entity';
import { Specie } from 'src/entity/specie.entity';
import { Like, Repository } from 'typeorm';
import { getPetDTO, PetDTO } from './dto/pet.dto';

@Injectable()
export class PetService {
  constructor(@InjectRepository(Pet) private petRepo: Repository<Pet>,
    @InjectRepository(Specie) private specieRepo: Repository<Specie>,
    @InjectRepository(Customer) private customerRepo: Repository<Customer>,

  ) { }

  async getPet(getQuery?: getPetDTO) {
    const take = getQuery.limit || 999;
    const page = getQuery.page || 1;
    const skip = (page - 1) * take;
    const keyword = getQuery.search || '';

    const data = await this.petRepo.findAndCount({
      where: { name: Like('%' + keyword + '%') },
      order: { name: getQuery.sortBy ? 'DESC' : 'ASC' },
      take: take,
      skip: skip,
    });
    console.log(data);

    return paginateResponse(data, page, take);
  }
  async createPet(pet: PetDTO) {
    const specie = await this.specieRepo.findOne({
      where: { id: pet.idSpecie },
      relations: ['pets'],
    });
    const customer = await this.customerRepo.findOne({
      where: { id: pet.idCustomer },
      relations: ['pets'],
    })

    delete pet.idCustomer
    delete pet.idSpecie;
    const newPet = await this.petRepo.create(pet as any);
    specie.addPet(newPet as any);
    customer.addPet(newPet as any)

    await this.specieRepo.save({ ...specie });
    await this.customerRepo.save({ ...customer })
    return response(200, newPet);
  }


}