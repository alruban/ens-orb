import React from 'react';
import PropTypes from 'prop-types';
import { Helmet, HelmetProvider } from 'react-helmet-async';

import manifestJSON from '/src/json/manifest.json';
import browserconfigXML from '/src/xml/browserconfig.xml';

import faviconICO from '/src/favicons/favicon.ico';

import favicon16x from '/src/favicons/favicon-16x16.png';
import favicon32x from '/src/favicons/favicon-32x32.png';
import favicon96x from '/src/favicons/favicon-96x96.png';

import faviconMs70x from '/src/favicons/ms-icon-70x70.png';
import faviconMs144x from '/src/favicons/ms-icon-144x144.png';
import faviconMs150x from '/src/favicons/ms-icon-150x150.png';
import faviconMs310x from '/src/favicons/ms-icon-310x310.png';

import faviconAppleIcon from '/src/favicons/apple-icon.png';
import faviconApplePrecomposed from '/src/favicons/apple-icon.png';

import faviconApple57x from '/src/favicons/apple-icon-57x57.png';
import faviconApple60x from '/src/favicons/apple-icon-60x60.png';
import faviconApple72x from '/src/favicons/apple-icon-72x72.png';
import faviconApple76x from '/src/favicons/apple-icon-76x76.png';
import faviconApple114x from '/src/favicons/apple-icon-114x114.png';
import faviconApple120x from '/src/favicons/apple-icon-120x120.png';
import faviconApple144x from '/src/favicons/apple-icon-144x144.png';
import faviconApple152x from '/src/favicons/apple-icon-152x152.png';
import faviconApple180x from '/src/favicons/apple-icon-180x180.png';

import faviconAndroid36x from '/src/favicons/android-icon-36x36.png';
import faviconAndroid48x from '/src/favicons/android-icon-48x48.png';
import faviconAndroid72x from '/src/favicons/android-icon-72x72.png';
import faviconAndroid96x from '/src/favicons/android-icon-96x96.png';
import faviconAndroid144x from '/src/favicons/android-icon-144x144.png';
import faviconAndroid192x from '/src/favicons/android-icon-192x192.png';

import Analytics from 'analytics'
import googleAnalytics from '@analytics/google-analytics'

const analytics = Analytics({
  app: 'portfolio',
  plugins: [
    googleAnalytics({
      measurementIds: ["G-HT167JXW2D"]
    })
  ]
});

/* Track a page view */
analytics.page();

const Layout = (props) => (
  <HelmetProvider>
    <Helmet>
      <meta http-equiv="X-UA-Compatible" content="IE=edge"/>
      <meta http-equiv="content-type" content="text/html;charset=utf-8"/>

      <link rel="canonical" href="https://www.ens.orb"/>

      <title>Orb | ENS Bulk Queries</title>

      <meta name="author" content="alruban.eth"/>
      <meta property="og:title" content="Orb | ENS Bulk Queries"/>
      <meta name="description" content="A bulk query application for the Ethereum Name Service Network"/>
      <meta name="keywords" content="ENS, Ethereum, Name, Service, Ethereum Name Service, Domains, Bulk, Query, Sell, Markets"/>

      <meta id="viewport" name="viewport" content="width=device-width, initial-scale=1.0"/>

      <link rel="icon" type="image/x-icon" href={ faviconICO }/>
      <link rel="icon" type="image/png" sizes="16x16" href={ favicon16x }/>
      <link rel="icon" type="image/png" sizes="32x32" href={ favicon32x }/>
      <link rel="icon" type="image/png" sizes="96x96" href={ favicon96x }/>

      <link rel="apple-touch-icon" href={ faviconAppleIcon }/>
      <link rel="apple-touch-icon" sizes="57x57" href={ faviconApple57x }/>
      <link rel="apple-touch-icon" sizes="60x60" href={ faviconApple60x }/>
      <link rel="apple-touch-icon" sizes="72x72" href={ faviconApple72x }/>
      <link rel="apple-touch-icon" sizes="76x76" href={ faviconApple76x }/>
      <link rel="apple-touch-icon" sizes="114x114" href={ faviconApple114x }/>
      <link rel="apple-touch-icon" sizes="120x120" href={ faviconApple120x }/>
      <link rel="apple-touch-icon" sizes="144x144" href={ faviconApple144x }/>
      <link rel="apple-touch-icon" sizes="152x152" href={ faviconApple152x }/>
      <link rel="apple-touch-icon" sizes="180x180" href={ faviconApple180x }/>
      <link rel="apple-touch-icon-precomposed" href={ faviconApplePrecomposed }/>

      <link rel="icon" type="image/png" sizes="36x36" href={ faviconAndroid36x }/>
      <link rel="icon" type="image/png" sizes="48x48" href={ faviconAndroid48x }/>
      <link rel="icon" type="image/png" sizes="72x72" href={ faviconAndroid72x }/>
      <link rel="icon" type="image/png" sizes="96x96" href={ faviconAndroid96x }/>
      <link rel="icon" type="image/png" sizes="144x144" href={ faviconAndroid144x }/>
      <link rel="icon" type="image/png" sizes="192x192" href={ faviconAndroid192x }/>

      <link rel="manifest" href={ manifestJSON }/>

      <meta name="theme-color" content="#f1f4f7"/>
      <meta name="msapplication-TileColor" content="#f1f4f7"/>
      <meta name="msapplication-config" content={ browserconfigXML }/>

      <meta name="msapplication-TileImage" content={ faviconMs70x }/>
      <meta name="msapplication-TileImage" content={ faviconMs144x }/>
      <meta name="msapplication-TileImage" content={ faviconMs150x }/>
      <meta name="msapplication-TileImage" content={ faviconMs310x }/>
    </Helmet>
    <div id="wrapper">
      <div id="main">
        {props.children}
      </div>
    </div>
  </HelmetProvider>
);

Layout.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]),
  fullPage: PropTypes.bool,
  title: PropTypes.string,
  description: PropTypes.string,
};

export default Layout;