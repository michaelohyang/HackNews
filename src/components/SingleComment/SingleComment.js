import React from 'react'
import './stylesheet.scss';
import SingleCommentHead from '../SingleCommentHead/SingleCommentHead'
import Picture from '../Picture/Picture'

export default function SingleComment({src, firstName, lastName, time, commentText}) {
    return (
        <div className="SingleComment">
            <div className="profilePic">
                <Picture src= {src} userName=''/>
            </div>
            <div className="profileName">
                <SingleCommentHead firstName={firstName} lastName={lastName} time= {time} 
                    commentText = {commentText}/>
            </div>
        </div>
    )
}
