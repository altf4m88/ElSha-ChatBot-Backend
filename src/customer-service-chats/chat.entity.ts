import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Chat {
  @PrimaryGeneratedColumn()
  id: number;
  
  @Column()
  role: string;

  @Column()
  order: number;

  @Column()
  message: string;
}
