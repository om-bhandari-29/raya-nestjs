import { DataSource } from 'typeorm';
import { ItemGroup } from '../../src/modules/item-group/entity/item-group.entity';
import { PGTypeORMconfig } from '../../src/config/pgsql.config';

// Order matters: parents must be inserted before their children
const seedData: Array<{
  name_frappe_based_id: string;
  parent_item_group: string | null;
  is_group: boolean;
}> = [
  // Root
  {
    name_frappe_based_id: 'All Item Groups',
    parent_item_group: null,
    is_group: true,
  },
  // Children of All Item Groups
  {
    name_frappe_based_id: 'Consumable',
    parent_item_group: 'All Item Groups',
    is_group: false,
  },
  {
    name_frappe_based_id: 'Jewelry',
    parent_item_group: 'All Item Groups',
    is_group: true,
  },
  {
    name_frappe_based_id: 'Products',
    parent_item_group: 'All Item Groups',
    is_group: false,
  },
  {
    name_frappe_based_id: 'Raw Material',
    parent_item_group: 'All Item Groups',
    is_group: false,
  },
  {
    name_frappe_based_id: 'Services',
    parent_item_group: 'All Item Groups',
    is_group: false,
  },
  {
    name_frappe_based_id: 'Sub Assemblies',
    parent_item_group: 'All Item Groups',
    is_group: false,
  },
  // Children of Jewelry
  {
    name_frappe_based_id: 'Anklets',
    parent_item_group: 'Jewelry',
    is_group: true,
  },
  {
    name_frappe_based_id: 'Bangles',
    parent_item_group: 'Jewelry',
    is_group: true,
  },
  {
    name_frappe_based_id: 'Bracelets',
    parent_item_group: 'Jewelry',
    is_group: true,
  },
  {
    name_frappe_based_id: 'Chains',
    parent_item_group: 'Jewelry',
    is_group: true,
  },
  {
    name_frappe_based_id: 'Charms',
    parent_item_group: 'Jewelry',
    is_group: true,
  },
  {
    name_frappe_based_id: 'Earrings',
    parent_item_group: 'Jewelry',
    is_group: true,
  },
  {
    name_frappe_based_id: 'Lapel Pins',
    parent_item_group: 'Jewelry',
    is_group: true,
  },
  {
    name_frappe_based_id: 'Nose Pins',
    parent_item_group: 'Jewelry',
    is_group: true,
  },
  {
    name_frappe_based_id: 'Pendants',
    parent_item_group: 'Jewelry',
    is_group: true,
  },
  {
    name_frappe_based_id: 'Rings',
    parent_item_group: 'Jewelry',
    is_group: true,
  },
];

async function seed() {
  const dataSource = new DataSource({
    ...(PGTypeORMconfig as any),
    entities: [ItemGroup],
  });

  await dataSource.initialize();
  const repo = dataSource.getRepository(ItemGroup);

  for (const data of seedData) {
    const existing = await repo.findOne({
      where: { name_frappe_based_id: data.name_frappe_based_id },
    });

    if (existing) {
      console.log(`Skipping "${data.name_frappe_based_id}" — already exists`);
      continue;
    }

    const itemGroup = repo.create({
      name_frappe_based_id: data.name_frappe_based_id,
      parent_item_group: data.parent_item_group,
      is_group: data.is_group,
      image: null,
      gst_hsn_code: null,
      is_active: true,
    });

    await repo.save(itemGroup);
    console.log(`Seeded "${data.name_frappe_based_id}"`);
  }

  await dataSource.destroy();
  console.log('Item group seeding complete.');
}

seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
