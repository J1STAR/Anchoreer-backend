import { inject, injectable } from "inversify";

import { UserService } from "..";
import { UserDto } from "../../api/dto";
import { User } from "../../data/entity/User";
import { UserMapper } from "../../data/mapper/ModelMapper";
import { UserRepository } from "../../data/repository";
import { UserError } from "../../error";
import { Encryptor, Validator } from "../../util";

@injectable()
export default class UserServiceImpl implements UserService {

    private userMapper: UserMapper;
    private userRepository: UserRepository;
    private validator: Validator;
    private encryptor: Encryptor;

    constructor(
        @inject("UserMapper") userMapper: UserMapper,
        @inject("UserRepository") userRepository: UserRepository,
        @inject("Validator") validator: Validator,
        @inject("Encryptor") encryptor: Encryptor
    ) {
        this.userMapper = userMapper;
        this.userRepository = userRepository;
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
        userToSignUp.password = encryptedPassword;
        userToSignUp.salt = salt;
        userToSignUp.createdAt = new Date();

        let savedUser = await this.userRepository.save(userToSignUp);
        
        let savedUserDto = this.userMapper.convert(savedUser);

        savedUserDto.password = "";

        return savedUserDto;
    }
}