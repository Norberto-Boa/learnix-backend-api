import type { SchoolsRepository } from '@/schools/schools.repositories';
import { nameToSlug } from './name-to-slug';

export async function generateUniqueSlug(
  slug: string,
  repository: SchoolsRepository,
): Promise<string> {
  const baseSlug = nameToSlug(slug);
  let uniqueSlug = baseSlug;
  let count = 1;

  while (await repository.findBySlug(slug)) {
    slug = `${baseSlug}-${count}`;
    count++;
  }

  return uniqueSlug;
}
