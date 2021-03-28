import React, {useState, useEffect} from 'react'
import './stylesheet.scss';
import SingleComment from '../SingleComment/SingleComment'
import CommentInputForm from '../CommentInputForm/CommentInputForm'
import textImage1 from '../Images/textImage1.jpg'
import textImageMichael from '../Images/Michael.jpg'
import textImagePeggy from '../Images/peggy.jpg'
import textImageYukt from  '../Images/Yukt.jpg'
import textImageKevin from '../Images/Kevin.jpg'

import {Segment, Divider} from 'semantic-ui-react'
import * as firebase from 'firebase';

const RANDOM_COMMENTS = ["Love the use of investigative journalism", "Wow, I cant believe this is happening today", "Love this", "Keep up the good work",
    "C'mon, I dont believ this", "This is egregious!", "Nice nice", "This is terrible", "yEEE Hawww", "wassup guys", "why you post this?",
    "who?"];

const RANDOM_NAMES = ['Michael', 'Kevin', 'Yukt', 'Peggy'];

const nameToImage = {'Michael': textImageMichael, 'Kevin': textImageKevin, 'Yukt': textImageYukt, 'Peggy': textImagePeggy};

const nums = [Math.floor(Math.random() * Math.floor(RANDOM_COMMENTS.length)),
    Math.floor(Math.random() * Math.floor(RANDOM_COMMENTS.length)),
    Math.floor(Math.random() * Math.floor(RANDOM_COMMENTS.length))];

const hours = [Math.floor(Math.random() * 10), Math.floor(Math.random() * 10), Math.floor(Math.random() * 10)];

const names = [Math.floor(Math.random() * RANDOM_NAMES.length), Math.floor(Math.random() * RANDOM_NAMES.length), Math.floor(Math.random() * RANDOM_NAMES.length)];


export default function CommentSection(props) {
    const [sampleComments, setSampleComments] = useState(['This is great', 'Good', 'Fake']);
    const [params, setParams] = useState({comment: ""});

    const stringify = (val) => {
        return val.replaceAll(':', '').replaceAll('.', '').replaceAll('/', '');
    }; 

    const getText = () => {
        firebase.database().ref(`comments/${stringify(props.id)}`).on('value', (snapshot) => {
            setSampleComments(snapshot.val().sampleComments);
        });
    };

    const setText = (text) => {
        if (text == "") return;
        sampleComments.push(text);
        setSampleComments(sampleComments);
        firebase.database().ref(`comments/${stringify(props.id)}`).set({
            sampleComments
        });
    };

    function handleParamChange(e) {
        const param = e.target.name;
        const value = e.target.value;
        setParams(prevParams => {
          return {[param]: value}
        })
    }

    function handlePostChange() {
        getText();
        setText(params.comment);
        setParams({comment: ""})
    }

    const bigInd = props.index + 1;


    return (
        <div className = "bigger-comment">
            <h2>Comments</h2>
            <div className="CommentSection">
                {sampleComments.map((comment, index) => {
                    let name = RANDOM_NAMES[((index + 1) * bigInd) % RANDOM_NAMES.length];
                    return <div>
                        <SingleComment 
                        src = {nameToImage[name]} firstName={name}
                        lastName="" time={hours[((index + 1) * bigInd) % hours.length] + 1 + 'hr'}
                        commentText= {RANDOM_COMMENTS[((index + 1) * bigInd) % RANDOM_COMMENTS.length]}
                        />
                        <Divider section />
                        </div>
                })
            }
            <CommentInputForm src = {textImagePeggy} firstName={"Peggy"} params={params} onParamChange={handleParamChange} onPostChange={handlePostChange}/>
            </div>
         </div>
    )
}
