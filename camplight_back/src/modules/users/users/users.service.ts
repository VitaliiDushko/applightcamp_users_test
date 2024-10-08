import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from './entities/user.entity';
import { plainToInstance } from 'class-transformer';
import { UserCreateDto } from './dtos/user.create.dto';
import { UserDto } from './dtos/user.dto';
import { FindUsersQuery } from './dtos/find-users.query.dto';
import { DatabaseException } from './database-exception';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
  ) {}

  private readonly logger = new Logger(UsersService.name);

  async create(createUserDto: UserCreateDto): Promise<UserEntity> {
    let user = plainToInstance(UserEntity, createUserDto);

    try {
      user = await this.userRepository.save(user);
    } catch (error) {
      throw new DatabaseException('Failed to create user', error);
    }

    user = plainToInstance(UserDto, user);
    return user;
  }

  async find(
    query: FindUsersQuery,
  ): Promise<{ data: UserDto[]; total: number }> {
    const queryBuilder = this.userRepository.createQueryBuilder('user');
    if (query.name) {
      queryBuilder.andWhere('user.name ILIKE :name', {
        name: `%${query.name}%`,
      });
    }
    if (query.email) {
      queryBuilder.andWhere('user.email ILIKE :email', {
        email: `%${query.email}%`,
      });
    }
    if (query.phone_number) {
      queryBuilder.andWhere('user.phone_number ILIKE :phone_number', {
        phone_number: `%${query.phone_number}%`,
      });
    }

    if (query.page && query.limit) {
      queryBuilder.skip((query.page - 1) * query.limit).take(query.limit);
    }

    let res;
    try {
      const [data, total] = await queryBuilder.getManyAndCount();
      res = { data: plainToInstance(UserDto, data), total };
    } catch (error) {
      error.findUsersQuery = query;
      throw new DatabaseException(
        `Error while finding users with filters and paging`,
        error,
      );
    }
    return res;
  }

  async findOne(id: string): Promise<UserEntity | undefined> {
    let user;
    try {
      user = await this.userRepository.findOne({ where: { id } });
    } catch (error) {
      throw new DatabaseException(
        `Error while finding user with filters id ${id}`,
        error,
      );
    }
    user = plainToInstance(UserDto, user);
    return user;
  }

  async update(
    id: string,
    updateUserDto: UserCreateDto,
  ): Promise<UserEntity | null> {
    let user = await this.findOne(id);

    if (!user) {
      return null;
    }

    Object.assign(user, updateUserDto);

    try {
      user = await this.userRepository.save(user);
    } catch (error) {
      error.updateUserDto = updateUserDto;
      throw new DatabaseException('Failed to update user', error);
    }

    user = plainToInstance(UserDto, user);
    return user;
  }

  async remove(id: string): Promise<boolean> {
    let result;
    try {
      result = await this.userRepository.delete(id);
    } catch (error) {
      throw new DatabaseException(`Failed to remove user with id ${id}`, error);
    }
    return result.affected > 0;
  }
}
