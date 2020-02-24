import React, { Component, Fragment } from "react";
import Header from "../Header/Header";
import "./App.css";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeSuggestion: 0,
      filteredSuggestions: [],
      showSuggestions: false,
      userInput: "",
      loading: false,
      guid: "b6242120-5bce-4b10-9839-d3045a7682da",
      disabled: false,
      selectedEntity: {}
    };
  }

  onChange = e => {
    const userInput = e.currentTarget.value;
    if (userInput && userInput.length > 2) {
      const { guid } = this.state;
      let fetchAbnDetails = false;
      let filteredSuggestions = [];
      let regex = /^[0-9]*$/gm;
      if (userInput.match(regex)) {
        fetchAbnDetails = true;
      }
      let fetchUrl =
        "https://abr.business.gov.au/json/MatchingNames.aspx?name=" +
        userInput +
        "&maxResults=10&callback=callback&guid=" +
        guid;

      if (fetchAbnDetails) {
        fetchUrl =
          "https://abr.business.gov.au/json/AbnDetails.aspx?abn=" +
          userInput +
          "&callback=callback&guid=" +
          guid;
      }

      this.setState({
        loading: true,
        userInput,
        disabled: true,
        selectedEntity: {}
      });
      return fetch(fetchUrl)
        .then(resp => resp.text())
        .then(
          result => {
            try {
              result = result.replace("callback(", "").replace(/\)/g, "");
              result = JSON.parse(result);
              if (!fetchAbnDetails) {
                filteredSuggestions = result["Names"].filter(suggestion => {
                  return (
                    suggestion["Name"]
                      .toLowerCase()
                      .indexOf(userInput.toLowerCase()) > -1
                  );
                });
              } else {
                result && result.Abn && filteredSuggestions.push(result);
              }
              this.setState({
                activeSuggestion: 0,
                filteredSuggestions,
                showSuggestions: true,
                userInput,
                loading: false,
                disabled: false,
                selectedEntity: {}
              });
              this.nameInput.focus();
            } catch (e) {
              console.log(e);
              this.setState({
                activeSuggestion: 0,
                filteredSuggestions: [],
                showSuggestions: true,
                userInput,
                loading: false,
                disabled: false,
                selectedEntity: {}
              });
              this.nameInput.focus();
            }
          },
          error => {
            console.log(error);
            this.setState({
              activeSuggestion: 0,
              filteredSuggestions: [],
              showSuggestions: true,
              userInput,
              loading: false,
              disabled: false,
              selectedEntity: {}
            });
            this.nameInput.focus();
          }
        );
    } else {
      this.setState({
        userInput,
        disabled: false,
        selectedEntity: {}
      });
    }
  };

  onClick = suggestion => {
    this.setState({
      activeSuggestion: 0,
      filteredSuggestions: [],
      showSuggestions: false,
      userInput: suggestion["Name"]
        ? suggestion["Name"]
        : suggestion["EntityName"],
      loading: false,
      selectedEntity: suggestion
    });
  };

  onKeyDown = e => {
    const { activeSuggestion, filteredSuggestions } = this.state;

    if (e.keyCode === 13) {
      this.setState({
        activeSuggestion: 0,
        showSuggestions: false,
        userInput: filteredSuggestions[activeSuggestion].Name,
        loading: false
      });
      this.onClick(filteredSuggestions[activeSuggestion]);
    } else if (e.keyCode === 38) {
      if (activeSuggestion === 0) {
        return;
      }

      this.setState({ activeSuggestion: activeSuggestion - 1 });
    } else if (e.keyCode === 40) {
      if (activeSuggestion - 1 === filteredSuggestions.length) {
        return;
      }

      this.setState({ activeSuggestion: activeSuggestion + 1 });
    }
  };

  render() {
    const {
      onChange,
      onClick,
      onKeyDown,
      state: {
        activeSuggestion,
        filteredSuggestions,
        showSuggestions,
        userInput,
        loading,
        disabled,
        selectedEntity
      }
    } = this;
    let suggestionsListComponent;

    if (showSuggestions && userInput) {
      if (filteredSuggestions.length) {
        suggestionsListComponent = (
          <ul className="suggestions">
            {filteredSuggestions.map((suggestion, index) => {
              let className;

              // Flag the active suggestion with a class
              if (index === activeSuggestion) {
                className = "suggestionActive";
              }

              return (
                <li
                  className={className}
                  key={index}
                  onClick={() => onClick(suggestion)}
                >
                  {suggestion["Name"]
                    ? suggestion["Name"]
                    : suggestion["EntityName"]}
                </li>
              );
            })}
          </ul>
        );
      } else {
        suggestionsListComponent = (
          <div className="noSuggestions">
            <em>No suggestions found.</em>
          </div>
        );
      }
    }

    return (
      <Fragment>
        <Header />
        <div className="wrapper">
          <div className="topSection">
            <h1 className="mainHeading">Search for an Entity below</h1>
          </div>
          <section>
            <div className="inputSection">
              <input
                ref={input => {
                  this.nameInput = input;
                }}
                type="text"
                onChange={onChange}
                onKeyDown={onKeyDown}
                value={userInput}
                disabled={disabled ? "disabled" : ""}
                placeholder="Enter either ABN or company name..."
              />
            </div>
            <div className="suggestionsSection">
              {loading ? <h4>Fetching....</h4> : suggestionsListComponent}
            </div>
          </section>
          <div className="resultSection">
            {Object.keys(selectedEntity).length > 0 && (
              <table>
                <tbody>
                  {Object.keys(selectedEntity).map(key => {
                    return (
                      <tr key={key}>
                        <td>{key}</td>
                        <td>{selectedEntity[key]}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </Fragment>
    );
  }
}

export default App;
