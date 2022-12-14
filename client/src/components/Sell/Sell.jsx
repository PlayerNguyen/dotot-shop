// import React, { Component } from "react";
// import ProductDetails from "./ProductDetails";
// import UserDetails from "./UserDetails";
// import Confirmation from "./Confirmation";
// import Success from "./Success";

// export default class Sell extends Component {
//   state = {
//     step: 1,
//     category: "",
//     productName: "",
//     brandName: "",
//     firstName: "",
//     lastName: "",
//     country: "",
//     additionNotes: "",
//   };

//   // go back to previous step
//   prevStep = () => {
//     const { step } = this.state;
//     this.setState({ step: step - 1 });
//   };

//   // proceed to the next step
//   nextStep = () => {
//     const { step } = this.state;
//     this.setState({ step: step + 1 });
//   };

//   // Handle fields change
//   handleChange = (input) => (e) => {
//     this.setState({ [input]: e.target.value });
//   };

//   render() {
//     const { step } = this.state;
//     const {
//       category,
//       productName,
//       brandName,
//       firstName,
//       lastName,
//       country,
//       additionNotes,
//     } = this.state;
//     const values = {
//       category,
//       productName,
//       brandName,
//       firstName,
//       lastName,
//       country,
//       additionNotes,
//     };

//     switch (step) {
//       case 1:
//         return (
//           <ProductDetails
//             nextStep={this.nextStep}
//             handleChange={this.handleChange}
//             values={values}
//           />
//         );
//       case 2:
//         return (
//           <UserDetails
//             prevStep={this.prevStep}
//             nextStep={this.nextStep}
//             handleChange={this.handleChange}
//             values={values}
//           />
//         );
//       case 3:
//         return (
//           <Confirmation
//             prevStep={this.prevStep}
//             nextStep={this.nextStep}
//             values={values}
//           />
//         );
//       case 4:
//         return <Success />;
//       default:
//       // do nothing
//     }
//   }
// }

import React, { useState } from "react";

export default function Sell() {
  const [selectedCategory, setSelectedCategory] = useState(false);
  return (
    <div className="sell-wrapper bg-white p-8 w-full sm:w-4/5 md:w-2/3 lg:w-2/5 mx-auto">
      <div className="sell-container text-base">
        <div className="form-control">
          <label>
            <select className="select select-primary select-sm w-full">
              <option>A</option>
            </select>
          </label>
        </div>
      </div>
    </div>
  );
}
