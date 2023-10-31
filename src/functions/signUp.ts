import sendResponse from "../utils/sendResponse";
import { createToken } from "../middleware/auth/createToken";
import { createUser } from "../middleware/provider/createUser";
import { confirmUser } from "../middleware/provider/confirmUser";
import { validateCPF } from "../utils/validateCPF";

async function signUpUser (event: any) {
  const { cpf } = JSON.parse(event.body);
  if (!validateCPF(cpf)) {
    throw new Error('CPF inválido');
  }
  try {
    await confirmUser(cpf);
    const token = createToken(cpf);
    return sendResponse(200, token);
  } catch (error: unknown) {
    if (error instanceof Error && error.name === "UserNotFoundException") {
      await createUser(cpf);
      const token = createToken(cpf);
      return sendResponse(200, token);
    } else {
      return sendResponse(400, error);
    }
  }
};

export { signUpUser };
