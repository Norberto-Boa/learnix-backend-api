import { Prisma } from '@/generated/prisma/client';
import { supportsSoftDelete } from './soft-delete.config';

export function softDeleteExtension() {
  return Prisma.defineExtension({
    name: `softDelete`,
    query: {
      // intercepta todas as operações de query
      $allOperations({ args, query, model }) {
        // só aplica nos models que suportam soft delete
        if (!supportsSoftDelete(model)) return query(args);

        const { operation } = args;

        // Aplica somente nas operações de leitura
        if (
          operation === 'findMany' ||
          operation === 'findFirst' ||
          operation === 'findUnique' ||
          operation === 'count'
        ) {
          args.args = {
            ...args.args,
            where: { AND: [args.args?.where ?? {}, { deletedAt: null }] },
          };
        }

        // Aplica soft delete nas operações de delete
        if (operation === 'delete') {
          return query({ ...args.args, data: { deletedAt: new Date() } });
        }

        if (operation === 'deleteMany') {
          return query({ ...args.args, data: { deletedAt: new Date() } });
        }

        // Todas as outras operações passam sem alterações
        return query(args.args);
      },
    },
  });
}
