
const express = require('express')
const cluster = require('cluster')
const os = require('os')
const app = express()


if (cluster.isPrimary) {


    for (let i = 0; i < os.cpus().length; i++) {
        cluster.fork()
    }

    cluster.on('exit', (worker, code, signal) => {
        if (code !== 0) {
            console.error(`Worker ${worker.process.pid} exited with code ${code} due to signal ${signal}. Restarting...`);
        } else {
            console.log(`Worker ${worker.process.pid} exited normally. Restarting...`);
        }
        cluster.fork();
    });

} else {

    const db = require('./utils/db')
    const bodyParser = require('body-parser')
    const cors = require('cors')

    require('dotenv').config();

    app.use(bodyParser.json())

    app.use(cors({
        origin: ['http://localhost:5173', 'https://brm-eight.vercel.app', 'https://brm-faaizmahmoods-projects.vercel.app/'],
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
        credentials: true
    }))

    app.use((req, res, next) => {

        console.log(`${new Date().toLocaleString()}  Request made at: ${req.originalUrl}`)
        next()
    })

    app.get('/', (req, res) => {

        res.status(200).json({
            message: 'working',
            worker: `worker ${process.pid}`
        })

    })


    // Routes

    const userRouter = require('./routes/user')
    const oauthRouter = require('./routes/oauth')
    const profileRouter = require('./routes/profile')
    app.use('/api/user', profileRouter)


    // End Points

    app.use('/api/auth', userRouter)
    app.use('/api/auth', oauthRouter)



    // PORT 
    const PORT = process.env.PORT || 5000;

    app.listen(PORT, () => {
        console.log("App is Running at Port: ", PORT)
    })


}
