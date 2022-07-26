import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { paginateResponse } from 'src/common/response';
import response, { errorResponse } from 'src/common/response/response-func';
import { Customer } from 'src/entity/customer.entity';
import { Pet } from 'src/entity/pet.entity';
import { Specie } from 'src/entity/specie.entity';
import { User } from 'src/entity/user.entity';
import { Like, Repository } from 'typeorm';
import { getPetDTO, PetDTO } from './dto/pet.dto';

@Injectable()
export class PetService {
  constructor(@InjectRepository(Pet) private petRepo: Repository<Pet>,
    @InjectRepository(Specie) private specieRepo: Repository<Specie>,
    @InjectRepository(Customer) private customerRepo: Repository<Customer>,
    @InjectRepository(User) private userRepo: Repository<User>,


  ) { }

  async getPet(getQuery?: getPetDTO) {
    const take = getQuery.limit || 999;
    const page = getQuery.page || 1;
    const skip = (page - 1) * take;
    const keyword = getQuery.search || '';

    const data = await this.petRepo.findAndCount({
      where: {
        name: Like('%' + keyword.trim() + '%') || getQuery.name,
        id: getQuery.id,
      },
      order: { name: getQuery.sortBy ? 'DESC' : 'ASC' },
      take: take,
      skip: skip,
    });
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
  async updatePet(pet: PetDTO, id: string) {
    if (pet.idSpecie || pet.idCustomer) {
      const specie = await this.specieRepo.findOne({
        where: { id: pet.idSpecie },
        relations: ['pets'],
      });
      const customer = await this.customerRepo.findOne({
        where: { id: pet.idCustomer },
        relations: ['pets'],
      });
      const property = await this.petRepo.findOneBy({ id });
      delete pet.idSpecie;
      delete pet.idCustomer;


      const update = await this.petRepo.save({
        ...property,
        ...pet,
      });

      // .addSpecie(update as any);
      specie.addPet(update as any)
      customer.addPet(update as any)

      await this.specieRepo.save({ ...specie });
      await this.customerRepo.save({ ...customer })
      const updated = await this.petRepo.findOneBy({ id });
      return response(200, updated);
    }
    const property = await this.petRepo.findOneBy({ id });
    const updated = await this.petRepo.save({
      ...property,
      ...pet,
    });
    return response(200, updated);
  }

  async deletePet(id: string) {
    // const user = this.userRepo.find({})
    try {
      await this.petRepo.delete({ id });


    } catch (error) {
      if (error.errno === 1451) {
        return errorResponse('Pet is exist in schedule');
      }
    }
    return response(200, 'Delete Successfully');
  }


}
