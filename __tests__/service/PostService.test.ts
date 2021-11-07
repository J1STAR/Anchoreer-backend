import { Connection } from "typeorm";
import { TransactionalTestContext } from "typeorm-transactional-tests";
import { PostDto, UserDto } from "../../src/api/dto";
import { connection } from "../../src/data/connection/Connection";
import { PostError, UserError } from "../../src/error";
import container from "../../src/injector";
import { PostService } from "../../src/service";

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

test('createPost: no user', async () => {
    let postService: PostService = container.get("PostService");

    let user = new UserDto();

    let post = new PostDto();
    post.title = "제목";
    post.contents = "내용";

    try {
        await postService.createPost(user, post);
    } catch (err) {
        expect(err).toEqual(UserError.INVALID_USER);
    }
})

test('createPost: no title', async () => {
    let postService: PostService = container.get("PostService");

    let user = new UserDto();
    user.id = 1;

    let post = new PostDto();
    post.contents = "내용";

    try {
        await postService.createPost(user, post);
    } catch (err) {
        expect(err).toEqual(PostError.NO_TITLE);
    }
})