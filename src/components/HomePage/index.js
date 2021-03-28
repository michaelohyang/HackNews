import React, { Component } from 'react';
import './stylesheet.scss';
import { Search, Grid, Header, Segment, Menu, Button, Image } from 'semantic-ui-react'
import {MenuCustom} from "../index";
import {Card} from '../index'
import logo from '../Images/Hack_News_Logo.png'

import * as firebase from 'firebase';


const CORS = "https://cors-anywhere.herokuapp.com/";
const NEWS_API = 'https://news.google.com/rss/search?q=';

const GOOGLE_SEARCH_IMAGE_META = 'og:image';
const GOOGLE_SEARCH_DESCRIPTION_META = 'og:description';

const USE_LOCAL = false;


var data = require('./data.json');

class HomePage extends Component {

    constructor(props) {
        super(props);
        this.state = {
            activeItem: '😊',
            newsArticles: [],
            text: '',
            votes: {},
            results: [],
            fireBaseVotes: {},
        }
    }

    handleItemClick = (e, { name }) => this.setState({ activeItem: name });


    componentDidMount() {

        const {newsArticles} = this.state;
        for (var i = 0; i < data.length; i++) {
            let currentItem = data[i];

            let div = document.createElement('div');
            div.innerHTML = currentItem.data;


            let metaTags = div.getElementsByTagName('meta');
            var description = "EMPTY";
            var image = '';
            for (var j = 0; j < metaTags.length; j++) {
                let tag = metaTags[j];
                let property = tag.getAttribute('property');
                let name = tag.getAttribute('name');
                if (property === GOOGLE_SEARCH_DESCRIPTION_META
                    || name === GOOGLE_SEARCH_DESCRIPTION_META) {
                    description = tag.content;
                } else if (property === GOOGLE_SEARCH_IMAGE_META
                    || name === GOOGLE_SEARCH_IMAGE_META) {
                    image = tag.content;
                }
            }


            let dataObj = {
                html: currentItem.data,
                title: currentItem.title,
                link: currentItem.link,
                pubDate: currentItem.pubDate,
                description: currentItem.description,
                image,
                descriptionFetched: description,
            };

            newsArticles.push(dataObj);
        }

        const results = newsArticles.map(article => ({
            "description" : article.title,
            "image" : article.image,
        }));
        this.setState({newsArticles, results});

        this.fetchVotes();

        this.updateVotes();
        this.manipulateDom();
    }

    manipulateDom = () => {
        // let tag = document.getElementsByClassName('CommentSection');
        // for (var i = 0; i < tag.length; i++) {
        //     tag[i].scrollTop = tag[i].scrollHeight;
        // }
    };

    componentDidUpdate(prevProps, prevState, snapshot) {
        this.manipulateDom();
    }

    fetchVotes = () => {
        firebase.database().ref('json').on('value', (snapshot) => {
            let data = snapshot.val();
            let dict = data ? JSON.parse(data) : {};
            console.log(dict);
            this.setState({fireBaseVotes: dict});
        });
    };

    handleSearchChange = (e, { value }) => {
        var {newsArticles, results} = this.state;
        this.setState({text: value});
        results = newsArticles.filter(article => article.title.toLowerCase().includes(value.toLowerCase()) || article.descriptionFetched.toLowerCase().includes(value.toLowerCase())).map(article => ({
                "description" : article.title,
                "image" : article.image,

        }));

        this.setState({results});
    };

    handleSearch = () => {
        const {newsArticles} = this.state;
    };

