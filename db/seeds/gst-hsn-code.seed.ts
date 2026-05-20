import { DataSource } from 'typeorm';
import { GstHsnCode } from '../../src/modules/gst-hsn-code/entity/gst-hsn-code.entity';
import { PGTypeORMconfig } from '../../src/config/pgsql.config';
import * as fs from 'fs';
import * as path from 'path';

const raw = fs.readFileSync(
  path.join(__dirname, './data/tabGST HSN Code.json'),
  'utf-8',
);

// The file contains invalid escape sequences (e.g. \" inside already-quoted strings,
// stray backslashes). Extract records safely using regex instead of JSON.parse.
const data: { hsn_code: string; description: string }[] = [];
const hsnCodeRegex = /"hsn_code"\s*:\s*"([^"]+)"/g;
const descRegex = /"description"\s*:\s*"((?:[^"\\]|\\.)*)"/g;

const hsnCodes: string[] = [];
const descriptions: string[] = [];

let m: RegExpExecArray | null;

while ((m = hsnCodeRegex.exec(raw)) !== null) {
  hsnCodes.push(m[1]);
}
while ((m = descRegex.exec(raw)) !== null) {
  descriptions.push(m[1].replace(/\\n/g, ' ').replace(/\\/g, '').trim());
}

const count = Math.min(hsnCodes.length, descriptions.length);
for (let i = 0; i < count; i++) {
  data.push({ hsn_code: hsnCodes[i], description: descriptions[i] });
}

console.log(`Loaded ${data.length} HSN code records from JSON.`);

async function seed() {
  const dataSource = new DataSource({
    ...(PGTypeORMconfig as any),
    entities: [GstHsnCode],
  });

  await dataSource.initialize();
  const repo = dataSource.getRepository(GstHsnCode);

  let inserted = 0;
  let skipped = 0;

  // Insert in batches of 500 to avoid query size limits
  const batchSize = 500;
  for (let i = 0; i < data.length; i += batchSize) {
    const batch = data.slice(i, i + batchSize).map((item) =>
      repo.create({
        hsn_code: item.hsn_code,
        description: item.description,
        is_active: true,
      }),
    );

    const result = await repo
      .createQueryBuilder()
      .insert()
      .into(GstHsnCode)
      .values(batch)
      .orIgnore() // skip duplicates if seed is run again
      .execute();

    inserted += result.identifiers.length;
    skipped += batch.length - result.identifiers.length;
  }

  await dataSource.destroy();
  console.log(
    `GST HSN code seeding complete. Inserted: ${inserted}, Skipped: ${skipped}`,
  );
}

seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
