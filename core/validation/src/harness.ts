import { AskOptions, PackedLibraryData } from "@polymath-ai/types";

export type Endpoint = (args: AskOptions) => Promise<PackedLibraryData>;
export type Checker = (c: ValidationContext) => boolean;

export interface ValidationResult {
  description: string;
  success: boolean;
  exception?: Error;
}

class ValidationLogger {
  results: ValidationResult[] = [];

  exception(exception: Error) {
    const success = false;
    const description = exception.name;
    this.results.push({ description, success, exception });
  }

  log(success: boolean, description: string) {
    this.results.push({ description, success });
  }
}

interface ValidationContext {
  args: AskOptions;
  response: PackedLibraryData;
}

class ValidationCheck {
  description: string;
  handler: Checker;

  constructor(description: string, handler: Checker) {
    this.description = description;
    this.handler = handler;
  }

  run(logger: ValidationLogger, c: ValidationContext) {
    logger.log(this.handler(c), this.description);
  }
}

// A simple test-like validation harness.
export class Harness {
  endpoint: Endpoint;
  fatal = false;
  log: ValidationLogger = new ValidationLogger();

  constructor(endpoint: Endpoint) {
    this.endpoint = endpoint;
  }

  async validate(args: AskOptions, ...checks: ValidationCheck[]) {
    if (this.fatal) return;

    let response: PackedLibraryData;
    try {
      response = await this.endpoint(args);
    } catch (e) {
      this.log.exception(e as Error);
      this.fatal = true;
      return;
    }
    try {
      checks.forEach((check) => check.run(this.log, { response, args }));
    } catch (e) {
      this.log.exception(e as Error);
    }
  }
}

export const check = (description: string, checker: Checker) => {
  return new ValidationCheck(description, checker);
};
