import { Injectable } from '@nestjs/common';
import { ESexOfHuman } from 'src/config/constant';
import {
  Column,
  Entity,
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Pet } from './pet.entity';

@Entity()
export class Customer {
  @PrimaryGeneratedColumn()
  idx: string;

  @Column()
  id: string;

  @Column({ unique: true, length: 30 })
  name: string;

  @Column({
    type: 'enum',
    enum: ESexOfHuman,
  })
  sex: ESexOfHuman;

  @Column()
  dob: Date;

  @Column()
  numberPhone: string;

  @Column()
  email: string;

  @Column()
  avatarUrl: string;

  @Column()
  IdNumber: string;

  @Column({ type: 'longtext' })
  address: string;

  @OneToMany(() => Pet, (pet) => pet.customer, {
    // cascade: true,
  })
  pets: Pet[];

  addPet(pet?: Pet) {
    if (this.pets == null) {
      this.pets = new Array<Pet>();
    }
    this.pets.push(pet);
  }
}

@EventSubscriber()
@Injectable()
export class CustomerSubscriber implements EntitySubscriberInterface<Customer> {
  async afterInsert(event: InsertEvent<Customer>) {
    if (event.metadata.targetName === 'Customer') {
      const repo = event.manager.connection.getRepository(Customer);
      event.entity.id = `KH${String(event.entity.idx).padStart(6, '0')}`;
      repo.save(event.entity);
    }
  }
}
