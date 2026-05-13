import { DataSource } from 'typeorm';
import { ItemAttributeMaster } from '../../src/modules/item-attribute-master/entity/item-attribute-master.entity';
import { ItemAttributeValue } from '../../src/modules/item-attribute-master/entity/item-attribute-value.entity';
import { PGTypeORMconfig } from '../../src/config/pgsql.config';

const seedData: Array<{
  name: string;
  status: boolean;
  is_base_attribute: boolean;
  numeric_values: boolean;
  values: Array<{
    name: string;
    attribute_type?: string;
    abbreviation?: string;
    purity_factor?: number;
  }>;
}> = [
  {
    name: 'Size',
    status: true,
    is_base_attribute: false,
    numeric_values: true,
    values: [
      { name: 'XS', abbreviation: 'XS' },
      { name: 'S', abbreviation: 'S' },
      { name: 'M', abbreviation: 'M' },
      { name: 'L', abbreviation: 'L' },
      { name: 'XL', abbreviation: 'XL' },
    ],
  },
  {
    name: 'Birthstone Count',
    status: true,
    is_base_attribute: false,
    numeric_values: true,
    values: [
      { name: '1', abbreviation: '1' },
      { name: '2', abbreviation: '2' },
      { name: '3', abbreviation: '3' },
    ],
  },
  {
    name: 'Band style',
    status: true,
    is_base_attribute: false,
    numeric_values: false,
    values: [
      { name: 'Plain', abbreviation: 'PL' },
      { name: 'Twisted', abbreviation: 'TW' },
      { name: 'Braided', abbreviation: 'BR' },
      { name: 'Milgrain', abbreviation: 'MG' },
    ],
  },
  {
    name: 'Ring Size',
    status: true,
    is_base_attribute: false,
    numeric_values: true,
    values: [
      { name: '5', abbreviation: 'R5' },
      { name: '6', abbreviation: 'R6' },
      { name: '7', abbreviation: 'R7' },
      { name: '8', abbreviation: 'R8' },
      { name: '9', abbreviation: 'R9' },
    ],
  },
  {
    name: 'Metal Color',
    status: true,
    is_base_attribute: false,
    numeric_values: false,
    values: [
      { name: 'Yellow', abbreviation: 'YL' },
      { name: 'White', abbreviation: 'WH' },
      { name: 'Rose', abbreviation: 'RS' },
      { name: 'Two Tone', abbreviation: 'TT' },
    ],
  },
  {
    name: 'Stone Family',
    status: true,
    is_base_attribute: false,
    numeric_values: false,
    values: [
      { name: 'Diamond', abbreviation: 'DI' },
      { name: 'Gemstone', abbreviation: 'GS' },
      { name: 'Pearl', abbreviation: 'PE' },
    ],
  },
  {
    name: 'Stone Dimension',
    status: true,
    is_base_attribute: false,
    numeric_values: false,
    values: [
      { name: '3x3 mm', abbreviation: '3X3' },
      { name: '4x4 mm', abbreviation: '4X4' },
      { name: '5x5 mm', abbreviation: '5X5' },
      { name: '6x4 mm', abbreviation: '6X4' },
    ],
  },
  {
    name: 'Stone',
    status: true,
    is_base_attribute: false,
    numeric_values: false,
    values: [
      { name: 'Diamond', abbreviation: 'DI' },
      { name: 'Ruby', abbreviation: 'RB' },
      { name: 'Emerald', abbreviation: 'EM' },
      { name: 'Sapphire', abbreviation: 'SP' },
    ],
  },
  {
    name: 'Shape',
    status: true,
    is_base_attribute: false,
    numeric_values: false,
    values: [
      { name: 'Round', abbreviation: 'RD' },
      { name: 'Oval', abbreviation: 'OV' },
      { name: 'Princess', abbreviation: 'PR' },
      { name: 'Cushion', abbreviation: 'CU' },
      { name: 'Pear', abbreviation: 'PE' },
    ],
  },
  {
    name: 'Metal',
    status: true,
    is_base_attribute: true,
    numeric_values: false,
    values: [
      { name: 'Gold', abbreviation: 'GL', purity_factor: 0 },
      { name: 'Silver', abbreviation: 'SL', purity_factor: 0 },
      { name: 'Platinum', abbreviation: 'PL', purity_factor: 0 },
    ],
  },
  {
    name: 'Band',
    status: true,
    is_base_attribute: false,
    numeric_values: false,
    values: [
      { name: 'Comfort Fit', abbreviation: 'CF' },
      { name: 'Flat', abbreviation: 'FL' },
      { name: 'Domed', abbreviation: 'DM' },
    ],
  },
  {
    name: 'Halo',
    status: true,
    is_base_attribute: false,
    numeric_values: false,
    values: [
      { name: 'Single', abbreviation: 'SH' },
      { name: 'Double', abbreviation: 'DH' },
      { name: 'No Halo', abbreviation: 'NH' },
    ],
  },
  {
    name: 'Purity',
    status: true,
    is_base_attribute: false,
    numeric_values: true,
    values: [
      { name: '14K', abbreviation: '14K', purity_factor: 0.585 },
      { name: '18K', abbreviation: '18K', purity_factor: 0.75 },
      { name: '22K', abbreviation: '22K', purity_factor: 0.916 },
      { name: '24K', abbreviation: '24K', purity_factor: 0.999 },
    ],
  },
];

async function seed() {
  const dataSource = new DataSource({
    ...(PGTypeORMconfig as any),
    entities: [ItemAttributeMaster, ItemAttributeValue],
  });

  await dataSource.initialize();
  const attributeRepo = dataSource.getRepository(ItemAttributeMaster);
  const valueRepo = dataSource.getRepository(ItemAttributeValue);

  for (const data of seedData) {
    const existing = await attributeRepo.findOne({
      where: { name: data.name },
    });
    if (existing) {
      console.log(`Skipping "${data.name}" — already exists`);
      continue;
    }

    const attribute = attributeRepo.create({
      name: data.name,
      status: data.status,
      is_base_attribute: data.is_base_attribute,
      numeric_values: data.numeric_values,
    });
    await attributeRepo.save(attribute);

    for (const v of data.values) {
      const value = valueRepo.create({ ...v, attribute_name: attribute.name });
      await valueRepo.save(value);
    }

    console.log(`Seeded "${data.name}" with ${data.values.length} values`);
  }

  await dataSource.destroy();
  console.log('Seeding complete.');
}

seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
