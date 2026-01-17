export const SOFT_DELETE_MODELS = [
  'School',
  'User',
  // adiciona aqui apenas quem tem deletedAt
] as const;

type SoftDeleteModel = (typeof SOFT_DELETE_MODELS)[number];

export function supportsSoftDelete(model?: string): model is SoftDeleteModel {
  return !!model && SOFT_DELETE_MODELS.includes(model as SoftDeleteModel);
}
