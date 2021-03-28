import React from 'react'
import './stylesheet.scss';

export default function Picture({src, userName}) {
    return (
        <div className="picture">
            <div className="image-cropper">
                <img src={src} className="rounded" />
            </div>
            <div className="userName">
                <p className="userName-text">{userName}</p>
            </div>
        </div>
    )
}
