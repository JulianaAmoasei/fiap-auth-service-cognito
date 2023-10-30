// "use strict";

// import dotenv from "dotenv";
// import { CognitoIdentityProviderClient, ListDevicesCommand, AdminSetUserPasswordCommand } from "@aws-sdk/client-cognito-identity-provider";
// import sendResponse from "../utils/sendResponse";
// import validateInput from "../utils/validateInput";

// dotenv.config();

// export default async function handler (event: any) {
//   try {
//     const isValid = validateInput(event.body);
//     if (!isValid) return sendResponse(400, { message: "Invalid input" });

//     const client = new CognitoIdentityProviderClient({ region: "us-east-1" });

//     const { nome, cpf, email, senha } = JSON.parse(event.body);
//     const params = {
//       UserPoolId: process.env.USER_POOL_ID,
//       Username: email,
//       UserAttributes: [
//         {
//           Name: "email",
//           Value: email,
//         },
//         {
//           Name: "cpf",
//           Value: cpf,
//         },
//         {
//           Name: "name",
//           Value: nome,
//         },
//         {
//           Name: "senha",
//           Value: senha,
//         },
//       ],
//       AccessToken: '',
//       MessageAction: "SUPPRESS",
//     };
//     const command = new ListDevicesCommand(params);
//     const response = await client.send(command);
//     if (response) {
//       const paramsForSetPass = {
//         Password: senha,
//         UserPoolId: process.env.USER_POOL_ID,
//         Username: email,
//         Permanent: true,
//       };
//     }
//     return sendResponse(200, { message: "usuário registrado com sucesso" });
//   } catch (error) {
//     // const message = error.message ? error.message : 'Erro no registro'
//     console.log("ERRO NO CONSOLE", error);    
//     return sendResponse(500, { message: error });
//   }
// };
