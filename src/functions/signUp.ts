import sendResponse from "../utils/sendResponse";
import { createUser } from "../middleware/provider/createUser";
import { confirmUser } from "../middleware/provider/confirmUser";
import { validateCPF } from "../utils/validateCPF";
import { authenticateCognitoUser } from "../middleware/provider/authenticateUser";

async function signUpUser (event: any) {
  const { cpf } = JSON.parse(event.body);
  if (!validateCPF(cpf)) {
    return sendResponse(400, 'CPF inválido');
  }

  try {
    await confirmUser(cpf);
    const result = await authenticateCognitoUser(cpf);
    return sendResponse(200, result);
  } catch (error: any) {
    if (error instanceof Error && error.name === "UserNotFoundException") {
      await createUser(cpf);
      const result = await authenticateCognitoUser(cpf);
      return sendResponse(200, result);
    } else {
      throw new Error(error);
    }
  }
}

export { signUpUser };
