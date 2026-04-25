import { DataSource } from 'typeorm';
import { ItemAttributeMaster } from '../../src/modules/item-attribute-master/entity/item-attribute-master.entity';
import { ItemAttributeValue } from '../../src/modules/item-attribute-master/entity/item-attribute-value.entity';
import { PGTypeORMconfig } from '../../src/config/pgsql.config';

const seedData: Array<{
  attribute_name: string;
  status: boolean;
  is_base_attribute: boolean;
  numeric_values: boolean;
  values: Array<{
    attribute_value: string;
    attribute_type?: string;
    abbreviation?: string;
    purity_factor?: number;
  }>;
}> = [
  {
    attribute_name: 'Size',
    status: true,
    is_base_attribute: false,
    numeric_values: true,
    values: [
      { attribute_value: 'XS', abbreviation: 'XS' },
      { attribute_value: 'S', abbreviation: 'S' },
      { attribute_value: 'M', abbreviation: 'M' },
      { attribute_value: 'L', abbreviation: 'L' },
      { attribute_value: 'XL', abbreviation: 'XL' },
    ],
  },
  {
    attribute_name: 'Birthstone Count',
    status: true,
    is_base_attribute: false,
    numeric_values: true,
    values: [
      { attribute_value: '1', abbreviation: '1' },
      { attribute_value: '2', abbreviation: '2' },
      { attribute_value: '3', abbreviation: '3' },
    ],
  },
  {
    attribute_name: 'Band style',
    status: true,
    is_base_attribute: false,
    numeric_values: false,
    values: [
      { attribute_value: 'Plain', abbreviation: 'PL' },
      { attribute_value: 'Twisted', abbreviation: 'TW' },
      { attribute_value: 'Braided', abbreviation: 'BR' },
      { attribute_value: 'Milgrain', abbreviation: 'MG' },
    ],
  },
  {
    attribute_name: 'Ring Size',
    status: true,
    is_base_attribute: false,
    numeric_values: true,
    values: [
      { attribute_value: '5', abbreviation: 'R5' },
      { attribute_value: '6', abbreviation: 'R6' },
      { attribute_value: '7', abbreviation: 'R7' },
      { attribute_value: '8', abbreviation: 'R8' },
      { attribute_value: '9', abbreviation: 'R9' },
    ],
  },
  {
    attribute_name: 'Metal Color',
    status: true,
    is_base_attribute: false,
    numeric_values: false,
    values: [
      { attribute_value: 'Yellow', abbreviation: 'YL' },
      { attribute_value: 'White', abbreviation: 'WH' },
      { attribute_value: 'Rose', abbreviation: 'RS' },
      { attribute_value: 'Two Tone', abbreviation: 'TT' },
    ],
  },
  {
    attribute_name: 'Stone Family',
    status: true,
    is_base_attribute: false,
    numeric_values: false,
    values: [
      { attribute_value: 'Diamond', abbreviation: 'DI' },
      { attribute_value: 'Gemstone', abbreviation: 'GS' },
      { attribute_value: 'Pearl', abbreviation: 'PE' },
    ],
  },
  {
    attribute_name: 'Stone Dimension',
    status: true,
    is_base_attribute: false,
    numeric_values: false,
    values: [
      { attribute_value: '3x3 mm', abbreviation: '3X3' },
      { attribute_value: '4x4 mm', abbreviation: '4X4' },
      { attribute_value: '5x5 mm', abbreviation: '5X5' },
      { attribute_value: '6x4 mm', abbreviation: '6X4' },
    ],
  },
  {
    attribute_name: 'Stone',
    status: true,
    is_base_attribute: false,
    numeric_values: false,
    values: [
      { attribute_value: 'Diamond', abbreviation: 'DI' },
      { attribute_value: 'Ruby', abbreviation: 'RB' },
      { attribute_value: 'Emerald', abbreviation: 'EM' },
      { attribute_value: 'Sapphire', abbreviation: 'SP' },
    ],
  },
  {
    attribute_name: 'Shape',
    status: true,
    is_base_attribute: false,
    numeric_values: false,
    values: [
      { attribute_value: 'Round', abbreviation: 'RD' },
      { attribute_value: 'Oval', abbreviation: 'OV' },
      { attribute_value: 'Princess', abbreviation: 'PR' },
      { attribute_value: 'Cushion', abbreviation: 'CU' },
      { attribute_value: 'Pear', abbreviation: 'PE' },
    ],
  },
  {
    attribute_name: 'Metal',
    status: true,
    is_base_attribute: true,
    numeric_values: false,
    values: [
      { attribute_value: 'Gold', abbreviation: 'GL', purity_factor: 0 },
      { attribute_value: 'Silver', abbreviation: 'SL', purity_factor: 0 },
      { attribute_value: 'Platinum', abbreviation: 'PL', purity_factor: 0 },
    ],
  },
  {
    attribute_name: 'Band',
    status: true,
    is_base_attribute: false,
    numeric_values: false,
    values: [
      { attribute_value: 'Comfort Fit', abbreviation: 'CF' },
      { attribute_value: 'Flat', abbreviation: 'FL' },
      { attribute_value: 'Domed', abbreviation: 'DM' },
    ],
  },
  {
    attribute_name: 'Halo',
    status: true,
    is_base_attribute: false,
    numeric_values: false,
    values: [
      { attribute_value: 'Single', abbreviation: 'SH' },
      { attribute_value: 'Double', abbreviation: 'DH' },
      { attribute_value: 'No Halo', abbreviation: 'NH' },
    ],
  },
  {
    attribute_name: 'Purity',
    status: true,
    is_base_attribute: false,
    numeric_values: true,
    values: [
      { attribute_value: '14K', abbreviation: '14K', purity_factor: 0.585 },
      { attribute_value: '18K', abbreviation: '18K', purity_factor: 0.750 },
      { attribute_value: '22K', abbreviation: '22K', purity_factor: 0.916 },
      { attribute_value: '24K', abbreviation: '24K', purity_factor: 0.999 },
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
      where: { attribute_name: data.attribute_name },
    });
    if (existing) {
      console.log(`Skipping "${data.attribute_name}" — already exists`);
      continue;
    }

    const attribute = attributeRepo.create({
      attribute_name: data.attribute_name,
      status: data.status,
      is_base_attribute: data.is_base_attribute,
      numeric_values: data.numeric_values,
    });
    await attributeRepo.save(attribute);

    for (const v of data.values) {
      const value = valueRepo.create({ ...v, attribute_id: attribute.id });
      await valueRepo.save(value);
    }

    console.log(`Seeded "${data.attribute_name}" with ${data.values.length} values`);
  }

  await dataSource.destroy();
  console.log('Seeding complete.');
}

seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
