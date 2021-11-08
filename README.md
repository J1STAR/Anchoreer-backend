# 앵커리어 백엔드 - 박준규

본 백엔드 애플리케이션은 `node.js` 기반으로 제작되었습니다.
***

## How to Start
```sh
git clone https://github.com/junkyuu/Anchoreer-backend.git
```

```sh
cd Anchoreer-backend
```

```sh
npm install
```
***
## Requirement
해당 어플리케이션 실행 전 다음 프로세스를 진행해주시기 바랍니다.
1. localhost의 3306 port로 MySql 서버 실행
2. MySql 새로운 스키마 생성
    ```sql
    CREATE SCHEMA `jasoseol_zunkyu` DEFAULT CHARACTER SET utf8mb4 ;
    ```
3. src/data/connection/Connection.ts 파일에서 DB 사용자, 비밀번호 입력

***

## Run the App
```sh
npm start
```
만약 아래와 같은 에러가 난다면 다음 스텝을 진행해주시기 바랍니다.
해당 어플리케이션은 7041포트에서 구동됩니다.
```sh
Error: listen EADDRINUSE: address already in use :::7041
```
7041 포트를 사용하고 있는 프로세스를 찾습니다.
```sh
lsof -i :7041
```
다음 명령어로 종료시켜주시기 바랍니다.
```sh
kill -9 PID
```
***
## REST API
### Sign Up (회원가입)

#### Request
`[POST]` /users/sign-up

##### RequestBody
```typescript
{
    email: string;
    userName: string;
    password: string;
}
```

#### Response
HttpStatus: `201` Created
```json
{
    "id": 1,
    "email": "zunkyu@email.com",
    "userName": "박준규",
    "createdAt": "2021-11-07T05:21:47.798Z",
    "password": ""
}
```

#### Error 
- 올바르지 않은 email 양식인 경우
    HttpStatus: `400` Bad Request
    ```json
    {
        "status": 400,
        "code": 258,
        "message": "Invalid Email"
    }
    ```

- Password없이 요청한 경우
    HttpStatus: `400` Bad Request
    ```json
    {
        "status": 400,
        "code": 259,
        "message": "Invalid Password"
    }
    ```

- userName없이 요청한 경우
    HttpStatus: `400` Bad Requst
    ```json
    {
        "status": 400,
        "code": 261,
        "message": "Invalid UserName"
    }
    ```

- 이미 가입한 email인 경우
    HttpStatus: `409` Confilct
    ```json
    {
        "status": 409,
        "code": 257,
        "message": "Already Exist Email"
    }
    ```

***
### Sign In (로그인)

#### Request
`[POST]` /users/sign-in

##### RequestBody
```typescript
{
    email: string;
    password: string;
}
```

#### Response
HttpStatus: `200` OK
```json
{
    "token": "6c5df8cea6e36542a094dcbd0614a71dd536fbed1b11f97208811313d54f00fa"
}
```

해당 토큰은 글작성, 댓글작성에 사용됩니다.
HttpHeader의 Authorization에 Bearer type으로 사용해주시기 바랍니다.

#### Error 
- email 없이 요청한 경우
    HttpStatus: `400` Bad Request
    ```json
    {
        "status": 400,
        "code": 258,
        "message": "Invalid Email"
    }
    ```

- Password 없이 요청한 경우
    HttpStatus: `400` Bad Request
    ```json
    {
        "status": 400,
        "code": 259,
        "message": "Invalid Password"
    }
    ```

- email이나 password가 올바르지 않은 경우
    HttpStatus: `400` Bad Request
    ```json
    {
        "status": 400,
        "code": 260,
        "message": "Invalid User"
    }
    ```

***
### Create Post (글 작성)

#### Request
`[POST]` /posts

##### RequestHeader
```typescript
{
    Authorization: Bearer '로그인 시 발급받은 토큰';
}
```

##### RequestBody
```typescript
{
    title: string;
    contents: string;
}
```

#### Response

HttpStatus: `201` Created
    
```json
{
    "id": 1,
    "title": "글 제목",
    "contents": "글 내용",
    "updatedAt": "2021-11-07T05:34:26.687Z",
    "createdAt": "2021-11-07T05:34:26.686Z",
    "createdBy": {
        "id": 1,
        "email": "zunkyu@email.com",
        "userName": "박준규",
        "createdAt": "2021-11-07T05:21:47.798Z"
    }
} 
```

#### Error 
- token 없이 요청한 경우
    HttpStatus: `401` Unauthorized
    ```json
    {
        "status": 401,
        "code": 513,
        "message": "No Token"
    }
    ```
    
