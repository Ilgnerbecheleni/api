import { helloRepo } from "../repositories/hello.repo";


export const helloService = {
async composeHello(name: string): Promise<string> {
// Exemplo: buscar um prefixo do "banco" em memória
const prefix = await helloRepo.getGreetingPrefix();
return `${prefix}, ${name}!`;
},
};