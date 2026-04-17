export const hasMessage = (e: unknown): e is { message: string } =>
  typeof e === 'object' &&
  e !== null &&
  'message' in e &&
  typeof (e as { message?: unknown }).message === 'string';
