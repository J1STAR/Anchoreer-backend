import { Connection } from "typeorm";
import { TransactionalTestContext } from "typeorm-transactional-tests";

import container from '../../src/injector';
import { connection } from "../../src/data/connection/Connection";

import { User } from "../../src/data/entity/User";
import { UserService } from "../../src/service";
import { UserDto } from "../../src/api/dto";
import { CustomError, UserError } from "../../src/error";

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

test('signUp test', async () => {
    let userService: UserService = container.get("UserService");

    let user = new UserDto();
    user.email = "email@email.com";
    user.password = "test_pw";

    let savedUser = await userService.signUp(user);
    expect(savedUser.email).toEqual(user.email);
    expect(savedUser.createdAt).not.toBe(null);
})

test('signUp test: invalid email', async () => {
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

test('signUp test: invalid password', async () => {
    let userService: UserService = container.get("UserService");

    let user = new UserDto();
    user.email = "email@email.com"
    user.password = ""

    try {
        await userService.signUp(user);
    } catch (err) {
        expect(err).toEqual(UserError.INVALID_PASSWORD);
    }

})