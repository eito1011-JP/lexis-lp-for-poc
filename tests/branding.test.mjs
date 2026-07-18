import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const readProjectFile = (relativePath) =>
  readFileSync(new URL(`../${relativePath}`, import.meta.url), 'utf8');

const indexHtml = readProjectFile('index.html');
const packageJson = JSON.parse(readProjectFile('package.json'));
const dockerCompose = readProjectFile('docker-compose.yml');
const readme = readProjectFile('README.md');

function getMetaContent(html, attribute, value) {
  const tag = html.match(
    new RegExp(`<meta\\b(?=[^>]*\\b${attribute}=["']${value}["'])[^>]*>`, 'i'),
  );
  assert.ok(tag, `${attribute}="${value}" の meta タグが必要です`);

  const content = tag[0].match(/\bcontent=["']([^"']*)["']/i);
  assert.ok(content, `${attribute}="${value}" の meta タグに content が必要です`);

  return content[1];
}

test('LPの主要な表示と問い合わせ情報がTraceityブランドになる', () => {
  assert.match(indexHtml, /<title>\s*Traceity\b[^<]*<\/title>/i);
  assert.match(getMetaContent(indexHtml, 'name', 'twitter:title'), /^Traceity\b/);
  assert.match(getMetaContent(indexHtml, 'property', 'og:title'), /^Traceity\b/);

  const brandLabels = [...indexHtml.matchAll(
    /<a\b[^>]*class=["'][^"']*\bbrand\b[^"']*["'][^>]*>\s*([^<]+?)\s*<\/a>/gi,
  )].map((match) => match[1]);
  assert.deepEqual(brandLabels, ['Traceity', 'Traceity']);

  assert.match(indexHtml, /<div\s+class=["']ai-hub["']>\s*Traceity\s*<\/div>/i);
  assert.match(
    indexHtml,
    /<p\s+class=["']contact-lead["'][^>]*>[\s\S]*?Traceity を組織でどう使えるか、[\s\S]*?<\/p>/i,
  );
  assert.match(
    indexHtml,
    /<input\b(?=[^>]*\bname=["']subject["'])(?=[^>]*\bvalue=["']Traceity お問い合わせ・事前登録["'])[^>]*>/i,
  );
  assert.match(indexHtml, /<footer>[\s\S]*?<a\b[^>]*class=["']brand["'][^>]*>\s*Traceity\s*<\/a>/i);
  assert.match(indexHtml, /<div\s+class=["']foot-copy["']>\s*© 2026 Traceity\s*<\/div>/i);
});

test('index.htmlにはURL以外に旧ブランド名が残らない', () => {
  const htmlWithoutUrls = indexHtml.replace(/https?:\/\/[^\s"'<>]+/gi, '');

  assert.doesNotMatch(htmlWithoutUrls, /lexis|レクシス/i);
});

test('package metadataがTraceityブランドになる', () => {
  assert.equal(packageJson.name, 'traceity-lp');
  assert.equal(packageJson.description, 'Traceity Landing Page with Hot Reload');
  assert.doesNotMatch(`${packageJson.name}\n${packageJson.description}`, /lexis|レクシス/i);
});

test('Dockerコンテナ名がTraceityブランドになる', () => {
  const containerNames = [...dockerCompose.matchAll(/^\s*container_name:\s*([^\s#]+)\s*$/gm)]
    .map((match) => match[1]);

  assert.deepEqual(containerNames, ['traceity-lp-web', 'traceity-lp-dev']);
  assert.doesNotMatch(dockerCompose, /lexis|レクシス/i);
});

test('READMEがTraceityブランドになる', () => {
  assert.match(readme, /^# Traceity - ランディングページ$/m);
  assert.match(readme, /^traceity-lp\/$/m);
  assert.match(readme, /© 2024 Traceity\. All rights reserved\./);
  assert.doesNotMatch(readme, /lexis|レクシス/i);
});

test('OGP画像は現行ヒーローのキャプチャを参照する', () => {
  const ogImage = getMetaContent(indexHtml, 'property', 'og:image');

  assert.match(ogImage, /(?:^|\/)assets\/newogp\.png(?:[?#].*)?$/);
});
