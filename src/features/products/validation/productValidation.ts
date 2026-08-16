export type ProductFormInput = {
  name: string;
  startDate: string;
  endDate: string;
  notes: string;
};

const MAX_NOTES_LENGTH = 1000;

export function validateProductDraft(input: ProductFormInput, messageLookup: {
  productNameCannotBeEmpty: string;
  fillRequiredFields: string;
  endDateMustBeAfterStartDate: string;
  notesTooLong: (max: number) => string;
}): string | null {
  if (!input.name.trim()) {
    return messageLookup.productNameCannotBeEmpty;
  }

  if (!input.startDate || !input.endDate) {
    return messageLookup.fillRequiredFields;
  }

  if (input.endDate <= input.startDate) {
    return messageLookup.endDateMustBeAfterStartDate;
  }

  if (input.notes.length > MAX_NOTES_LENGTH) {
    return messageLookup.notesTooLong(MAX_NOTES_LENGTH);
  }

  return null;
}
