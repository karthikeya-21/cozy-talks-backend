export interface AuthenticatedRequestUser {
    userId: number;
    email: string;
}
export declare const CurrentUser: (...dataOrPipes: unknown[]) => ParameterDecorator;
