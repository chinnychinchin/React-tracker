require('./models/User')
const express = require('express')
const req = require('express/lib/request')
const mongoose = require('mongoose')
const authRoutes = require('./routes/authRoutes')
const requireAuth = require('./middlewares/requireAuth')

const app = express()
app.use(express.json())
app.use(authRoutes)

app.get('/', requireAuth, (req, res) => {
    // only allow a user to access this route if they have a valid jwt
    res.send(`your email is: ${req.user.email}`)

})

const mongoUri = 'mongodb+srv://admin:Smoke0808@cluster0.6mabj.mongodb.net/myFirstDatabase?retryWrites=true&w=majority'
mongoose.connect(mongoUri)
mongoose.connection.on('connected', () => console.log('connected to mongo instance'))
mongoose.connection.on('error', (err) => console.err('error connecting to mongo instance', err))

app.listen(3000, () => console.info('track-server started on port 3000'))