import React, { Component } from 'react';
import './App.css';

const url = 'http://localhost:5000/api';

class App extends Component {
  constructor() {
    super();
    //original state of react app
    this.state = {
      title: 'Countries are really great!',
      countries: [],
      country_name: '',
      continent_name: ''
    }
    //binds state data to this component
    this.updateCountryName = this.updateCountryName.bind(this);
    this.updateContinentName = this.updateContinentName.bind(this);
    this.addCountry = this.addCountry.bind(this);
    this.editCountry = this.editCountry.bind(this);
  }

  //essentially on ready:
  componentDidMount() {
    console.log('Component has mounted');
    this.getCountries();
  }

  //fetch / http request to server / db
  getCountries() {
    fetch(`${url}/countries`)
      .then(response => response.json())
      .then(countriesResponseArray => {
        console.log('Countries array: ', countriesResponseArray);
        this.setState({
          countries: countriesResponseArray
        });
      })
      .catch(error => console.log(`Error with fetch getCountries: ${error}`));
  }

  // allows states to be set for adding a new country
  updateCountryName(event) {
    this.setState({
      country_name: event.target.value
    });
  }

  updateContinentName(event) {
    this.setState({
      continent_name: event.target.value
    });
  }

  // delete request
  deleteCountry(event) {
    console.log('Delete country: ', event);
    let id = event.id;

    const deleteRequest = new Request(`${url}/remove/${id}`, {
      method: 'DELETE',
      headers: new Headers({ 'Content-Type': 'application/json' })
    });

    fetch(deleteRequest)
      .then(response => {
        console.log(`Delete request successful: ${response}`);
        this.getCountries();
        this.setState({
          //empties input states
          country_name: '',
          continent_name: '',
          id: ''
        })
      }).catch(error => console.log(`Fetch failed to delete country: ${error}`)
      );
  }

  // adds a new country if current state doesnt have an id, if current state does have an id, adds a new country
  addCountry(event) {
    event.preventDefault();
    // if checks if current state has an id
    if (this.state.id) {
      const countryUpdate_data = {
        country_name: this.state.country_name,
        continent_name: this.state.continent_name,
        id: this.state.id
      }
      console.log('Update this: ', countryUpdate_data);

      const putRequest = new Request(`${url}/update-country`, {
        method: 'PUT',
        headers: new Headers({ 'Content-Type': 'application/json' }),
        body: JSON.stringify(countryUpdate_data)
      });

      fetch(putRequest)
        .then(response => {
          console.log(`Put request was successful: ${response}`);
          this.getCountries();
          this.setState({
            //empties input states
            country_name: '',
            continent_name: '',
            id: ''
          })
        }).catch(error => console.log(`Fetch failed on update country: ${error}`)
        )
    } else {
      const country_data = {
        //new country data
        country_name: this.state.country_name,
        continent_name: this.state.continent_name
      }

      const request = new Request(`${url}/new-country`, {
        method: 'POST',
        headers: new Headers({ 'Content-Type': 'application/json' }),
        body: JSON.stringify(country_data)
      });

      fetch(request)
        .then(response => {
          console.log(`Post was successful: ${response}`);
          this.getCountries();
          this.setState({
            //empties input states
            country_name: '',
            continent_name: '',
            id: ''
          })
        }).catch(error => console.log(`Fetch failed on add country post: ${error}`)
        )
    }
  }


  editCountry(event) {
    console.log('Edit country: ', event);
    this.setState({
      country_name: event.country_name,
      continent_name: event.continent_name,
      id: event.id
    })
  }

  render() {
    return (
      <div className="App">
        <h1>{this.state.title}</h1>

        <form>
          <input type="text" value={this.state.country_name} onChange={this.updateCountryName} placeholder="country_name"></input>
          <input type="text" value={this.state.continent_name} onChange={this.updateContinentName} placeholder="continent_name"></input>
          <button onClick={this.addCountry}>Add/Edit Country!</button>
        </form>

        <ul className="noBullets">
          {this.state.countries.map(country => (
            <li key={country.id}><span onClick={this.editCountry.bind(this, country)}>{country.country_name} | {country.continent_name}</span> <button onClick={this.deleteCountry.bind(this, country)}>X</button></li>
          ))}
        </ul>
      </div>
    );
  }
}

export default App;
