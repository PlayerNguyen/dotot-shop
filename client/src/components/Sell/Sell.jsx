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

import React, { useEffect, useState } from "react";
import { FaMoneyBillAlt } from "react-icons/fa";
import { ResponseInterceptor } from "../../helpers/ResponseInterceptor";
import CategoryRequest from "../../requests/CategoryRequest";

export default function Sell() {
  const [selectedCategory, setSelectedCategory] = useState(false);

  const [categoryList, setCategoryList] = useState([]);

  useEffect(() => {
    CategoryRequest.getAllCategory().then((response) => {
      const { data } = ResponseInterceptor.filterSuccess(response);
      setCategoryList(data);
    });
  }, []);

  return (
    <div className="sell-wrapper bg-base-100 p-8 w-full sm:w-4/5 md:w-2/3 lg:w-2/5 mx-auto">
      <div className="sell-container text-base">
        <div className="mb-12">
          <b>Dear our valued customer,</b>
          <p>We are </p>
        </div>
        {/* Form control */}
        <div className="form-control">
          <label className="label">
            <span className="label-text">Which one you want to sell?</span>
          </label>

          <select className="select select-primary select-sm w-full">
            {categoryList &&
              categoryList.map((category) => {
                return (
                  <option value={category.Id} key={category.Id}>
                    {category.Name}
                  </option>
                );
              })}
          </select>
        </div>

        {/* Name */}
        <div className="form-control">
          <label className="label">
            <span className="label-text">Name of the product</span>
          </label>
          <input
            className="input input-sm input-primary w-full"
            name="product-name"
          />
        </div>

        {/* Lores */}
        <div>
          <label className="label">
            <span className="label-text">Describe about your furniture</span>
          </label>
          {/* <input
            className="input input-sm input-primary w-full"
            name="product-description"
          /> */}
          <textarea className="textarea textarea-sm textarea-primary w-full"></textarea>
        </div>

        {/* Condition */}
        <div>
          <label className="label">
            <span className="label-text">Condition of the product</span>
          </label>
          {/* <input
            className="input input-sm input-primary w-full"
            name="product-description"
          /> */}
          <input
            type="range"
            min="90"
            max="100"
            // value="100"
            className="range range-primary"
            // step="1"
          />
          <label className="label">
            <span className="label-text text-base-300">
              about condition of product
            </span>
          </label>
        </div>

        {/* Price */}
        <div>
          <label className="label">
            <span className="label-text">Cost of product</span>
          </label>

          <input
            type="number"
            min="90"
            max="100"
            // value="100"
            className="input input-sm input-primary w-full"
            // step="1"
          />
          <label className="label">
            <span className="label-text text-base-300">
              about condition of product
            </span>
          </label>
        </div>

        {/* Sales */}
        <div className="form-control ">
          <label className="label">
            <span className="label-text">Sales</span>
            <input type="checkbox" className="toggle toggle-primary" />
          </label>
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <div className="flex flex-col sm:flex-row gap-4 sm:items-center">
              <span className="text-base-300">New cost after sell</span>
              <label className="input-group">
                <span>
                  <FaMoneyBillAlt />
                </span>
                <input
                  type="number"
                  className="input input-sm input-primary "
                />
                <span>USD</span>
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
