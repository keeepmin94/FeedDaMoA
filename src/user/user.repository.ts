import { Repository } from "typeorm";
import { CustomRepository } from "../common/decorator/typeorm-ex.decorator";
import { User } from "./entities/user.entity";
import { RegisterUserDto } from "./dto/registerUser.dto";
import * as bcrypt from 'bcryptjs'
import { ConflictException, InternalServerErrorException } from "@nestjs/common";

@CustomRepository(User)
export class UserRepository extends Repository<User>{
    async createUser(registerUserDto: RegisterUserDto): Promise<void> {
      const {username, email, password, accepted} = registerUserDto
      
      const salt = await bcrypt.genSalt()
      const hashedPassword = await bcrypt.hash(password, salt)

      const user = this.create({
        username, 
        email, 
        password: hashedPassword, 
        accepted})

      try {
          await this.save(user)
      } catch (error) {
        if (error.code === '23505') {
          throw new ConflictException('존재하는 유저 이름입니다.')
        }
        throw new InternalServerErrorException()
    	}
  }
}