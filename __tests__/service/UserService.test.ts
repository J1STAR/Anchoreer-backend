import { Connection } from "typeorm";
import { TransactionalTestContext } from "typeorm-transactional-tests";

import container from '../../src/injector';
import { connection } from "../../src/data/connection/Connection";

import { UserService } from "../../src/service";
import { AuthTokenDto, UserDto } from "../../src/api/dto";
import { UserError } from "../../src/error";

let conn: Connection;
let transactionalContext: TransactionalTestContext

beforeEach(async () => {
    conn = await connection;
    transactionalContext = new TransactionalTestContext(conn);
    await transactionalContext.start();
})

afterEach(async () => {
    await transactionalContext.finish();
})

afterAll(() => {
    conn.close();
})

test('signUp', async () => {
    let userService: UserService = container.get("UserService");

    let user = new UserDto();
    user.email = "email@email.com";
    user.userName = "test_userName";
    user.password = "test_pw";

    let savedUser = await userService.signUp(user);
    expect(savedUser.email).toEqual(user.email);
    expect(savedUser.createdAt).not.toBe(null);
})

test('signUp: no userName', async () => {
    let userService: UserService = container.get("UserService");

    let user = new UserDto();
    user.email = "email@email.com";
    user.password = "test_pw";

    try {
        await userService.signUp(user);
    } catch (err) {
        expect(err).toEqual(UserError.INVALID_USER_NAME);
    }
})

test('signUp: invalid email', async () => {
    let userService: UserService = container.get("UserService");

    let user = new UserDto();
    user.email = "not_email";
    user.password = "test_pw";

    try {
        await userService.signUp(user);
    } catch (err) {
        expect(err).toEqual(UserError.INVALID_EMAIL);
    }
})

test('signUp: invalid password', async () => {
    let userService: UserService = container.get("UserService");

    let user = new UserDto();
    user.email = "email@email.com"
    user.userName = "test_userName"
    user.password = ""

    try {
        await userService.signUp(user);
    } catch (err) {
        expect(err).toEqual(UserError.INVALID_PASSWORD);
    }

})

test('signIn: invalid user', async () => {
    let userService: UserService = container.get("UserService");

    let user = new UserDto();
    user.email = "email";
    user.password = "password";

    try {
        await userService.signIn(user);
    } catch (err) {
        expect(err).toEqual(UserError.INVALID_USER);
    }
})

test('signIn: getToken', async () => {
    let userService: UserService = container.get("UserService");

    let user = new UserDto();
    user.email = "zunkyu.park@email.com";
    user.password = "1234";
    
    expect(await userService.signIn(user)).toBeInstanceOf(AuthTokenDto);
})

test('signIn: no email', async () => {
    let userService: UserService = container.get("UserService");

    let user = new UserDto();
    user.email = "";
    user.password = "1234";
    
    try {
        await userService.signIn(user);
    } catch (err) {
        expect(err).toEqual(UserError.INVALID_EMAIL);
    }
})

test('signIn: no password', async () => {
    let userService: UserService = container.get("UserService");

    let user = new UserDto();
    user.email = "email";
    user.password = "";
    
    try {
        await userService.signIn(user);
    } catch (err) {
        expect(err).toEqual(UserError.INVALID_PASSWORD);
    }
})

test('signIn: dont throw InvalidPassword when passord is wrong', async () => {
    let userService: UserService = container.get("UserService");

    let user = new UserDto();
    user.email = "zunkyu.park@email.com";
    user.password = "wrong_password";
    
    try {
        await userService.signIn(user);
    } catch (err) {
        expect(err).not.toEqual(UserError.INVALID_PASSWORD);
        expect(err).toEqual(UserError.INVALID_USER);
    }
})