export const prismaErrorMap: Record<
    string,
    {
        statusCode: number;
        message: string;
    }
> = {
    P2002: {
        statusCode: 409,
        message: "Resource already exists.",
    },
    P2003: {
        statusCode: 409,
        message:
            "The requested operation cannot be completed because a referenced resource is invalid.",
    },
    P2025: {
        statusCode: 404,
        message: "Resource not found.",
    },
};