    handleVote = (url, isUpvote) => {
        const {fireBaseVotes} = this.state;
        let votes = localStorage[url] ? Number.parseInt(localStorage[url]) : 0;
        votes += (isUpvote ? 1 : -1);
        localStorage[url] = votes;

        let upvotes = isUpvote ? 1 : 0;
        let downvotes = !isUpvote ? 1 : 0;


        localStorage[url + '-upvotes'] = localStorage[url + '-upvotes'] ? Number.parseInt(localStorage[url + '-upvotes']) + upvotes : upvotes;
        localStorage[url + '-downvotes'] = localStorage[url + '-downvotes'] ? Number.parseInt(localStorage[url + '-downvotes'])  + downvotes : downvotes;

        let stringifyUrl = this.stringify(url);
        fireBaseVotes[stringifyUrl + '-upvotes'] = fireBaseVotes[stringifyUrl + '-upvotes'] ? fireBaseVotes[stringifyUrl + '-upvotes'] + upvotes : upvotes;
        fireBaseVotes[stringifyUrl + '-downvotes'] = fireBaseVotes[stringifyUrl + '-downvotes'] ? fireBaseVotes[stringifyUrl + '-downvotes'] + downvotes : downvotes;

        console.log(fireBaseVotes);
        firebase.database().ref('json').set(JSON.stringify(fireBaseVotes));

        this.setState({fireBaseVotes});

        this.updateVotes();
    };

    updateVotes = () => {
        const {votes, newsArticles} = this.state;
        newsArticles.forEach((article) => {
            votes[article.link] = localStorage[article.link] ? Number.parseInt(localStorage[article.link]) : 0;
            votes[article.link + '-upvotes'] = localStorage[article.link + '-upvotes'] ? Number.parseInt(localStorage[article.link + '-upvotes']) : 0;
            votes[article.link + '-downvotes'] = localStorage[article.link + '-downvotes'] ? Number.parseInt(localStorage[article.link + '-downvotes']) : 0;
        });
        this.setState({votes});
    };

    handleResultSelect = (e, data) => {
        let description = data.result.description;
        let elements = document.getElementsByClassName('Card');
        for (var i = 0; i < elements.length; i++) {
            if (elements[i].dataset['id'] === description) {
                console.log('found');
                elements[i].scrollIntoView();
            }
        }
    };

    stringify = (val) => {
        return val.replaceAll(':', '').replaceAll('.', '').replaceAll('/', '');
    };


    render() {
        var {activeItem, newsArticles, votes, results, text, fireBaseVotes} = this.state;

        console.log(results);
        console.log(fireBaseVotes);

        newsArticles = newsArticles.sort((a, b) => {
            let upvotes = fireBaseVotes[this.stringify(a.link) + '-upvotes'] || 0;
            let downvotes = fireBaseVotes[this.stringify(a.link) + '-downvotes'] || 0;

            let percentA = upvotes / (upvotes + downvotes + 1);
            console.log(percentA);

            let upvotesB = fireBaseVotes[this.stringify(b.link) + '-upvotes'] || 0;
            let downvotesB = fireBaseVotes[this.stringify(b.link) + '-downvotes'] || 0;

            let percentB = upvotesB / (upvotesB + downvotesB + 1);
            console.log(percentB);

           return percentB - percentA;
        });


       let data = newsArticles.map((article, ind) => {
           let upvotes = fireBaseVotes[this.stringify(article.link) + '-upvotes'] || 0;
           let downvotes = fireBaseVotes[this.stringify(article.link) + '-downvotes'] || 0;

           let percent = Math.round(100 * upvotes / (upvotes + downvotes + 1));
           return (
               <Card
                   html={article.html}
                   percent={percent}
                   title={article.title}
                   description={article.descriptionFetched.replace(/[\u{0080}-\u{FFFF}]/gu,"")}
                   image={article.image}
                   pubDate={article.pubDate}
                   link={article.link}
                   upvotes={fireBaseVotes[this.stringify(article.link) + '-upvotes'] || 0}
                   downvotes={fireBaseVotes[this.stringify(article.link) + '-downvotes'] || 0}
                   handleVote={this.handleVote}
                   index={ind}
               />

           )
       });

        return (
            <div className="HomePage">
                <h3 className="title">HackNews</h3>
                <p className="home-quote">"News for the people. Chosen by the people."</p>
                <Image className="image-header" src={logo}/>
                <Search
                    value={text}
                    loading={false}
                    results={results}
                    onResultSelect={(e, data) => this.handleResultSelect(e, data)}
                    onSearchChange={this.handleSearchChange}
                    className="search"/>
                    <br/>
                    <br/>
                {/*<Button className="button-og" onClick={this.handleSearch}>Search</Button>*/}
                <br/>
                <br/>
                {data}
            </div>
        )
    }
}

export default HomePage