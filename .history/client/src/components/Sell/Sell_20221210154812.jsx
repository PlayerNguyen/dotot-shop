import React, { Component } from 'react'
import ProductDetails from './ProductDetails';
import UserDetails from './UserDetails';
import Confirmation from './Confirmation';
import Success from './Success';

export default class Sell extends Component{

  state = {
    step: 1,
    category: '',
    productName: '', 
    brandName: '',
    firstName: '',
    lastName: '',
    country: '',
    additionNotes: '',
  }

  // go back to previous step
  prevStep = () => {
    const { step } = this.state;
    this.setState({ step: step - 1 });
  }

  // proceed to the next step
  nextStep = () => {
    const { step } = this.state;
    this.setState({ step: step + 1 });
  }

  // Handle fields change
  handleChange = input => e => {
    this.setState({ [input]: e.target.value });
  }

  render() {
    const { step } = this.state;
    const { category, productName, brandName, firstName, lastName, country, levelOfEducation } = this.state;
    const values = { category, productName, brandName, firstName, lastName, country, levelOfEducation }
    
    switch(step) {
      case 1: 
        return (
          <ProductDetails 
            nextStep={ this.nextStep }
            handleChange={ this.handleChange }
            values={ values }
          />
        )
      case 2: 
        return (
          <UserDetails
            prevStep={ this.prevStep }
            nextStep={ this.nextStep }
            handleChange={ this.handleChange }
            values={ values }
          />
        )
      case 3: 
          return (
            <Confirmation 
              prevStep={ this.prevStep }
              nextStep={ this.nextStep }
              values={ values }
            />
          )
        case 4: 
          return (
            <Success />
          )
      default: 
          // do nothing
    }
  }

}
