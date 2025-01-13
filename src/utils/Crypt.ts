import crypto from 'crypto';

export function hashPassword(password: string, salt: string): string {
    const hash = crypto.createHmac('sha256', salt).update(password).digest('hex');
    return hash;
}

export function verifyPassword(plainPassword: string, hashedPassword: string, salt: string): boolean {
    const hashToCompare = hashPassword(plainPassword, salt);
    return hashToCompare === hashedPassword;
}