- 유효하지 않은 token으로 요청한 경우
    HttpStatus: `401` Unauthorized
    ```json
    {
        "status": 401,
        "code": 514,
        "message": "Invalid Token"
    }
    ```

- title 없이 요청한 경우
    HttpStatus: `400` Bad Request
    ```json
    {
        "status": 400,
        "code": 771,
        "message": "No Title"
    }
    ```

***
### Get Post Detail (글 상세조회)

#### Request
`[GET]` /posts/`:postId`

#### Response

HttpStatus: `200` OK
    
```json
{
    "id": 1,
    "title": "글 제목",
    "contents": "글 내용",
    "updatedAt": "2021-11-07T05:34:26.687Z",
    "createdAt": "2021-11-07T05:34:26.686Z",
    "createdBy": {
        "id": 1,
        "email": "zunkyu@email.com",
        "userName": "박준규",
        "createdAt": "2021-11-07T05:21:47.798Z"
    },
    "comments": []
}
```

댓글은 생성일 기준 오름차순으로 조회됩니다.

#### Error 
- 존재하지 않는 postId로 요청한 경우
    HttpStatus: `404` Not Found
    ```json
    {
        "status": 404,
        "code": 769,
        "message": "Post Not Found"
    }
    ```


***
### Get Posts (글 조회)

#### Request
`[GET]` /posts

##### RequestParameters
- page: number `(optional)`
- size: number `(optional)`
- sort: createdAt,asc | createdAt,desc | updatedAt,asc | updatedAt,desc `(optional)`

pagination이 필요한 경우 page, size 파라미터를 이용해주시기 바랍니다.
해당 파라미터가 없으면 모든 글을 조회합니다.

정렬이 필요한 경우 sort 파라미터에 위 네 값중 하나를 이용해주시기 바랍니다.
해당 파라미터가 없으면 생성일 기준 내림차순으로 조회합니다.


#### Response

HttpStatus: `200` OK

```json  
[
    {
        "id": 2,
        "title": "title",
        "contents": "글 내용",
        "updatedAt": "2021-11-07T05:50:59.291Z",
        "createdAt": "2021-11-07T05:50:59.281Z",
        "createdBy": {
            "id": 1,
            "email": "zunkyu@email.com",
            "userName": "박준규",
            "createdAt": "2021-11-07T05:21:47.798Z"
        }
    },
    {
        "id": 1,
        "title": "글 제목",
        "contents": "글 내용",
        "updatedAt": "2021-11-07T05:34:26.687Z",
        "createdAt": "2021-11-07T05:34:26.686Z",
        "createdBy": {
            "id": 1,
            "email": "zunkyu@email.com",
            "userName": "박준규",
            "createdAt": "2021-11-07T05:21:47.798Z"
        }
    }
]
```

***
### Get Posts By UserName (작성자 이름으로 글 조회)

#### Request
`[GET]` /posts/search/user-name/`:userName`

##### RequestParameters
- sort: createdAt,asc | createdAt,desc | updatedAt,asc | updatedAt,desc `(optional)`

정렬이 필요한 경우 sort 파라미터에 위 네 값중 하나를 이용해주시기 바랍니다.
해당 파라미터가 없으면 생성일 기준 내림차순으로 조회합니다.

#### Response

HttpStatus: `200` OK

```json    
[
    {
        "id": 2,
        "title": "title",
        "contents": "글 내용",
        "updatedAt": "2021-11-07T05:50:59.291Z",
        "createdAt": "2021-11-07T05:50:59.281Z",
        "createdBy": {
            "id": 1,
            "email": "zunkyu@email.com",
            "userName": "박준규",
            "createdAt": "2021-11-07T05:21:47.798Z"
        }
    },
    {
        "id": 1,
        "title": "글 제목",
        "contents": "글 내용",
        "updatedAt": "2021-11-07T05:34:26.687Z",
        "createdAt": "2021-11-07T05:34:26.686Z",
        "createdBy": {
            "id": 1,
            "email": "zunkyu@email.com",
            "userName": "박준규",
            "createdAt": "2021-11-07T05:21:47.798Z"
        }
    }
]
```

***
### Get Posts By Title (제목으로 글 조회)

#### Request
`[GET]` /posts/search/title/`:title`

##### RequestParameters
- sort: createdAt,asc | createdAt,desc | updatedAt,asc | updatedAt,desc `(optional)`

정렬이 필요한 경우 sort 파라미터에 위 네 값중 하나를 이용해주시기 바랍니다.
해당 파라미터가 없으면 생성일 기준 내림차순입니다.

#### Response

HttpStatus: `200` OK

