import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Unique,
  CreateDateColumn,
  UpdateDateColumn, ManyToOne
} from "typeorm";
import { Length, IsNotEmpty } from "class-validator";
import crc32 from "crc-32";
import {User} from "./User";

@Entity()
@Unique(["urlShortened"])
export class ShortingURL {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, user => user.urls)
  user: User;

  @Column()
  @Length(10, 100)
  url: string;

  @Column()
  @Length(128, 128)
  urlShortened: string;

  @Column({
    default: 0
  })
  visits: number;

  @Column()
  @CreateDateColumn()
  createdAt: Date;

  @Column()
  @UpdateDateColumn()
  updatedAt: Date;

  shortenUrl() {
    this.urlShortened = crc32.str(this.url + Date.now().toString()).toString();
  }
}
