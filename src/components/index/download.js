import React from 'react';

import { CSVLink } from "react-csv";

function Download({ data, originalQuery }) {
  const todaysDate = new Date().toLocaleString('en-US', { hour12: false });

  if (!originalQuery.length == 0) {
    if (data.length == originalQuery.length) {
      return (
        <div className="sec-Query_Download" ready="true">
          <CSVLink
            data={data}
            filename={"ENS.ORB.EXPORT_" + todaysDate + ".csv"}
            >
            Download
          </CSVLink>
        </div>
      )
    } else {
      return (
        <div className="sec-Query_Download" ready="loading">
          <span href="#">
            Loading...
          </span>
        </div>
      )
    }
  } else {
    return (
      <div className="sec-Query_Download" ready="false">
        <span href="#">
          Download
        </span>
      </div>
    )
  }
}

export default Download