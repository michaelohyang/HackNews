import React from 'react'
import Picture from '../Picture/Picture'
import './stylesheet.scss';
import { Form, TextArea, Button } from 'semantic-ui-react'

export default function CommentInputForm({src, firstName, params, onParamChange, onPostChange}) {
    return (
        <div className='input-form'>
            <div className="profilePic">
                <Picture src= {src} userName={firstName}/>
            </div>
            <div className="real-form">
                <Form onSubmit={onPostChange}>
                <Form.Field
                    className='form-input'
                    control={TextArea}
                    name="comment"
                    value = {params.comment}
                    onChange = {onParamChange}
                    label='Your comment'
                    placeholder='Add a comment...'
                />
                <Form.Field className='form-button' control={Button}>Post</Form.Field>
                </Form>
            </div>
        </div>
    )
}
