/**
 * Safely get token from localStorage
 */
export const getToken = (): string | null => {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("accessToken");
};

/**
 * Safely set token in localStorage
 */
export const setToken = (token: string): void => {
    if (typeof window === "undefined") return;
    localStorage.setItem("accessToken", token);
};

/**
 * Safely remove token from localStorage
 */
export const removeToken = (): void => {
    if (typeof window === "undefined") return;
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
};

/**
 * Check if user is authenticated
 */
export const isAuthenticated = (): boolean => {
    const token = getToken();
    return !!token;
};

/**
 * Parse API error response
 */
export const parseApiError = (error: any): string => {
    if (error?.data?.message) {
        return error.data.message;
    }
    if (error?.error?.data?.message) {
        return error.error.data.message;
    }
    if (typeof error === "string") {
        return error;
    }
    return "An unexpected error occurred";
};

/**
 * Create query string from parameters
 */
export const createQueryString = (params: Record<string, any>): string => {
    const searchParams = new URLSearchParams();

    Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
            if (Array.isArray(value)) {
                value.forEach((item) => searchParams.append(key, String(item)));
            } else {
                searchParams.append(key, String(value));
            }
        }
    });

    return searchParams.toString();
};

/**
 * Debounce function for search inputs
 */
export const debounce = <T extends (...args: any[]) => any>(
    func: T,
    wait: number
): ((...args: Parameters<T>) => void) => {
    let timeout: NodeJS.Timeout;

    return (...args: Parameters<T>) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => func(...args), wait);
    };
};

/**
 * Format date for display
 */
export const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
};

/**
 * Validate email format
 */
export const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

/**
 * Generate random ID for temporary use
 */
export const generateId = (): string => {
    return Math.random().toString(36).substr(2, 9);
};

/**
 * Deep clone object (simple implementation)
 */
export const deepClone = <T>(obj: T): T => {
    if (obj === null || typeof obj !== "object") return obj;
    if (obj instanceof Date) return new Date(obj.getTime()) as unknown as T;
    if (Array.isArray(obj)) return obj.map(deepClone) as unknown as T;

    const cloned = {} as T;
    for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
            cloned[key] = deepClone(obj[key]);
        }
    }
    return cloned;
};
