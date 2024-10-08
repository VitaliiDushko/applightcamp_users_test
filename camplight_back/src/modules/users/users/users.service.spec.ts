import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from './entities/user.entity';
import { UserCreateDto } from './dtos/user.create.dto';
import { UserDto } from './dtos/user.dto';
import { plainToInstance } from 'class-transformer';
import { FindUsersQuery } from './dtos/find-users.query.dto';
import { DatabaseException } from './database-exception';

describe('UsersService', () => {
  let service: UsersService;
  let repository: Repository<UserEntity>;

  const mockUserRepository = {
    save: jest.fn(),
    findOne: jest.fn(),
    delete: jest.fn(),
    createQueryBuilder: jest.fn(() => ({
      andWhere: jest.fn().mockReturnThis(),
      skip: jest.fn().mockReturnThis(),
      take: jest.fn().mockReturnThis(),
      getManyAndCount: jest.fn(),
    })),
  };

  const mockUser = {
    id: '1',
    name: 'John Doe',
    email: 'johndoe@example.com',
    phone_number: '1234567890',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(UserEntity),
          useValue: mockUserRepository,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    repository = module.get<Repository<UserEntity>>(
      getRepositoryToken(UserEntity),
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new user', async () => {
      const createUserDto: UserCreateDto = {
        name: 'John Doe',
        email: 'johndoe@example.com',
        phone_number: '1234567890',
      };
      mockUserRepository.save.mockResolvedValue(mockUser);

      const result = await service.create(createUserDto);

      expect(repository.save).toHaveBeenCalledWith(expect.any(UserEntity));
      expect(result).toEqual(plainToInstance(UserDto, mockUser));
    });

    it('should throw a DatabaseExceptionFilter on save failure', async () => {
      const createUserDto: UserCreateDto = {
        name: 'John Doe',
        email: 'johndoe@example.com',
        phone_number: '1234567890',
      };
      const error = new Error('Database error');
      mockUserRepository.save.mockRejectedValue(error);

      await expect(service.create(createUserDto)).rejects.toThrow(
        DatabaseException,
      );
    });
  });

  describe('find', () => {
    it('should return paginated users with filters', async () => {
      const filters: FindUsersQuery = { name: 'John Doe' };
      const mockData = [mockUser];
      const mockTotal = 1;
      mockUserRepository
        .createQueryBuilder()
        .getManyAndCount.mockResolvedValue([mockData, mockTotal]);

      const result = await service.find(filters);

      expect(result).toEqual({
        data: plainToInstance(UserDto, mockData),
        total: mockTotal,
      });
      expect(mockUserRepository.createQueryBuilder).toHaveBeenCalled();
    });

    it('should throw a DatabaseExceptionFilter on query failure', async () => {
      const filters: FindUsersQuery = { name: 'John Doe' };
      const error = new Error('Database error');
      mockUserRepository
        .createQueryBuilder()
        .getManyAndCount.mockRejectedValue(error);

      await expect(service.find(filters)).rejects.toThrow(DatabaseException);
    });
  });

  describe('findOne', () => {
    it('should return a user by ID', async () => {
      mockUserRepository.findOne.mockResolvedValue(mockUser);

      const result = await service.findOne('1');

      expect(repository.findOne).toHaveBeenCalledWith({ where: { id: '1' } });
      expect(result).toEqual(plainToInstance(UserDto, mockUser));
    });

    it('should throw a DatabaseExceptionFilter on find failure', async () => {
      const error = new Error('Database error');
      mockUserRepository.findOne.mockRejectedValue(error);

      await expect(service.findOne('1')).rejects.toThrow(DatabaseException);
    });
  });

  describe('update', () => {
    it('should update a user', async () => {
      const updateUserDto: UserCreateDto = {
        name: 'John Doe Updated',
        email: 'johnupdated@example.com',
        phone_number: '9876543210',
      };
      mockUserRepository.findOne.mockResolvedValue(mockUser);
      mockUserRepository.save.mockResolvedValue({
        ...mockUser,
        ...updateUserDto,
      });

      const result = await service.update('1', updateUserDto);

      expect(repository.save).toHaveBeenCalled();
      expect(result).toEqual(
        plainToInstance(UserDto, { ...mockUser, ...updateUserDto }),
      );
    });

    it('should throw a DatabaseExceptionFilter on save failure', async () => {
      const updateUserDto: UserCreateDto = {
        name: 'John Doe Updated',
        email: 'johnupdated@example.com',
        phone_number: '9876543210',
      };
      const error = new Error('Database error');
      mockUserRepository.findOne.mockResolvedValue(mockUser);
      mockUserRepository.save.mockRejectedValue(error);

      await expect(service.update('1', updateUserDto)).rejects.toThrow(
        DatabaseException,
      );
    });
  });

  describe('remove', () => {
    it('should remove a user by ID', async () => {
      mockUserRepository.delete.mockResolvedValue({ affected: 1 });

      const result = await service.remove('1');

      expect(repository.delete).toHaveBeenCalledWith('1');
      expect(result).toBe(true);
    });

    it('should throw a DatabaseExceptionFilter on delete failure', async () => {
      const error = new Error('Database error');
      mockUserRepository.delete.mockRejectedValue(error);

      await expect(service.remove('1')).rejects.toThrow(DatabaseException);
    });
  });
});
