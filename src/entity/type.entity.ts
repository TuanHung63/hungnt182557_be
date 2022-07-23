import { Injectable } from '@nestjs/common';
import { isChecked } from 'src/config/constant';
import {
  Column,
  Entity,
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent,
  JoinColumn,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Specie } from './specie.entity';

@Entity()
export class Types {
  @PrimaryGeneratedColumn()
  idx: string;

  @Column()
  id: string;

  @Column({ unique: true, length: 30 })
  name: string;

  @Column()
  desc: string;

  @Column({
    type: 'enum',
    enum: isChecked,
  })
  isChecked: isChecked; // 1=true, 0 false

  @OneToMany(() => Specie, (specie) => specie.type, {
    cascade: true,
  })
  species: Specie[];

  addSpecie(specie?: Specie) {
    if (this.species == null) {
      this.species = new Array<Specie>();
    }
    this.species.push(specie);
  }
}

@EventSubscriber()
@Injectable()
export class TypeSubscriber implements EntitySubscriberInterface<Types> {
  async afterInsert(event: InsertEvent<Types>) {
    if (event.metadata.targetName === 'Types') {
      const repo = event.manager.connection.getRepository(Types);
      event.entity.id = `L${String(event.entity.idx).padStart(6, '0')}`;
      repo.save(event.entity);
    }
  }
}
