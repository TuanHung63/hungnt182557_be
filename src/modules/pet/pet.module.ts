import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Customer } from 'src/entity/customer.entity';
import { Pet } from 'src/entity/pet.entity';
import { Specie } from 'src/entity/specie.entity';
import { User } from 'src/entity/user.entity';
import { PetController } from './pet.controller';
import { PetService } from './pet.service';

@Module({
  imports: [TypeOrmModule.forFeature([Pet, Specie, Customer, User])],
  controllers: [PetController],
  providers: [PetService]
})
export class PetModule { }
