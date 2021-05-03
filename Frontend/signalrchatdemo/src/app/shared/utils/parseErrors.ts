export function parseApiErrors(response: any): string[]
{

  const unexpectedError = ['Ha ocurrido un error inesperado']
  if (!response) {
    return unexpectedError
  }

    let errors: string[] = [];
    if (response.error)
    {
      if (typeof response.error === 'string') {
        errors.push(response.error);
      }
      else {
        const errorsMap = response.error.errors || response.error;
        if (!errorsMap) {
          return unexpectedError;
        }

        let entries = Object.entries(errorsMap);
        errors = entries
        .map(arr => `${arr[0]}:<br> ${(arr[1]as string[]).join(',')}`);
      }
    }
    else if (typeof response === 'string')
    {
      errors.push(response);
    }

    return errors;
}


