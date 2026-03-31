import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  PrimaryColumn,
} from 'typeorm';

@Entity({name: 'users'}) 
export class User {
    @PrimaryGeneratedColumn()
    id: number;
    
    @Column({length: 50})
    username: string;

    @Column()
    email: string;


    @Column()
  password_hash: string;

  @Column()
  status: string;

  @Column()
  email_verified: boolean;

  @Column()
  created_at: Date;

  @Column()
  updated_at: Date;


}