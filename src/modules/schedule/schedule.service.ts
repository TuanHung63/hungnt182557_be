import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { paginateResponse } from 'src/common/response';
import response from 'src/common/response/response-func';
import { STATUS_SCHEDULE } from 'src/config/constant';
import { Pet } from 'src/entity/pet.entity';
import { Schedule } from 'src/entity/schedule.entity';
import { User } from 'src/entity/user.entity';
import { Like, Repository } from 'typeorm';
import { getScheduleDTO, ScheduleDTO, updateScheduleDTO } from './dto/schedule.dto';

@Injectable()
export class ScheduleService {
  constructor(
    @InjectRepository(Pet) private petRepo: Repository<Pet>,
    @InjectRepository(Schedule) private scheduleRepo: Repository<Schedule>,
    @InjectRepository(User) private userRepo: Repository<User>,


  ) { }

  async getSchedule(getScheduleQuery: getScheduleDTO) {
    const take = getScheduleQuery.limit || 999;
    const page = getScheduleQuery.page || 1;
    const skip = (page - 1) * take;
    const keyword = getScheduleQuery.search || '';

    const data = await this.scheduleRepo.findAndCount({

      where: {
        // name: Like('%' + keyword.trim() + '%') || getScheduleQuery.date,
        id: getScheduleQuery.id || Like('%' + keyword.trim() + '%'),
        // idUser: getScheduleQuery.idUser
      },
      // order: { name: getScheduleQuery.sortBy ? 'DESC' : 'ASC' },
      take: take,
      skip: skip,
    });
    data[0].map((el) => {
      if (el.user) {
        delete el.user.passWord
      }
    })

    return paginateResponse(data, page, take);
  }
  async getScheduleByIdUser(idUser: string) {
    const schedule = await this.scheduleRepo.find();
    const data = schedule.filter((el) => {
      return el.user.id === idUser
    })
    return response(200, data);
  }

  async createSchedule(schedule: ScheduleDTO) {
    const pet = await this.petRepo.findOne({
      where: { id: schedule.idPet },
      relations: ['schedules'],
    });

    const user = await this.userRepo.findOne({
      where: { id: schedule.idUser },
      relations: ['schedules'],
    });
    delete schedule.idPet;
    delete schedule.idUser;
    const newSchedule = await this.scheduleRepo.create(schedule as any);
    pet.addSchedule(newSchedule as any);
    user.addSchedule(newSchedule as any)
    await this.petRepo.save({ ...pet });
    await this.userRepo.save({ ...user });
    return response(200, newSchedule);
  }
  async updateSchedule(dto: updateScheduleDTO, id: string) {
    const property = await this.scheduleRepo.findOneBy({ id });
    const res = await this.scheduleRepo.save({
      ...property, // existing fields
      ...dto, // updated fields
    });
    // delete res?.passWord;
    return response(200, res);
  }
  async overviewStatus() {
    const active = await this.scheduleRepo.count({
      where: {
        status: STATUS_SCHEDULE.ACTIVE
      }
    })
    const cancel = await this.scheduleRepo.count({
      where: {
        status: STATUS_SCHEDULE.CANCEL
      }
    })
    const success = await this.scheduleRepo.count({
      where: {
        status: STATUS_SCHEDULE.SUCCESS
      }
    })
    const res = {
      active, success, cancel
    }
    return response(200, res);

  }


  async deleteSchedule(id: string) {
    await this.scheduleRepo.delete({ id });
    return response(200, 'Delete Successfully');
  }
}
