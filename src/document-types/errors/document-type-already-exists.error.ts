export class DocumentTypeAlreadyExistsError extends Error {
  constructor() {
    super('Este tipo de documento ja existe para esta escola!');
  }
}
