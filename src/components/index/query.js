import React from 'react';
import { gql, GraphQLClient } from 'graphql-request'

import placeholderText from './placeholder.js';
import Download from './download';
import Table from './table';

class Query extends React.Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);

    this.setCommas = this.setCommas.bind(this);
    this.setParser = this.setParser.bind(this);
    this.setLines = this.setLines.bind(this);

    this.unixTimeConverter = this.unixTimeConverter.bind(this);

    this.state = {
      originalQuery: [],
      delimiter: ',',
      wildcard: false,
      results: [],
      value: '',
      parse: false
    };
  }

  unixTimeConverter(unixTime) {
    const milliseconds = unixTime * 1000
    const dateObject = new Date(milliseconds)

    return dateObject;
  }

  setParser(event) {
    const parserButton = event.target;

    if (parserButton.hasAttribute("toggled")) {
      parserButton.removeAttribute("toggled");

      this.setState({
        parse: false
      });
    } else {
      parserButton.setAttribute("toggled", "");

      this.setState({
        parse: true
      });
    }
  }

  setCommas(event) {
    const delimiterButtonCommas = event.target;
    const delimiterButtonLines = document.querySelector("[data-delimiter-button='lines']");

    if (delimiterButtonLines.hasAttribute("toggled")) {
      delimiterButtonLines.removeAttribute("toggled");
    }

    delimiterButtonCommas.setAttribute("toggled", "");

    this.setState({
      delimiter: ','
    });
  }

  setLines(event) {
    const delimiterButtonLines = event.target;
    const delimiterButtonCommas = document.querySelector("[data-delimiter-button='commas']");

    if (delimiterButtonCommas.hasAttribute("toggled")) {
      delimiterButtonCommas.removeAttribute("toggled");
    }

    delimiterButtonLines.setAttribute("toggled", "");

    this.setState({
      delimiter: '\n'
    });
  }

  handleChange(event) {
    this.setState({
      value: event.target.value
    });
  }

  handleSubmit(event) {
    // Split the addresses with the chosen delimiter
    // TODO add a way for the user to choose the delimiter
    var addresses = this.state.value.split(this.state.delimiter);

    addresses.forEach((address, index) => {
      if (this.state.parse == true) {
        addresses[index] = address.normalize("NFD").replace(/[^-a-zA-Z0-9\u00a9\u00ae\u0300-\u036f\u2000-\u3300\ud83c\ud000-\udfff\ud83d\ud000-\udfff\ud83e\ud000-\udfff]/ig, "").replace(/ /g, "").replace(".eth","").toLowerCase();
      } else {
        addresses[index] = address.normalize("NFD").replace(/ /g, "").replace(".eth","").toLowerCase();
      }
    });

    // Filter all the addresses, check that no address is less than 3 characters in length
    // (ENS address begins at 3 characters), if it is, ignore that address and remove it from the array.
    addresses = addresses.filter(address =>
      !!address && address.length >= 3).reduce((accumulator, currentAddress) => {
        if(accumulator.indexOf(currentAddress) < 0) {
          accumulator.push(currentAddress);
        }

        return accumulator;
      }, []
    );

    this.setState({
      originalQuery: addresses
    });

    let results = [];

    // Query
    let isAddressAvailable = (name, callback) => {
      const endpoint = "https://api.thegraph.com/subgraphs/name/ensdomains/ens";

      const graphQLClient = new GraphQLClient(endpoint, {
        credentials: "*",
        mode: "cors"
      })

      const query = gql`
        query ($labelName: String!){
          registrations (where: {labelName: $labelName}) {
            cost
            domain {
              name
              owner {
                id
              }
            }
            registrationDate
            expiryDate
          }
        }
      `
      const variables =  {
        labelName: String(name)
      }

      graphQLClient.request(query, variables).then((data) => {
        callback()

        // Handle addresses that have never been registered before
        if (data.registrations[0] === undefined || data.registrations[0].length == 0) {
          // Handle empty data
          let addressCost = "";
          const addressName = name + ".eth";
          let addressStatus = "";
          const addressRegistration = "--";
          const addressExpiry = "--";

          // Handle Availability
          const filteredAddress = name.replace(/[^-a-zA-Z0-9\u00a9\u00ae\u0300-\u036f\u2000-\u3300\ud83c\ud000-\udfff\ud83d\ud000-\udfff\ud83e\ud000-\udfff]/ig, "");

          if (name.length != filteredAddress.length) {
            addressStatus = "invalid"
          } else {
            addressStatus = "available"
          }

          // Handle cost
          if (name.length == 3) {
            addressCost = "$640"
          } else if (name.length == 4) {
            addressCost = "$140"
          } else {
            addressCost = "$5"
          }

          // Compile filtered data
          results.push({
            address: addressName,
            availability: addressStatus,
            registration: addressRegistration.toLocaleString("en-GB", { hour12: false }),
            expiry: addressExpiry.toLocaleString("en-GB", { hour12: false }),
            cost: addressCost,
          })

          this.setState({
            results: results
          })
        } else {
          // Handle Name
          const addressName = data.registrations[0].domain.name;

          // Todays date
          const todaysDate = new Date();

          // Address date variables
          let addressStatus = "";

          const gracePeriod = 90;
          const premiumTimeframe = 28;

          // Handle address dates
          const addressRegistration = this.unixTimeConverter(data.registrations[0].registrationDate);
          const addressExpiry = this.unixTimeConverter(data.registrations[0].expiryDate);

          const addressGraceExpiry = new Date(addressExpiry);
          addressGraceExpiry.setDate(addressGraceExpiry.getDate() + gracePeriod)

          const addressPremiumExpiry = new Date(addressGraceExpiry);
          addressPremiumExpiry.setDate(addressPremiumExpiry.getDate() + premiumTimeframe)

          // Handle Availability
          const filteredAddress = name.replace(/[^-a-zA-Z0-9\u00a9\u00ae\u0300-\u036f\u2000-\u3300\ud83c\ud000-\udfff\ud83d\ud000-\udfff\ud83e\ud000-\udfff]/ig, "");

          if (name.length != filteredAddress.length) {
            addressStatus = "invalid"
          } else {
            if (addressGraceExpiry < todaysDate && addressPremiumExpiry > todaysDate) {
              addressStatus = "premium"
            } else if (todaysDate > addressPremiumExpiry) {
              addressStatus = "available"
            } else {
              addressStatus = "unavailable"
            }
          }

          // Handle Cost
          let addressCost = "";

          if (addressStatus == "available") {
            if (addressName.length == 3) {
              addressCost = "$640"
            } else if (addressName.length == 4) {
              addressCost = "$140"
            } else {
              addressCost = "$5"
            }
          } else if (addressStatus == "premium") {
            const currentPremium = 100000;
            const premiumTimeframeInMilliseconds = premiumTimeframe * 24 * 60 * 60 * 1000;
            const premiumCostByMillisecond = currentPremium / premiumTimeframeInMilliseconds;
            const msBetweenTodayPremium = (addressPremiumExpiry - todaysDate);

            addressCost = premiumCostByMillisecond * msBetweenTodayPremium;
            addressCost = "$" + addressCost.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2});

          } else {
            addressCost = "--"
          }

          // Compile filtered data
          results.push({
            address: addressName,
            availability: addressStatus,
            registration: addressRegistration.toLocaleString('en-GB', { hour12: false }),
            expiry: addressExpiry.toLocaleString('en-GB', { hour12: false }),
            cost: addressCost
          })

          this.setState({
            results: results
          })
        }
      })
    }

    // Function that will run through the provided addresses, querying
    // them one by one, and producing a table row for each valid response.
    let runSearch = (index, callback) => {
      const address = addresses[index];

      if (!address) return callback();

      isAddressAvailable(address, isAvailable => {
      runSearch(++index, callback);
      });
    };

    runSearch(0, () => {
      return
    });

    event.preventDefault();
  }

  render() {
    return (
      <>
      <div className='sec-Query_Controls'>
        <div className="sec-Query_Parsers">
        </div>
        <div className="sec-Query_Delimiters">
          <input
            className='sec-Query_Delimiter'
            toggled="true" // Default Choice
            onClick={ this.setCommas }
            data-delimiter-button="commas"
            type="button"
            value="Comma"
          />

          <input
            className='sec-Query_Delimiter'
            onClick={ this.setLines }
            data-delimiter-button="lines"
            type="button"
            value="New Line"
          />
        </div>
        <div className="sec-Query_Parsers">
          <input
            className='sec-Query_Parser'
            onClick={ this.setParser }
            data-delimiter-button="lines"
            type="button"
            value="Remove Invalid Characters"
          />
        </div>
        </div>
        <div className="sec-Query_Query">
          <form className="sec-Query_Form sec-Query_Form-entry" onSubmit={ this.handleSubmit }>
            <textarea
              value={ this.state.value }
              onChange={ this.handleChange }
              spellCheck="false"
              placeholder={ placeholderText() }
            />
            <div className='sec-Query_Tools'>
              <input className="sec-Query_Button" type="submit" value="Submit" />
              <Download
                data = { this.state.results }
                originalQuery = { this.state.originalQuery }
              />
            </div>
          </form>
        </div>

        <div className="sec-Query_Response">
          <Table
            data = { this.state.results }
            columns = {[
                {
                  Header: 'Address',
                  headerClassName: 'sec-Query_TableHeader sec-Query_TableHeader-address',
                  accessor: 'address',
                  dataClassName: 'sec-Query_TableData sec-Query_TableData-address',
                  Cell: ({ value }) => <a href={'https://app.ens.domains/name/' + value + '/register'}>{ value }</a>
                },
                {
                  Header: 'Registration Date',
                  headerClassName: 'sec-Query_TableHeader sec-Query_TableHeader-registration',
                  accessor: 'registration',
                  dataClassName: 'sec-Query_TableData sec-Query_TableData-registration',
                  Cell: ({ row, value }) => <a href={'https://app.ens.domains/name/' + row.original.address + '/register'}> { value } </a>,
                  disableSortBy: true
                },
                {
                  Header: 'Expiry Date',
                  headerClassName: 'sec-Query_TableHeader sec-Query_TableHeader-expiry',
                  accessor: 'expiry',
                  dataClassName: 'sec-Query_TableData sec-Query_TableData-expiry',
                  Cell: ({ row, value }) => <a href={'https://app.ens.domains/name/' + row.original.address + '/register'}>{ value }</a>,
                  disableSortBy: true
                },
                {
                  Header: 'Availability',
                  headerClassName: 'sec-Query_TableHeader sec-Query_TableHeader-availability',
                  accessor: 'availability',
                  dataClassName: 'sec-Query_TableData sec-Query_TableData-available',
                  Cell: ({ row, value }) => {
                    return (
                      <a href={'https://app.ens.domains/name/' + row.original.address + '/register'}>
                        <div className="sec-Query_TableData-availability" data-address-availability={ value }></div>
                      </a>
                    )
                  }
                },
                {
                  Header: 'Cost',
                  headerClassName: 'sec-Query_TableHeader sec-Query_TableHeader-cost',
                  accessor: 'cost',
                  dataClassName: 'sec-Query_TableData sec-Query_TableData-cost',
                  Cell: ({ row, value }) => <a href={`https://app.ens.domains/name/${ row.original.address }.eth/register`}>{ value }</a>,
                  sortMethod: (a, b) => Number(a)-Number(b)
                }
              ]
            }
          />
        </div>
      </>
    );
  }
}

export default Query;