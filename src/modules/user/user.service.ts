import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { elementAt } from 'rxjs';
import response, { errorResponse, paginateResponse } from 'src/common/response/response-func';
import { ROLE } from 'src/config/constant';
import { Customer } from 'src/entity/customer.entity';
import { Pet } from 'src/entity/pet.entity';
import { Schedule } from 'src/entity/schedule.entity';
import { Specie } from 'src/entity/specie.entity';
import { Types } from 'src/entity/type.entity';
import { User } from 'src/entity/user.entity';
import { Like, Repository } from 'typeorm';
import { getProfileDTO, profileDTO } from './dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepo: Repository<User>,
    @InjectRepository(Customer) private customerRepo: Repository<Customer>,
    @InjectRepository(Pet) private petRepo: Repository<Pet>,
    @InjectRepository(Types) private typeRepo: Repository<Types>,
    @InjectRepository(Specie) private specieRepo: Repository<Specie>,
    @InjectRepository(Schedule) private scheduleRepo: Repository<Schedule>) { }

  async getProfile(id: string) {
    const profile = await this.userRepo.findOneBy({ id });
    delete profile.passWord;
    return response(200, profile);
  }

  async getAllUser(getQuery?: getProfileDTO) {
    const take = getQuery.limit || 999;
    const page = getQuery.page || 1;
    const skip = (page - 1) * take;
    const keyword = getQuery.search || '';

    const data = await this.userRepo.findAndCount({
      where: {
        name: Like('%' + keyword.trim() + '%') || getQuery.name,
        id: getQuery.id,
        role: getQuery.role    //doctor role    

      }
      ,
      order: { id: getQuery.sortBy ? 'DESC' : 'ASC' },
      take: take,
      skip: skip,
    });
    data[0].map((el) => {
      delete el.passWord
    })
    return paginateResponse(data, page, take);
  }


  // async updateProfile(id: string, profileData: profileDTO) {
  //   const property = await this.userRepo.findOneBy({ id });
  //   const res = await this.userRepo.save({
  //     ...property, // existing fields
  //     ...profileData, // updated fields
  //   });
  //   return response(200, res);
  // }


  async deleteUser(id: string) {
    try {
      await this.userRepo.delete({ id });
    } catch (error) {
      if (error.errno === 1451) {
        return errorResponse('User related Schedule is exist');
      }
    }
    return response(200, 'Delete Successfully');

  }





  async summaryBranch() {

    const sumCustomer = await this.customerRepo.count();
    const sumUser = await this.userRepo.count();
    const sumPet = await this.petRepo.count();
    const sumType = await this.typeRepo.count();
    const sumSpecie = await this.specieRepo.count();
    const sumSchedule = await this.scheduleRepo.count();

    const res = {
      sumCustomer,
      sumUser,
      sumPet, sumType, sumSpecie, sumSchedule
    }
    return response(200, res);

  }
}
