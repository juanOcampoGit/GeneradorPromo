export enum EditOption {
  KEEP = 'Mantener Original',
  STAGE = 'Amueblado Virtual',
  EMPTY = 'Vaciar Espacio',
}

export type ImageFile = {
  id: string;
  file: File;
  base64: string; // The version to be used for ad generation
  originalBase64: string;
  // Cache for edits, mapping edit option to the resulting base64 string
  editedStates: Partial<Record<Exclude<EditOption, EditOption.KEEP>, string>>;
  editOption: EditOption;
  isLoading: boolean;
  error: string | null;
};

export enum AdTone {
  WARM = 'Cálido y acogedor',
  PROFESSIONAL = 'Profesional y directo',
  ELEGANT = 'Elegante y lujoso',
  FRIENDLY = 'Amigable y cercano',
}

export enum AdLength {
  BRIEF = 'Breve (1 párrafo)',
  STANDARD = 'Estándar (2 párrafos)',
}

export type TargetAudience = 'Jóvenes profesionales' | 'Familias' | 'Inversores' | 'Estudiantes';

export type AdConfig = {
  tone: AdTone;
  length: AdLength;
  audience: TargetAudience;
};