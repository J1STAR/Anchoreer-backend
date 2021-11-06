import { inject, injectable } from "inversify";

import { UserService } from "..";
import { AuthTokenDto, UserDto } from "../../api/dto";
import { AuthToken } from "../../data/entity/AuthToken";
import { User } from "../../data/entity/User";
import { AuthTokenMapper, UserMapper } from "../../data/mapper/ModelMapper";
import { AuthTokenRepository, UserRepository } from "../../data/repository";
import { AuthError, UserError } from "../../error";
import { Encryptor, Validator } from "../../util";

@injectable()
export default class UserServiceImpl implements UserService {

    private userMapper: UserMapper;
    private userRepository: UserRepository;
    private authTokenMapper: AuthTokenMapper;
    private authTokenRepository: AuthTokenRepository;
    private validator: Validator;
    private encryptor: Encryptor;

    constructor(
        @inject("UserMapper") userMapper: UserMapper,
        @inject("UserRepository") userRepository: UserRepository,
        @inject("AuthTokenMapper") authTokenMapper: AuthTokenMapper,
        @inject("AuthTokenRepository") authTokenRepository: AuthTokenRepository,
        @inject("Validator") validator: Validator,
        @inject("Encryptor") encryptor: Encryptor
    ) {
        this.userMapper = userMapper;
        this.userRepository = userRepository;
        this.authTokenMapper = authTokenMapper;
        this.authTokenRepository = authTokenRepository;
        this.validator = validator;
        this.encryptor = encryptor;
    }

    async signUp(user: UserDto): Promise<UserDto> {
        if(!this.validator.isEmail(user.email)) throw UserError.INVALID_EMAIL;
        if(user.password === null || user.password === undefined || user.password === "") throw UserError.INVALID_PASSWORD;
        if(await this.userRepository.existsByEmail(user.email)) throw UserError.ALREADY_EXIST_EMAIL;
        
        const salt = this.encryptor.getRandomValue();
        const encryptedPassword = this.encryptor.encrypt(user.password, salt);

        let userToSignUp = new User();

        userToSignUp.email = user.email;
        userToSignUp.userName = user.userName;
        userToSignUp.password = encryptedPassword;
        userToSignUp.salt = salt;
        userToSignUp.createdAt = new Date();

        let savedUser = await this.userRepository.save(userToSignUp);
        
        let savedUserDto = this.userMapper.convert(savedUser);

        savedUserDto.password = "";

        return savedUserDto;
    }

    async signIn(user: UserDto): Promise<AuthTokenDto> {
        if(user.email == null || user.email == undefined || user.email == "") throw UserError.INVALID_EMAIL;
        if(user.password == null || user.password == undefined || user.password == "") throw UserError.INVALID_PASSWORD;

        let findedUser = await this.userRepository.findByEmail(user.email);
        if(findedUser) {
            const encryptedPassword = this.encryptor.encrypt(user.password, findedUser.salt);
            if (encryptedPassword === findedUser.password) {
                let savedToken = await this.authTokenRepository.save(new AuthToken(findedUser));
                return this.authTokenMapper.convert(savedToken);
            } else {
                throw UserError.INVALID_USER;
            }
        } else {
            throw UserError.INVALID_USER;
        }
    }

    async getUserByToken(token: string): Promise<UserDto> {
        if(token == null || token == undefined || token == "") throw AuthError.INVALID_TOKEN;

        let findedToken = await this.authTokenRepository.findById(token);
        if(findedToken) {
            let user = this.userMapper.convert(findedToken.user);
            user.password = "";
            return user;
        } else {
            throw AuthError.INVALID_TOKEN;
        }
    }
}