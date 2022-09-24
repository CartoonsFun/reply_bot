export const envToNumber = (processEnvVar: string | undefined, varName: string): number => {
    if (processEnvVar) {
        const chatId = parseInt(processEnvVar);
        if (chatId) {
            return chatId;
        }
        console.error(`Failed to parse ${varName} (${processEnvVar})`);
    }
    console.error(`No ${varName}`);
    return -1;
}

export const envToString = (processEnvVar: string | undefined, varName: string): string => {
    if (processEnvVar) {
        return processEnvVar;
    }
    console.error(`No ${varName}`);
    return '';
}
