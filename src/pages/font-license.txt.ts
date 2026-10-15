import { readFile } from 'node:fs/promises';

export async function GET() {
  const license = await readFile(new URL(import.meta.resolve('@fontsource-variable/golos-text/LICENSE')), 'utf8');
  return new Response(license, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
}
