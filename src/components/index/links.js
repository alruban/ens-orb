import React from 'react';
import { ReactSVG } from 'react-svg';

import iconBlockscan from '/src/svgs/icon-blockscan.svg';
import iconGit from '/src/svgs/icon-git.svg';

export default function Links() {
  return (
    <div className="sec-Author">
      <div className="sec-Author_Inner">
        <div className="sec-Author_Content">
          <div className="sec-Author_Links">
            <a className="sec-Author_Link" href="https://chat.blockscan.com/index">
              <ReactSVG
                src={ iconBlockscan }
                beforeInjection={(svg) => {
                  svg.classList.add("sec-Author_Icon")
                }}
              />
            </a>

            <p className="sec-Author_Text">
              <a href="https://etherscan.io">
                alruban.eth
              </a>
            </p>

            <a className="sec-Author_Link" href="https://github.com/alruban/ens-orb">
              <ReactSVG
                src={ iconGit }
                beforeInjection={(svg) => {
                  svg.classList.add("sec-Author_Icon")
                }}
              />
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}