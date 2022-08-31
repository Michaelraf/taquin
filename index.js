const http = require("http");
const express = require("express");
const app = express();
const cors = require('cors');
const server = http.createServer(app);
const port = 1337;
const router = require('express').Router();
const solve = require('./game/solve')

app.use(express.urlencoded({extended : true}))
app.use(express.json());
app.use(cors({
    origin: '*'
}));

app.use('/', express.static(process.cwd()+'/pages'));

app.get('/', (req, res)=>{
    res.sendFile(process.cwd()+'/pages/index.html');
});
app.post('/', (req, res)=>{
    solve.solver(req, res);
});
app.use(router);

server.listen(process.env.PORT || port, ()=>{
    console.log("App runing on PORT : " + (process.env.PORT || port));
});