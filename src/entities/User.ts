import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Unique,
  CreateDateColumn,
  UpdateDateColumn, OneToMany
} from "typeorm";
import { Length, IsNotEmpty } from "class-validator";
import * as bcrypt from "bcryptjs";
import {ShortingURL} from "./ShortingURL";

@Entity()
@Unique(["username"])
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @Length(4, 20)
  username: string;

  @Column()
  @Length(3, 50)
  name: string;

  @Column()
  @Length( 0, 50)
  email: string;

  @Column()
  @Length(4, 100)
  password: string;

  @Column()
  @IsNotEmpty()
  role: string;

  @OneToMany(() => ShortingURL, urls => urls.user)
  urls: ShortingURL[];

  @Column()
  @CreateDateColumn()
  createdAt: Date;

  @Column()
  @UpdateDateColumn()
  updatedAt: Date;

  hashPassword() {
    this.password = bcrypt.hashSync(this.password, 8);
  }

  checkIfUnencryptedPasswordIsValid(unencryptedPassword: string) {
    return bcrypt.compareSync(unencryptedPassword, this.password);
  }
}
