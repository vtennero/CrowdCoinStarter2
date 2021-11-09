import React from 'react';
import { Container } from 'semantic-ui-react';
// import Head from 'next/head';
import Header from './Header';

const Layout = (props) => {
    return (
        <Container>
            <Header/>
            {props.children}
        </Container>
    );
};
export default Layout;