import { readFile, writeFile } from 'node:fs/promises';

const localeFiles = ['en', 'vi'].map((locale) => ({
  locale,
  path: new URL(`../src/locales/${locale}.json`, import.meta.url),
}));
const shouldFix = process.argv.includes('--fix');

function sortObject(value) {
  if (Array.isArray(value)) return value.map(sortObject);
  if (value && typeof value === 'object') {
    return Object.fromEntries(Object.entries(value)
      .sort(([left], [right]) => left.localeCompare(right, 'en'))
      .map(([key, child]) => [key, sortObject(child)]));
  }
  return value;
}

function collectSchema(value, path = '', schema = new Map()) {
  const type = Array.isArray(value) ? 'array' : typeof value;
  if (path) schema.set(path, type);
  if (type === 'object' && value !== null) {
    for (const [key, child] of Object.entries(value)) {
      collectSchema(child, path ? `${path}.${key}` : key, schema);
    }
  }
  return schema;
}

function compareSchemas(reference, candidate, referenceLocale, candidateLocale) {
  const errors = [];
  for (const [key, type] of reference) {
    if (!candidate.has(key)) errors.push(`${candidateLocale}.json thiếu key: ${key}`);
    else if (candidate.get(key) !== type) errors.push(`${candidateLocale}.json có sai kiểu tại ${key} (cần ${type})`);
  }
  for (const key of candidate.keys()) {
    if (!reference.has(key)) errors.push(`${candidateLocale}.json có key thừa so với ${referenceLocale}.json: ${key}`);
  }
  return errors;
}

const translations = {};
const errors = [];

for (const file of localeFiles) {
  const raw = await readFile(file.path, 'utf8');
  try {
    translations[file.locale] = JSON.parse(raw);
  } catch (error) {
    errors.push(`${file.locale}.json không phải JSON hợp lệ: ${error.message}`);
    continue;
  }

  const formatted = `${JSON.stringify(sortObject(translations[file.locale]), null, 2)}\n`;
  if (shouldFix) {
    await writeFile(file.path, formatted);
    console.log(`Đã sắp xếp ${file.locale}.json.`);
  } else if (raw !== formatted) {
    errors.push(`${file.locale}.json chưa được sắp xếp A → Z. Chạy: npm run i18n:sort`);
  }
}

if (!errors.length && translations.en && translations.vi) {
  errors.push(...compareSchemas(collectSchema(translations.en), collectSchema(translations.vi), 'en', 'vi'));
  errors.push(...compareSchemas(collectSchema(translations.vi), collectSchema(translations.en), 'vi', 'en'));
}

if (errors.length) {
  console.error('\nI18n validation failed:');
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log('I18n validation passed: en.json và vi.json có cùng field và đúng thứ tự A → Z.');
