import { Injectable } from '@nestjs/common';
import { isChecked } from 'src/config/constant';
import {
  Column,
  Entity,
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Pet } from './pet.entity';
import { Types } from './type.entity';

@Entity()
export class Specie {
  @PrimaryGeneratedColumn()
  idx: string;

  @Column()
  id: string;

  @ManyToOne(() => Types, (type) => type.species, {
    eager: true,

  })
  type: Types;

  @OneToMany(() => Pet, (pet) => pet.specie, {
    cascade: true,
  })
  pets: Pet[];

  addPet(pet?: Pet) {
    if (this.pets == null) {
      this.pets = new Array<Pet>();
    }
    this.pets.push(pet);
  }

  @Column({ unique: true, length: 30 })
  name: string;

  @Column()
  desc: string;

  @Column({
    type: 'enum',
    enum: isChecked,
  })
  isChecked: isChecked; // 1=true, 0 false
}

@EventSubscriber()
@Injectable()
export class Specieubscriber implements EntitySubscriberInterface<Specie> {
  async afterInsert(event: InsertEvent<Specie>) {
    if (event.metadata.targetName === 'Specie') {
      const repo = event.manager.connection.getRepository(Specie);
      event.entity.id = `G${String(event.entity.idx).padStart(6, '0')}`;
      repo.save(event.entity);
    }
  }
}
