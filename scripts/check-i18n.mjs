import { readFile, writeFile } from 'node:fs/promises';
import { collectSchema, compareSchemas, sortObject } from './i18n-utils.mjs';

const localeFiles = ['en', 'vi'].map((locale) => ({
  locale,
  path: new URL(`../src/locales/${locale}.json`, import.meta.url),
}));
const shouldFix = process.argv.includes('--fix');

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
