import React, { Component } from 'react';
import './stylesheet.scss';
import {Image, Icon, Popup, Progress, Modal} from 'semantic-ui-react'
import moment from 'moment';
import { scaleLinear } from "d3-scale"
import CommentSection from '../CommentSection/CommentSection';

import * as firebase from 'firebase';

class Card extends Component {

    constructor(props) {
        super(props);
        this.state = {
            isUpvote: undefined,
            cardStyle: {width: '100%'},
            commentStyle: {width: '100%'},
            comments: [],
            open : false,
        }
    }

    handleIconClick = (isUpvote) => {
        this.setState({isUpvote: isUpvote});
        this.props.handleVote(this.props.link, isUpvote);
    };


    hoverInAnimation = () => {
        this.setState({...this.state, cardStyle: {width: '200%'}, commentStyle: {width: '0%'}});
    };

    hoverOutAnimation = () => {
        this.setState({...this.state, cardStyle: {width: '100%'}, commentStyle: {width: '100%'}});
    };

    componentDidUpdate(prevProps, prevState, snapshot) {
        const customScale = scaleLinear()
            .domain([1, 100])
            .range(['#FF0000','#00FF00']);

        let color = customScale(this.props.percent);

        let card = document.getElementById(this.props.link);
        if (!card) return;
        let bar = card.getElementsByClassName('bar')[0];
        bar.style.background = color;
    }

    componentDidMount() {

        let color = this.getColor();
        let card = document.getElementById(this.props.link);
        if (!card) return;
        let bar = card.getElementsByClassName('bar')[0];
        bar.style.background = color;

        firebase.database().ref(`comments/${this.stringify(this.props.link)}`).on('value', (snapshot) => {
            this.setState({comments: snapshot.val()});
        });

    }

    getColor = () => {
        const customScale = scaleLinear()
            .domain([1, 100])
            .range(['#FF0000','#00FF00']);

        let color = customScale(this.props.percent);
        return color;
    };

    setText = (text) => {
        const {sampleComments} = this.state;
        sampleComments.push(text);
        firebase.database().ref(`comments/${this.stringify(this.props.link)}`).set({
            sampleComments
        });
        this.setState({sampleComments});
    };

    stringify = (val) => {
        return val.replaceAll(':', '').replaceAll('.', '').replaceAll('/', '');
    };

    handleClick = () => {

    };

    handleOpen = () => {
        let {html, link} = this.props;
        this.setState({open: true}, () => {
            let iframe = document.getElementById(this.props.link + '-iframe');
            // console.log(iframe);
            // if (iframe) iframe.contentWindow.document.body.innerHTML = this.props.html;
            let timepast = false;
            setTimeout(function() {
                timepast = true;
            },500);

            if (iframe.attachEvent){
                iframe.attachEvent("onload", function(){
                    if(timepast) {
                        console.log("It's PROBABLY OK");
                    }
                    else {
                        console.log("It's PROBABLY NOT OK");
                        let newFrame = document.createElement('iframe');
                        console.log(newFrame);
                        iframe.parentElement.replaceChild(newFrame, iframe);
                        newFrame.contentWindow.document.body.innerHTML = html;
                        newFrame.className = 'frame';
                    }
                });
            }
            else {
                iframe.onload = function(){
                    if(timepast) {
                        console.log("It's PROBABLY OK");
                    }
                    else {
                        console.log("It's PROBABLY NOT OK");
                        let newFrame = document.createElement('iframe');
                        console.log(newFrame);
                        iframe.parentElement.replaceChild(newFrame, iframe);
                        newFrame.contentWindow.document.body.innerHTML = html;
                        newFrame.className = 'frame';
                    }
                };
            }
        });
    };

    render() {
        const {title, description, image, pubDate, link, upvotes, downvotes, percent, index} = this.props;
        const {isUpvote, open} = this.state;

        return (

                <div className="WholeNews">
                    <div data-id={title} id={link} className="Card" style={this.state.cardStyle}
                         onMouseEnter={this.hoverInAnimation} onMouseLeave={this.hoverOutAnimation}>
                        <Progress percent={percent} progress color="red"/>
                        <h3 style={{color: this.getColor()}} className="credibility">Credibility</h3>
                        <Popup
                            trigger={<Icon
                                style={isUpvote !== undefined && isUpvote ? {backgroundColor: 'palevioletred'} : {}}
                                onClick={() => this.handleIconClick(true)} className="down-icon" size='large'
                                name="chevron up"/>}
                            content={upvotes + ' Realvotes'}
                            inverted
                        />
                        <br/>
                        <br/>
                        <Popup
                            trigger={<Icon
                                style={isUpvote !== undefined && !isUpvote ? {backgroundColor: 'palevioletred'} : {}}
                                onClick={() => this.handleIconClick(false)} className="up-icon" size='large'
                                name="chevron down"/>}
                            content={downvotes + ' Fakevotes'}
                            inverted
                        />
                        <Modal
                            id={link + '-modal'}
                            onClose={() => this.setState({open: false})}
                            onOpen={() => this.handleOpen()}
                            open={open}
                            trigger={
                                <div className="hover-area" style={{cursor: 'pointer'}}>
                                <h3 onClick={this.handleClick} className="title">
                                    {title}
                                </h3>
                                <span className="text-date">{moment(new Date(pubDate)).fromNow()}</span>
                                <p className="text">
                                    <img className="img" src={image}/>
                                    {description}
                                </p>
                            </div>}>
                            <iframe className="frame" src={link} id={link+ '-iframe'}/>
                        </Modal>

                    </div>
                    <div className="CommentSection" style={this.state.commentStyle}>
                        <CommentSection
                            id={this.props.link}
                            index={index}
                        />
                    </div>
                </div>
        );

    }

}

export default Card