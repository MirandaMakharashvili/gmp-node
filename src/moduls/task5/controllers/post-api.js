function parseRequestBody(req, callback) {
    let body = '';

    req.on('data', (chunk) => {
        body += chunk.toString();
    });

    req.on('end', () => {
        callback(JSON.parse(body));
    });

    req.on('error', (error) => {
        reject(error);
    });
}

module.exports = parseRequestBody;
