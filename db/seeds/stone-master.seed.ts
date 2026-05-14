import { DataSource } from 'typeorm';
import { StoneType } from '../../src/modules/stone-master/entity/stone-type.entity';
import { StoneClarity } from '../../src/modules/stone-master/entity/stone-clarity.entity';
import { StoneShape } from '../../src/modules/stone-master/entity/stone-shape.entity';
import { PGTypeORMconfig } from '../../src/config/pgsql.config';

const types = [
  'Mossonite',
  'Natural Diamond',
  'Lab-Grown Diamond',
  'Natural Stone',
  'Lab-Grown Stone',
];

const clarities = ['VVS', 'VS', 'I', 'I3', 'I1', 'I2', 'VVS-VS'];

const shapes = ['Round', 'Oval', 'Emerald', 'Tapper', 'Pear'];

async function seed() {
  const dataSource = new DataSource({
    ...(PGTypeORMconfig as any),
    entities: [StoneType, StoneClarity, StoneShape],
  });

  await dataSource.initialize();

  const typeRepo = dataSource.getRepository(StoneType);
  const clarityRepo = dataSource.getRepository(StoneClarity);
  const shapeRepo = dataSource.getRepository(StoneShape);

  for (const name of types) {
    const exists = await typeRepo.findOne({ where: { name } });
    if (exists) { console.log(`Skipping type "${name}" — already exists`); continue; }
    await typeRepo.save(typeRepo.create({ name, is_published: true }));
    console.log(`Seeded type: ${name}`);
  }

  for (const name of clarities) {
    const exists = await clarityRepo.findOne({ where: { name } });
    if (exists) { console.log(`Skipping clarity "${name}" — already exists`); continue; }
    await clarityRepo.save(clarityRepo.create({ name, is_published: true }));
    console.log(`Seeded clarity: ${name}`);
  }

  for (const name of shapes) {
    const exists = await shapeRepo.findOne({ where: { name } });
    if (exists) { console.log(`Skipping shape "${name}" — already exists`); continue; }
    await shapeRepo.save(shapeRepo.create({ name, is_published: true }));
    console.log(`Seeded shape: ${name}`);
  }

  await dataSource.destroy();
  console.log('Stone master seeding complete.');
}

seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
