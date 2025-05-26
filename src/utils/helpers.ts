import bcrypt from 'bcryptjs';

export function hash(str: string, salt: string | number = 10) {
    return bcrypt.hash(str, salt);
}

export function compareHash(str: string, hash: string) {
    return bcrypt.compare(str, hash);
}

export const validateEmail = async (email: string) => {
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if (!regex.test(email)) {
        return false;
    }

    if (email.length > 255) {
        return false;
    }

    if (email.includes('"') || email.includes("'")) {
        return false;
    }

    if (email.includes(' ')) {
        return false;
    }

    return true;
};

export const formatDuration = (ms: number): string => {
    if (!ms || ms <= 0) return '0h 0m';

    const totalSeconds = Math.floor(ms / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);

    return `${hours}h ${minutes}m`;
};


export const calculateCompletionRate = (statusCounts: Array<{ status: string, count: number }>): string => {
    const completed = statusCounts.find(s => s.status === 'COMPLETED')?.count || 0;
    const total = statusCounts.reduce((acc, curr) => acc + curr.count, 0);
    return total > 0 ? `${((completed / total) * 100).toFixed(1)}%` : '0%';
};


