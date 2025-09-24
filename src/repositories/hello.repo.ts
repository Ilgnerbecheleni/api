// Repositório em memória — futuramente trocamos por DB
let greetingPrefix = "Olá";


export const helloRepo = {
async getGreetingPrefix(): Promise<string> {
return greetingPrefix;
},
async setGreetingPrefix(prefix: string): Promise<void> {
greetingPrefix = prefix;
},
};