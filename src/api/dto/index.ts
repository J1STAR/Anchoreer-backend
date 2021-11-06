export class UserDto {
    id: number;
    email: string;
    password: string;
    createdAt: Date;
}

export class AuthTokenDto {
    token: string;
}

export class PostDto {
    id: number;
    title: string;
    contents: string;
    createdBy: UserDto;
    createdAt: Date;
    updatedAt: Date;
}