```json
[
    {
        "id": 1,
        "title": "글 제목",
        "contents": "글 내용",
        "updatedAt": "2021-11-07T05:34:26.687Z",
        "createdAt": "2021-11-07T05:34:26.686Z",
        "createdBy": {
            "id": 1,
            "email": "zunkyu@email.com",
            "userName": "박준규",
            "createdAt": "2021-11-07T05:21:47.798Z"
        }
    }
]
```

***
### Update Post (글 수정)

#### Request
`[PUT]` /posts

##### RequestBody
```json
{
    "id": 1,
    "title": "수정된 제목",
    "contents": "수정된 내용"
}
```

#### Response

HttpStatus: `200` OK

```json
{
    "id": 1,
    "title": "수정된 제목",
    "contents": "수정된 내용",
    "updatedAt": "2021-11-07T12:18:58.659Z",
    "createdAt": "2021-11-07T12:18:58.651Z",
    "createdBy": {
        "id": 1,
        "email": "zunkyu@email.com",
        "userName": "박준규",
        "createdAt": "2021-11-07T11:12:44.035Z"
    }
}
```

#### Error
- 올바르지 않은 postId로 요청한 경우
    HttpStatus: `400` Bad Request
    ```json
    {
        "status": 400,
        "code": 774,
        "message": "Invalid Post Id"
    }
    ```

- title 없이 요청한 경우
    HttpStatus: `400` Bad Request
    ```json
    {
        "status": 400,
        "code": 771,
        "message": "No Title"
    }
    ```

***
### Delete Post (글 삭제)

#### Request
`[DELETE]` /posts/`:postId`

#### Response

HttpStatus: `204` No Content

```json
void
```

#### Error
- 올바르지 않은 postId로 요청한 경우
    HttpStatus: `400` Bad Request
    ```json
    {
        "status": 400,
        "code": 774,
        "message": "Invalid Post Id"
    }
    ```

***
### Create Comment (댓글 작성)

#### Request
`[POST]` /posts/`:postId`/comments

##### RequestHeader
```typescript
{
    Authorization: Bearer '로그인 시 발급받은 토큰';
}
```

##### RequestBody
```typescript
{
    contents: string;
}
```

#### Response

HttpStatus: `201` Created
    
```json
{
    "id": 1,
    "contents": "댓글",
    "createdAt": "2021-11-07T08:58:46.895Z",
    "updatedAt": "2021-11-07T08:58:46.919Z",
    "createdBy": {
        "id": 1,
        "email": "zunkyu@email.com",
        "userName": "박준규",
        "createdAt": "2021-11-07T05:21:47.798Z"
    }
}
```

#### Error 

- token 없이 요청한 경우
    HttpStatus: `401` Unauthorized
    ```json
    {
        "status": 401,
        "code": 513,
        "message": "No Token"
    }
    ```
    
- 유효하지 않은 token으로 요청한 경우
    HttpStatus: `401` Unauthorized
    ```json
    {
        "status": 401,
        "code": 514,
        "message": "Invalid Token"
    }
    ```

- 존재하지 않는 postId로 요청한 경우
    HttpStatus: `404` Not Found
    ```json
    {
        "status": 404,
        "code": 769,
        "message": "Post Not Found"
    }
    ```

- 댓글 내용이 없는 경우
    HttpStatus: `400` Bad Request
    ```json
    {
        "status": 400,
        "code": 772,
        "message": "Invalid Comment"
    }
    ```

***
### Update Comment (댓글 수정)

#### Request
`[PUT]` /posts/comments

##### RequestBody
```typescript
{
    id: number;
    contents: string;
}
```

#### Response

HttpStatus: `200` OK
    
```json
{
    "id": 1,
    "contents": "수정된 댓글",
    "createdAt": "2021-11-07T08:58:46.895Z",
    "updatedAt": "2021-11-07T09:05:59.711Z",
    "createdBy": {
        "id": 1,
        "email": "zunkyu@email.com",
        "userName": "박준규",
        "createdAt": "2021-11-07T05:21:47.798Z"
    }
}
```

#### Error 

- 존재하지 않는 commentId로 요청한 경우
    HttpStatus: `404` Not Found
    ```json
    {
        "status": 404,
        "code": 770,
        "message": "Comment Not Found"
    }
    ```

- 댓글 내용이 없는 경우
    HttpStatus: `400` Bad Request
    ```json
    {
        "status": 400,
        "code": 772,
        "message": "Invalid Comment"
    }
    ```

***
### Delete Comment (댓글 삭제)

#### Request
`[DELETE]` /posts/comments/`:commentId`

##### Response

HttpStatus: `204` No Content

```json
void
```

#### Error 

- commentId 형식과 맞지 않는 경우
    HttpStatus: `400` Bad Request
    ```json
    {
        "status": 400,
        "code": 773,
        "message": "Invalid Comment Id"
    }
    ```
