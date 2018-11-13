const Session = require('./server/session.js');
const Client = require('./server/client.js');

const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server, { origins: 'localhost:8080' });

app.use(express.static(__dirname + '/public'));

const sessions = new Map;

function createId(len = 6, chars = 'abcdefghijklmnopqrstuvwxyz01234567890') {
    let id = '';
    while (len--) {
        id += chars[Math.random() * chars.length | 0];
    }
    return id;
}

function createClient(conn, id = createId()) {
    return new Client(conn, id);
}

function createSession(id = createId()) {
    if (sessions.has(id)) {
        throw new Error(`Session ${id} already exists`);
    }

    const session = new Session(id);
    sessions.set(id, session);
    return session;
}

function getSession(id) {
    return sessions.get(id);
}

function broadcastSession(session) {
    const clients = [...session.clients];
    clients.forEach(client => {
        client.send({
            type: 'session-broadcast',
            peers: {
                you: client.id,
                clients: clients.map(client => {
                    return {
                        id: client.id,
                        state: client.state,
                    }
                }),
            },
        });
    });
}

app.get('/', (req, res) => {
    res.sendFile(__dirname + 'index.html');
});

server.listen(8080, function() {
    console.log("I'm listening.");
});

io.on('connection', function(conn) {
    conn.emit('open');

    console.log("io connected");
    const client = createClient(conn);

    conn.on('message', msg => {
        const data = JSON.parse(msg);

        if (data.type === 'create-session') {
            const session = createSession();
            session.join(client);

            client.state = data.state;
            client.send({
                type: 'session-created',
                id: session.id,
            });
        } else if (data.type === 'join-session') {
            const session = getSession(data.id) || createSession(data.id);
            session.join(client);

            client.state = data.state;
            broadcastSession(session);
        } else if (data.type === 'state-update') {
            const [key, value] = data.state;
            client.state[data.fragment][key] = value;
            client.broadcast(data);
        }
    });

    conn.on('disconnect', () => {
        const session = client.session;
        if (session) {
            session.leave(client);
            if (session.clients.size === 0) {
                sessions.delete(session.id);
            }
            broadcastSession(session);
        }
    });
});
