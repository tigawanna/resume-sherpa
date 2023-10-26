import { ZodError } from "zod";

export const prismaErrorMessages = {
  P2002: "Unique constraint failed.",
  P2003: "Field value is required.",
  P2004: "Record not found.",
  P2005: "Invalid input value for field.",
  P2006: "Invalid relation filter.",
  P2007: "Invalid `orderBy` argument.",
  P2008: "Cannot perform an action on a record that doesn't exist.",
  P2009: "Invalid `where` filter.",
  P2010: "Invalid `include` argument.",
} as const;

export function mapZodIssueToField(error: ZodError, field: string) {
  return error.issues.find((issue) => issue?.path[0] === field)?.message;
}

export function extractFieldFromPrismaErrorMessage(
  message: string
): string | null {
  const regex = /\(`([^`]+)`\)/;
  const match = message.match(regex);
  if (match && match.length > 1) {
    return match[1];
  }
  return null;
}

export function mapPrismaIssueToField(error: any, field: string) {
  if (error?.meta?.target && error?.meta?.target?.includes(field)) {
    return `${
      prismaErrorMessages[error.code as keyof typeof prismaErrorMessages]
    }`;
  }
}



export function generatePrismaErrorFields(input:Record<string, any>,error:any) {
  if(input){
  const input_list = Object.keys(input);
  return input_list.reduce((acc:Record<string,any>,curr:string) => {
  if (input[curr]) {
    acc[curr] = mapPrismaIssueToField(error,curr);
  }
  return acc;
},{})}
}
