import { SetMetadata } from '@nestjs/common';

export interface AuditOptions {
  action: string;
  entity: string;
}

export const AUDIT_METADATA_KEY = 'audit';

export const Audit = (options: AuditOptions) =>
  SetMetadata(AUDIT_METADATA_KEY, options);
