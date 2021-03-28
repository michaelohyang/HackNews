import React from 'react'
import './stylesheet.scss';

export default function SingleCommentHead({firstName, lastName, time, commentText}) {
    return (
        <div className="SingleCommentHead">
            <div className="header">
                <span className="header-fname"><h4>{firstName}</h4></span>
                <span className="header-lname"><h4>{lastName}</h4></span>
                <span className="header-time"><p>{time}</p></span>
            </div>
            <div>
                <p className = "commentText">{commentText}</p>
            </div>
        </div>
    )
}
