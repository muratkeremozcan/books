// never returns a result, always throws an error
function generateError(message: string, code: number): never {
  throw { message: message, errorCode: code};
}

generateError('An error occurred', 500); 
