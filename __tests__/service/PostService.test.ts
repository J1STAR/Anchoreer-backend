import { Connection } from "typeorm";
import { TransactionalTestContext } from "typeorm-transactional-tests";
import { CommentDto, PostDto, UserDto } from "../../src/api/dto";
import { connection } from "../../src/data/connection/Connection";
import { User } from "../../src/data/entity/User";
import { PostError, UserError } from "../../src/error";
import container from "../../src/injector";
import { PostService, UserService } from "../../src/service";

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

test('createPost',  async () => {
    let postService: PostService = container.get("PostService");
    let userService: UserService = container.get("UserService");

    let user = new UserDto();
    user.email = "test_email@email.com";
    user.userName = "test_username";
    user.password = "test_password";
    
    let savedUser: UserDto = await userService.signUp(user);

    let post = new PostDto();
    post.title = "제목";
    post.contents = "내용";

    let savedPost = await postService.createPost(savedUser, post);
    expect(savedPost.title).toBe(post.title);
    expect(savedPost.contents).toBe(post.contents);
    expect(savedPost.createdAt).not.toBe(null);
    expect(savedPost.createdBy.id).toBe(savedUser.id);
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
    let userService: UserService = container.get("UserService");

    let user = new UserDto();
    user.email = "test_email@email.com";
    user.userName = "test_username";
    user.password = "test_password";
    
    let savedUser: UserDto = await userService.signUp(user);

    let post = new PostDto();
    post.contents = "내용";

    try {
        await postService.createPost(savedUser, post);
    } catch (err) {
        expect(err).toEqual(PostError.NO_TITLE);
    }
})

test('createComment', async () => {
    let postService: PostService = container.get("PostService");
    let userService: UserService = container.get("UserService");

    let user = new UserDto();
    user.email = "test_email@email.com";
    user.userName = "test_username";
    user.password = "test_password";
    
    let savedUser: UserDto = await userService.signUp(user);

    let post = new PostDto();
    post.title = "제목";
    post.contents = "내용";

    let savedPost = await postService.createPost(savedUser, post);

    let comment = new CommentDto();
    comment.contents = "댓글";

    let savedComment = await postService.createComment(savedUser, savedPost.id, comment);

    expect(savedComment.createdBy.id).toBe(savedUser.id);
    expect(savedComment.contents).toBe(comment.contents);
})

test('updateComment', async () => {
    let postService: PostService = container.get("PostService");
    let userService: UserService = container.get("UserService");

    let user = new UserDto();
    user.email = "test_email@email.com";
    user.userName = "test_username";
    user.password = "test_password";
    
    let savedUser: UserDto = await userService.signUp(user);

    let post = new PostDto();
    post.title = "제목";
    post.contents = "내용";

    let savedPost = await postService.createPost(savedUser, post);

    let comment = new CommentDto();
    comment.contents = "댓글";

    let savedComment = await postService.createComment(savedUser, savedPost.id, comment);

    let commentToUpdate = new CommentDto();
    commentToUpdate.id = savedComment.id;
    commentToUpdate.contents = "수정된 댓글";

    let updatedComment = await postService.updateComment(commentToUpdate);
    expect(updatedComment.id).toBe(savedComment.id);
    expect(updatedComment.contents).toBe(commentToUpdate.contents);
    expect(updatedComment.createdAt).toEqual(savedComment.createdAt);
    expect(updatedComment.updatedAt).not.toEqual(savedComment.updatedAt);
})

test('deleteComment', async () => {
    let postService: PostService = container.get("PostService");
    let userService: UserService = container.get("UserService");

    let user = new UserDto();
    user.email = "test_email@email.com";
    user.userName = "test_username";
    user.password = "test_password";
    
    let savedUser: UserDto = await userService.signUp(user);

    let post = new PostDto();
    post.title = "제목";
    post.contents = "내용";

    let savedPost = await postService.createPost(savedUser, post);

    let comment = new CommentDto();
    comment.contents = "댓글";

    let savedComment = await postService.createComment(savedUser, savedPost.id, comment);

    await postService.deleteComment(savedComment.id);

    let postAfterDeleteComment = await postService.getPostWithAllCommentsByPostId(savedPost.id);
    let comments = postAfterDeleteComment.comments.find(comment => comment.id === savedComment.id);
    expect(comments).toBe(undefined);
})