const http = require('http');
const url = require('url');
const crypto = require('crypto');
const parseRequestBody = require('./moduls/task5/controllers/post-api.js');
const { users, addUser, getUserHobbies } = require('./models/task5/users.js');
const port = 8000;

function uuidv4() {
    return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, (c) =>
        (c ^ (crypto.randomBytes(1)[0] & (15 >> (c / 4)))).toString(16),
    );
}

const server = http.createServer((req, res) => {
    res.setHeader('Content-Type', 'application/json');

    const reqUrl = url.parse(req.url);
    const paths = reqUrl.pathname.split('/').filter((path) => path);

    if (req.method === 'GET' && reqUrl.pathname === '/api/users') {
        res.statusCode = 200;
        res.setHeader('Cache-Control', 'public, max-age=3600');
        res.end(JSON.stringify(users));
    } else if (req.method === 'POST' && reqUrl.pathname === '/api/users') {
        parseRequestBody(req, (user) => {
            user.UserId = uuidv4();

            addUser(user.body);

            res.statusCode = 201;
            res.end(JSON.stringify({ message: 'User created successfully', user: user }));
        });
    } else if (req.method === 'DELETE' && reqUrl.pathname === `/api/users/user`) {
        //In postman file there was no query for DELETE
        //So I added it /api/users/user?userId=7b238d73-0d0f-49b9-a1e9-bc22087f6b62
        //I was able to spleey without query as well
        const userIdQuery = reqUrl.query;
        const userId = userIdQuery.split('=')[1];

        let userIndex = users.findIndex((user) => user.userId === userId);

        users[userIndex].links = {
            self: `http://localhost:${port}/api/users/user?userId=${userId}`,
            delete: `http://localhost:${port}/api/users/user?userId=${userId}`,
        };

        if (userIndex !== -1) {
            users.splice(userIndex, 1);
            res.statusCode = 200;
            res.end(JSON.stringify({ message: `User with ID: ${userId} was successfully deleted.` }));
        } else {
            res.statusCode = 404;
            res.end(JSON.stringify({ error: `User with ID: ${userId} was not found.` }));
        }
    } else if (
        req.method === 'GET' &&
        paths.length === 4 &&
        paths[0] === 'api' &&
        paths[1] === 'users' &&
        paths[3] === 'hobbies'
    ) {
        const userId = paths[2];
        const userHobbies = getUserHobbies(userId);

        res.statusCode = 200;
        res.setHeader('Cache-Control', 'public, max-age=3600');
        res.end(JSON.stringify(userHobbies));
    } else if (
        req.method === 'PATCH' &&
        paths.length === 4 &&
        paths[0] === 'api' &&
        paths[1] === 'users' &&
        paths[3] === 'hobbies'
    ) {
        parseRequestBody(req, (hobbies) => {
            const userId = paths[2];
            let userIndex = users.findIndex((user) => user.userId === userId);

            users[userIndex].links = {
                self: `http://localhost:${port}/api/users/${userId}/hobbies`,
                update: `http://localhost:${port}/api/users/${userId}/hobbies`,
            };

            if (user !== -1) {
                for (const hobby of hobbies) {
                    users[userIndex].hobbies.push(hobby);
                }
                res.statusCode = 200;
                res.end(JSON.stringify(users[userIndex]));
            } else {
                res.statusCode = 404;
                res.end(JSON.stringify({ error: 'User not found' }));
            }
        });
    } else {
        res.statusCode = 404;
        res.end(JSON.stringify({ url: reqUrl, error: 'Endpoint not found' }));
    }
});

server.listen(port);
