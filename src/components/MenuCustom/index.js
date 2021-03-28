import React, { Component } from 'react';
import './stylesheet.scss';
import {Menu} from 'semantic-ui-react';

class MenuCustom extends Component {

    constructor(props) {
        super(props);
        this.state = {
            activeItem: '😊'
        }
    }

    handleItemClick = (e, { name }) => this.setState({ activeItem: name });

    render() {

        const {activeItem} = this.props;
        return (
            <div className="MenuCustom">
                <Menu pointing secondary>
                    <Menu.Item
                        style={{fontSize: '22px'}}
                        name='😊'
                        active={activeItem === '😊'}
                        onClick={this.props.handleTabChange}
                    />
                    <Menu.Item
                        style={{fontSize: '22px'}}
                        name='😥'
                        active={activeItem === '😥'}
                        onClick={this.props.handleTabChange}
                    />
                    <Menu.Item
                        style={{fontSize: '22px'}}
                        name='😠'
                        active={activeItem === '😠'}
                        onClick={this.props.handleTabChange}
                    />
                        <Menu.Item
                            style={{fontSize: '22px'}}
                            name='😂'
                            active={activeItem === '😂'}
                            onClick={this.props.handleTabChange}
                        />
                </Menu>
            </div>
        )
    }

}

export default MenuCustom