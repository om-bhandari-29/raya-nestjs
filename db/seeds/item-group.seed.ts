import { DataSource } from 'typeorm';
import { ItemGroup } from '../../src/modules/item-group/entity/item-group.entity';
import { PGTypeORMconfig } from '../../src/config/pgsql.config';

const seedData: Array<{
  name: string;
  parent_name: string | null;
  is_group: boolean;
}> = [
  { name: 'All Item Groups', parent_name: null, is_group: true },
  { name: 'Consumable', parent_name: 'All Item Groups', is_group: false },
  { name: 'Jewelry', parent_name: 'All Item Groups', is_group: true },
  { name: 'Products', parent_name: 'All Item Groups', is_group: false },
  { name: 'Raw Material', parent_name: 'All Item Groups', is_group: false },
  { name: 'Services', parent_name: 'All Item Groups', is_group: false },
  { name: 'Sub Assemblies', parent_name: 'All Item Groups', is_group: false },
  { name: 'Anklets', parent_name: 'Jewelry', is_group: true },
  { name: 'Bangles', parent_name: 'Jewelry', is_group: true },
  { name: 'Bracelets', parent_name: 'Jewelry', is_group: true },
  { name: 'Chains', parent_name: 'Jewelry', is_group: true },
  { name: 'Charms', parent_name: 'Jewelry', is_group: true },
  { name: 'Earrings', parent_name: 'Jewelry', is_group: true },
  { name: 'Lapel Pins', parent_name: 'Jewelry', is_group: true },
  { name: 'Nose Pins', parent_name: 'Jewelry', is_group: true },
  { name: 'Pendants', parent_name: 'Jewelry', is_group: true },
  { name: 'Rings', parent_name: 'Jewelry', is_group: true },
];

async function seed() {
  const dataSource = new DataSource({
    ...(PGTypeORMconfig as any),
    entities: [ItemGroup],
  });

  await dataSource.initialize();
  const repo = dataSource.getRepository(ItemGroup);

  // Pass 1: Insert all items without parent
  for (const data of seedData) {
    const existing = await repo.findOne({ where: { name: data.name } });

    if (existing) {
      console.log(`Skipping "${data.name}" — already exists`);
      continue;
    }

    const itemGroup = repo.create({
      name: data.name,
      is_group: data.is_group,
      image: null,
      gst_hsn_code: null,
      is_active: true,
    });

    await repo.save(itemGroup);
    console.log(`Seeded "${data.name}"`);
  }

  // Pass 2: Set parent_item_group_id
  for (const data of seedData) {
    if (!data.parent_name) continue;

    const parent = await repo.findOne({ where: { name: data.parent_name } });
    if (!parent) {
      console.warn(`Parent "${data.parent_name}" not found for "${data.name}"`);
      continue;
    }

    await repo.update({ name: data.name }, { parent_item_group_id: parent.id });
  }

  await dataSource.destroy();
  console.log('Item group seeding complete.');
}

seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
