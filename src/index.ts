import App from './app';

const server = new App().server;

const port = 7041;

server.listen(port, () => {
    console.log(`app listening on port ${port}`);
}).on('error', err => {
    console.log(err);
})