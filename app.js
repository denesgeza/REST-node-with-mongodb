//jshint esversion: 6

//////////////////////////////IMPORTS//////////////////////////////////////////////////
const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const mongoose = require('mongoose');
const app = express();

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

///////////////////////////////DATABASE////////////////////////////////////////////////
mongoose.connect('mongodb://localhost:27017/wikiDB', { useNewUrlParser: true });
const articleSchema = new mongoose.Schema({
    title: String,
    content: String,
});
const Article = mongoose.model('Article', articleSchema);

////////////////////////ADD INITIAL ARTICLES/////////////////////////////////////////
const item1 = new Article({
    title: 'REST',
    content: 'REST is short for REpresentational State Transfer. It is a architectural style for building web applications.'
});
const item2 = new Article({
    title: 'Bootstrap',
    content: 'This is a framework developed by Twitter. It is a CSS framework that is used to create responsive web pages.'
});
const item3 = new Article({
    title: 'DOM',
    content: 'The Document Object Model is an API for interacting with our HTML documents. It is a programming interface for HTML documents.'
});

const defaultItems = [item1, item2, item3];

Article.insertMany(defaultItems, function (err) {
    if (!err) {
        console.log('Added to the database.');
    } else {
        console.log(err);
    }
});

/////////////////////////////ALL ARTICLES////////////////////////////////////////////
app.route('/articles')

    .get((req, res) => {
    Article.find(function(err, foundArticles) {
        if (!err) {
            res.send(foundArticles); // sends the data in a json format
        } else {
            res.send(err);
        }
    });
})
    .post((req, res) => {
    const newArticle = new Article({
        title: req.body.title,
        content: req.body.content,
    });
    newArticle.save(function(err) {
        if (!err) {
            res.send('Successfully added a new article.');
        } else {
            res.send(err);
        }
    });
})
    .delete((req, res) => {
    Article.deleteMany(function(err) {
        if (!err) {
            res.send('Successfully deleted all articles.');
        } else {
            res.send(err);
        }
    });
});

/////////////////////////////SPECIFIC ARTICLE////////////////////////////////////////////
app.route('/articles/:articleTitle')

    .get((req, res) => {
    Article.findOne({ title: req.params.articleTitle }, function(err, foundArticle) {
        if (!err) {
            res.send(foundArticle); // sends the data in a json format
        } else {
            res.send('No articles match found');
        }
    });
})
    .put((req, res) => {
    Article.findOneAndUpdate(
        { title: req.params.articleTitle },
        { title: req.body.title, content: req.body.content },
        { overwrite: true },
        function(err) {
            if (!err) {
                res.send('Successfully updated article.');
            } else {
                res.send(err);
            }
        }
    );
})
    .patch((req, res) => {
    Article.updateOne(
        { title: req.params.articleTitle },
        { $set: req.body },
        function(err) {
            if (!err) {
                res.send('Successfully patched the article.');
            } else {
                res.send(err);
            }
        }
    );
})
    .delete((req, res) => {
    Article.deleteOne(
        { title: req.params.articleTitle },
        function(err) {
            if (!err) {
                res.send('Successfully deleted article.');
            } else {
                res.send(err);
            }
        }
    );
});

app.listen(3000, function () {
    console.log('Server started on port 3000');
});
