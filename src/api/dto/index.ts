export class UserDto {
    id: number;
    email: string;
    password: string;
    createdAt: Date;
}

export class AuthTokenDto {
    token: string;
}