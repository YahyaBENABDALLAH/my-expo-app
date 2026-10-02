export type ProblemDetails = {
  type?: string;
  title?: string;
  status: number;
  detail?: string;
  instance?: string;
  code: string;
  traceId?: string;
};

export type ValidationProblemDetails = ProblemDetails & {
  errors: Record<string, string[]>;
};
