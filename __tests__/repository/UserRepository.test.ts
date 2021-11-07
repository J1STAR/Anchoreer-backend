import { Connection } from "typeorm";
import { TransactionalTestContext } from "typeorm-transactional-tests";

import container from '../../src/injector';
import { connection } from "../../src/data/connection/Connection";
import { UserRepository } from "../../src/data/repository";
import { User } from "../../src/data/entity/User";

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

test('saveUser test', async () => {
    let userRepository: UserRepository = container.get("UserRepository");

    let user = new User();
    user.email = "email@emai.com";
    user.password = "test_pw";
    user.userName = "test_userName";
    user.salt = "test_salt";
    user.createdAt = new Date();

    let savedUser = await userRepository.save(user);
    expect(savedUser.email).toEqual(user.email);
})