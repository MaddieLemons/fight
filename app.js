const express = require("express")
const app = express()
const cors = require("cors")
const helmet = require("helmet")
const port = 4000
const morgan = require("morgan")
const path = require("path")
const fs = require('fs')


app.use(helmet())
app.use(cors())

app.use(express.urlencoded({extended: true}))
app.use(express.json())

app.use(express.static(path.join(__dirname, "public")))

app.use(morgan("common"))

app.get("/photo/:name", (req, res) => {

    const oldUrls = req.query.currentUrls;
    let newUrl;

    while(true){
        const files = fs.readdirSync(`./public/photos/${req.params.name}`);
        const randomIndex = Math.floor(Math.random() * files.length)
        newUrl= `photos/${req.params.name}/${files[randomIndex]}`
        console.log(files);
        if(!oldUrls.includes(newUrl)){
            break
        }
    }
    
    console.log(`\n\n\n NEW URL: ${newUrl}`)

    res.json({
        "url": newUrl
    })
})

app.get("/characters", (req, res) => {
    const characters = fs.readdirSync('./public/photos');
    res.json({
        "characters": JSON.stringify(characters)
    })
})


console.log(`Server is listening at port ${port}`)
app.listen(port)
