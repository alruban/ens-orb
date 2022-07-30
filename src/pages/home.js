import React from 'react';

import Layout from '../layouts/layout';
import Query from '../components/index/query';
import Links from '../components/index/links';

const Index = () => (
  <Layout>
    <Links/>
    <section className="sec-Query">
      <div className="sec-Query_Inner">
        <header className="sec-Query_Header">
          <h3 className="sec-Query_Title">
            orb
          </h3>

          <h6 className="sec-Query_Subtitle">
            A bulk query application for the Ethereum Name Service network.
          </h6>

          <p className="sec-Query_Description">
            Choose the relevant delimiter, and then just paste the list of names that you want to query into the terminal below.
          </p>
        </header>
        <div className="sec-Query_Body">
          <Query />
        </div>
      </div>
    </section>
  </Layout>
);

export default Index;