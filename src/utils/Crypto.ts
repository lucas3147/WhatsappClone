import crypto from 'crypto';

export function generateSalt() {
    return crypto.randomBytes(16).toString('hex'); // Gera um salt de 16 bytes
}

export function hashPassword(password: string, salt: string): string {
    const hash = crypto.createHmac('sha256', salt).update(password).digest('hex');
    return hash;
}

export function verifyPassword(plainPassword: string, passwordDatabase: string): boolean {
    const {salt, hash} = separateHashAndSalt(passwordDatabase);
    const hashToCompare = hashPassword(plainPassword, salt);
    return hashToCompare === hash;
}

export function combineHashAndSalt(hash: string, salt: string) {
    return `${salt}$${hash}`;
}

export function separateHashAndSalt(combined: string) {
    const [salt, hash] = combined.split('$');
    return { salt, hash };
}