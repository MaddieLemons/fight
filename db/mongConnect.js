const mongoose = require('mongoose');
mongoose.connect('mongodb+srv://fieuline:fqUSDW8wWj3ypeCG@cluster0.5fg90.mongodb.net/myFirstDatabase?retryWrites=true&w=majority', {useNewUrlParser: true, useUnifiedTopology: true, connectTimeoutMS: 30000});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connect error:'));
db.once('open', () => {
    console.log("You are connected.")
});


const fighter = new Fighter({ name: 'Fieuline', team: "Fieuline" })

fighter.save((err, fieu) => {
    if (err) return console.error(err);
    console.log(`${fieu.name} was added to the database`);
})


