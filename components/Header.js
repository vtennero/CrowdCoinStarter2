import React from 'react';
import { Menu } from 'semantic-ui-react';
import { Link } from '../routes';
import 'semantic-ui-css/semantic.min.css';


const Menu_render = (props) => {
    return (
        <Menu style = {{ marginTop: '10px' }}>
            <Menu.Item>
            <Link route="/">
                <a className='item'>CrowdCoin</a>
            </Link>
            </Menu.Item>
            <Menu.Menu position="right">
                <Menu.Item>
                <Link route="/">
                <a className='item'>Campaigns</a>
            </Link></Menu.Item>
                <Menu.Item>
                <Link route="/campaigns/new">
                <a className='item'>+</a>
                    
                </Link></Menu.Item>
            </Menu.Menu>

        </Menu>
    );
};

export default Menu_render;
