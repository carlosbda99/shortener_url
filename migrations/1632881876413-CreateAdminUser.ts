import {getRepository, MigrationInterface, QueryRunner} from "typeorm";
import {User} from "../src/entities/User";

export class CreateAdminUser1632881876413 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
      const user = new User();
      user.username = "admin";
      user.password = "admin";
      user.name = "admin";
      user.email = "admin@email.com";
      user.hashPassword();
      user.role = 'admin';
      const userRepository = getRepository(User);
      await userRepository.save(user);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }

}
