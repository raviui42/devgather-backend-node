const express= require('express')
const connectionDB =require('./config/database')
const cookieParser = require('cookie-parser');
const authRouts = require('./routs/auth');
const profileRouts = require('./routs/profile');
const requestRouts = require('./routs/request');
const userRouter = require('./routs/user');
const cors = require('cors')

const app = express();

app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}))
app.use(express.json())
app.use(cookieParser());

app.use('/', authRouts)
app.use('/', profileRouts)
app.use('/', requestRouts)
app.use('/', userRouter)

connectionDB().then(() => {
    app.listen(5000,()=>{
        console.log('connect server')
    })
}).catch((err) => console.error('db not connect'))

