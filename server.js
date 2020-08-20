const express = require('express')
const app = express()
const server = require('http').Server(app)
const io = require('socket.io')(server)
const { v4: uuidV4 } = require('uuid')

app.set('view engine', 'ejs')
app.use(express.static('public'))

app.get('/', (req, res) => {
    res.redirect(`/${uuidV4()}`)
})

app.get('/:party', (req, res) => {
    res.render('party', { partyId: req.params.party })
})

io.on('connection', socket => {
    socket.on('join-party', (partyId, userId) => {
        socket.join(partyId)
        socket.to(partyId).broadcast.emit('user-connected', userId)

        socket.on('disconnect', () => {
            socket.to(partyId).broadcast.emit('user-disconnected', userId)
        })
    })
})

server.listen(3000)