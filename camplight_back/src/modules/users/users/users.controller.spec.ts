import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { UserCreateDto } from './dtos/user.create.dto';
import { UserDto } from './dtos/user.dto';
import { FindUsersQuery } from './dtos/find-users.query.dto';
import { HttpException, HttpStatus } from '@nestjs/common';

describe('UsersController', () => {
  let controller: UsersController;
  let service: UsersService;

  const mockUser: UserDto = {
    id: '1',
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone_number: '1234567890',
  };

  const mockUsers = [mockUser];

  const mockUsersService = {
    create: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a user', async () => {
      const createUserDto: UserCreateDto = {
        name: 'John Doe',
        email: 'john.doe@example.com',
        phone_number: '1234567890',
      };

      mockUsersService.create.mockResolvedValue(mockUser);

      const result = await controller.create(createUserDto);
      expect(service.create).toHaveBeenCalledWith(createUserDto);
      expect(result).toEqual(mockUser);
    });
  });

  describe('find', () => {
    it('should return paginated users with valid query', async () => {
      const query: FindUsersQuery = { page: 1, limit: 10 };

      mockUsersService.find.mockResolvedValue({ data: mockUsers, total: 1 });

      const result = await controller.find(query);

      expect(service.find).toHaveBeenCalledWith(query);
      expect(result).toEqual({ data: mockUsers, total: 1 });
    });
  });

  describe('findOne', () => {
    it('should return a user by ID', async () => {
      mockUsersService.findOne.mockResolvedValue(mockUser);

      const result = await controller.findOne('1');

      expect(service.findOne).toHaveBeenCalledWith('1');
      expect(result).toEqual(mockUser);
    });

    it('should throw 404 if user not found', async () => {
      mockUsersService.findOne.mockResolvedValue(null);

      await expect(controller.findOne('1')).rejects.toThrow(
        new HttpException('User not found', HttpStatus.NOT_FOUND),
      );
    });
  });

  describe('update', () => {
    it('should update a user', async () => {
      const updateUserDto: UserCreateDto = {
        name: 'John Doe Updated',
        email: 'john.updated@example.com',
        phone_number: '9876543210',
      };

      mockUsersService.update.mockResolvedValue(mockUser);

      const result = await controller.update('1', updateUserDto);

      expect(service.update).toHaveBeenCalledWith('1', updateUserDto);
      expect(result).toEqual(mockUser);
    });

    it('should throw 404 if user not found during update', async () => {
      const updateUserDto: UserCreateDto = {
        name: 'John Doe Updated',
        email: 'john.updated@example.com',
        phone_number: '9876543210',
      };

      mockUsersService.update.mockResolvedValue(null);

      await expect(controller.update('1', updateUserDto)).rejects.toThrow(
        new HttpException('User not found', HttpStatus.NOT_FOUND),
      );
    });
  });

  describe('remove', () => {
    it('should remove a user by ID', async () => {
      mockUsersService.remove.mockResolvedValue(true);

      await controller.remove('1');

      expect(service.remove).toHaveBeenCalledWith('1');
    });

    it('should throw 404 if user not found during delete', async () => {
      mockUsersService.remove.mockResolvedValue(false);

      await expect(controller.remove('1')).rejects.toThrow(
        new HttpException('User not found', HttpStatus.NOT_FOUND),
      );
    });
  });
});
