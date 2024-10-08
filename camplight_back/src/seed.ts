import { DataSource } from 'typeorm';
import { UserEntity } from './modules/users/users/entities/user.entity';
// Create a new DataSource for database connection (similar to how it's done in your app)
const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.POSTGRES_HOST,
  port: parseInt(process.env.POSTGRES_PORT, 10),
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB,
  synchronize: true,
  logging: ['query', 'error', 'schema', 'warn', 'info', 'log'],
  entities: [UserEntity],
});

async function seed() {
  await AppDataSource.initialize();

  const userRepository = AppDataSource.getRepository(UserEntity);

  const users = [
    {
      name: 'John Doe',
      email: 'john.doe@example.com',
      phone_number: '1234567890',
    },
    {
      name: 'Jane Smith',
      email: 'jane.smith@example.com',
      phone_number: '0987654321',
    },
    {
      name: 'Alice Johnson',
      email: 'alice.johnson@example.com',
      phone_number: '5555555555',
    },
    {
      name: 'Bob Williams',
      email: 'bob.williams@example.com',
      phone_number: null,
    },
    {
      name: 'Michael Brown',
      email: 'michael.brown@example.com',
      phone_number: '9876543210',
    },
    {
      name: 'Emily Davis',
      email: 'emily.davis@example.com',
      phone_number: '4444444444',
    },
    {
      name: 'David Wilson',
      email: 'david.wilson@example.com',
      phone_number: '2223334444',
    },
    {
      name: 'Sarah Moore',
      email: 'sarah.moore@example.com',
      phone_number: '3332221111',
    },
    {
      name: 'James Taylor',
      email: 'james.taylor@example.com',
      phone_number: '9998887777',
    },
    {
      name: 'Linda Anderson',
      email: 'linda.anderson@example.com',
      phone_number: '7776665555',
    },
    {
      name: 'Robert Thomas',
      email: 'robert.thomas@example.com',
      phone_number: '5556667777',
    },
    {
      name: 'Patricia Jackson',
      email: 'patricia.jackson@example.com',
      phone_number: '3334445555',
    },
    {
      name: 'Barbara White',
      email: 'barbara.white@example.com',
      phone_number: null,
    },
    {
      name: 'Charles Harris',
      email: 'charles.harris@example.com',
      phone_number: '1112223333',
    },
    {
      name: 'Susan Martin',
      email: 'susan.martin@example.com',
      phone_number: '1234561234',
    },
    {
      name: 'Jessica Thompson',
      email: 'jessica.thompson@example.com',
      phone_number: '4321567890',
    },
    {
      name: 'Paul Garcia',
      email: 'paul.garcia@example.com',
      phone_number: '5678901234',
    },
    {
      name: 'Steven Martinez',
      email: 'steven.martinez@example.com',
      phone_number: '0987654321',
    },
    {
      name: 'Laura Robinson',
      email: 'laura.robinson@example.com',
      phone_number: null,
    },
    {
      name: 'Kevin Clark',
      email: 'kevin.clark@example.com',
      phone_number: '6665554444',
    },
    {
      name: 'Nancy Rodriguez',
      email: 'nancy.rodriguez@example.com',
      phone_number: '2223334444',
    },
    {
      name: 'Daniel Lewis',
      email: 'daniel.lewis@example.com',
      phone_number: '3335556666',
    },
    {
      name: 'Sandra Walker',
      email: 'sandra.walker@example.com',
      phone_number: '7778889999',
    },
    {
      name: 'Mark Hall',
      email: 'mark.hall@example.com',
      phone_number: '9997778888',
    },
    {
      name: 'Elizabeth Allen',
      email: 'elizabeth.allen@example.com',
      phone_number: '8886667777',
    },
    {
      name: 'George Young',
      email: 'george.young@example.com',
      phone_number: '4445556666',
    },
    {
      name: 'Deborah King',
      email: 'deborah.king@example.com',
      phone_number: '6664443333',
    },
    {
      name: 'Kenneth Scott',
      email: 'kenneth.scott@example.com',
      phone_number: '1113335555',
    },
    {
      name: 'Maria Green',
      email: 'maria.green@example.com',
      phone_number: '2224446666',
    },
    {
      name: 'William Adams',
      email: 'william.adams@example.com',
      phone_number: '9998887777',
    },
    {
      name: 'Margaret Baker',
      email: 'margaret.baker@example.com',
      phone_number: '8885554444',
    },
    {
      name: 'Thomas Gonzalez',
      email: 'thomas.gonzalez@example.com',
      phone_number: null,
    },
    {
      name: 'Jennifer Nelson',
      email: 'jennifer.nelson@example.com',
      phone_number: '5553334444',
    },
    {
      name: 'Charles Carter',
      email: 'charles.carter@example.com',
      phone_number: '4443332222',
    },
    {
      name: 'Rebecca Mitchell',
      email: 'rebecca.mitchell@example.com',
      phone_number: '2223335555',
    },
  ];

  for (const user of users) {
    await userRepository.save(user);
    console.log(`Seeded user: ${user.name}`);
  }

  console.log('Seeding completed');
  await AppDataSource.destroy();
}

seed().catch((error) => {
  console.error('Error seeding the database:', error);
});
