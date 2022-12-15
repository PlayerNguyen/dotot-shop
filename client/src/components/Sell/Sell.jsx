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
import { Link, useNavigate } from "react-router-dom";
import FileUploadModal from "../FileUpload/FileUploadModal";
import SellImageUpload from "./SellImageUpload";
import { AiOutlinePlus } from "react-icons/ai";
import ProductRequest from "../../requests/ProductRequest";
import AxiosInstance from "../../requests/AxiosInstance";

function FilePreview({ file, cropMap }) {
  const [previewImageSource, setPreviewImageSource] = useState(null);

  useEffect(() => {
    console.log(file, cropMap);

    if (file) {
      const reader = new FileReader();
      reader.addEventListener("load", (_ev) => {
        setPreviewImageSource(reader.result);
      });
      reader.readAsDataURL(file);
    }
  }, [file, cropMap]);
  return (
    <div
      tabIndex={0}
      className="collapse border border-base-300 bg-base-100 rounded-box"
    >
      <div className="collapse-title text-sm font-medium">{file.name}</div>
      <div className="collapse-content">
        {/* <p>tabIndex={0} attribute is necessary to make the div focusable</p> */}
        <div className="w-full block">
          <img className="w-full" src={previewImageSource} />
        </div>
      </div>
    </div>
  );
}

export default function Sell() {
  const [selectedCategory, setSelectedCategory] = useState(false);
  const [visibleFileUpload, setVisibleFileUpload] = useState(false);
  const [categoryList, setCategoryList] = useState([]);
  const [cropMap, setCropMap] = useState(new Map());

  const [productCategory, setProductCategory] = useState(0);
  const [productName, setProductName] = useState("");
  const [productDescription, setProductDescription] = useState("");
  const [productCondition, setProductCondition] = useState(100);
  const [productPrice, setProductPrice] = useState(0);
  const [isProductSale, setIsProductSale] = useState(false);
  const [productSalePrice, setProductSalePrice] = useState(0);
  const [isUserAgree, setIsUserAgree] = useState(false);

  const [isPostSelling, setIsPostSelling] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    CategoryRequest.getAllCategory().then((response) => {
      const { data } = ResponseInterceptor.filterSuccess(response);
      setCategoryList(data);
      setProductCategory(data[0].Id);
    });
  }, []);

  const handleShowFileUploadDialog = () => {
    setVisibleFileUpload(true);
  };

  const handleSelectedImage = (cropValue, file) => {
    // console.log(cropValue, file);
    setCropMap((prev) => new Map(prev).set(file, cropValue));
    setVisibleFileUpload(false);
  };

  const handleCloseUploadDialog = () => {
    setVisibleFileUpload(false);
  };

  const handleChangeProductName = (e) => {
    setProductName(e.target.value);
  };

  const handleChangeProductDescription = (e) => {
    setProductDescription(e.target.value);
  };

  const handleChangeProductCondition = (e) => {
    setProductCondition(e.target.value);
  };

  const handleProductCategorySelect = (e) => {
    setProductCategory(e.target.value);
  };

  const handleIsProductSaleChange = (e) => {
    setIsProductSale(e.target.checked);
  };

  const handleAgreementChange = (e) => {
    setIsUserAgree(e.target.checked);
  };
  const handleProductChangePrice = (e) => {
    setProductPrice(e.target.value);
  };

  const handleProductSalePriceChange = (e) => {
    setProductSalePrice(e.target.value);
  };
  const isValidProductSalePrice = isProductSale
    ? Number.parseInt(productSalePrice) < Number.parseInt(productPrice) &&
      Number.parseInt(productSalePrice) > 0
    : true;

  const isAvailableToSell =
    productName !== "" &&
    productCategory !== -1 &&
    productPrice > 0 &&
    isValidProductSalePrice &&
    isUserAgree &&
    !isPostSelling;

  const handleClickSaleButton = () => {
    const requestFormData = new FormData();
    requestFormData.set("name", productName);
    requestFormData.set("description", productDescription);
    requestFormData.set("category", productCategory);
    requestFormData.set("price", Number.parseFloat(productPrice));
    if (cropMap.size > 0) {
      const images = [...cropMap.keys()];
      for (let image of images) {
        // console.log(image);
        requestFormData.append("images", image);
      }

      const orderedCropMap = [...cropMap.values()].map((v) => {
        const { x, y, width, height } = v;
        return {
          x,
          y,
          width,
          height,
        };
      });
      requestFormData.append("cropMap", JSON.stringify(orderedCropMap));
    }

    requestFormData.set("condition", productCondition);

    if (isProductSale) {
      requestFormData.set("salePrice", productSalePrice);
    }
    setIsPostSelling(true);
    ProductRequest.createProduct(requestFormData)
      .then((response) => {
        const { data } = ResponseInterceptor.filterSuccess(response);
        navigate(`/products/${data.id}`);
      })
      .finally(() => setIsPostSelling(false));
  };

  return (
    <div className="sell-wrapper bg-base-100 p-8 w-full sm:w-4/5 md:w-2/3 lg:w-2/5 mx-auto sm:my-6 sm:rounded-xl">
      <div className="sell-container text-base flex flex-col gap-4">
        <div className="mb-12">
          <b>Dear our valued customer,</b>
          <p>We are </p>
        </div>
        {/* Select category */}
        <div className="form-control">
          <label className="label">
            <span className="label-text">Which one you want to sell?</span>
          </label>

          <select
            className="select select-primary select-sm w-full"
            defaultValue={productCategory}
            onChange={handleProductCategorySelect}
          >
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
            value={productName}
            onChange={handleChangeProductName}
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
          <textarea
            className="textarea textarea-sm textarea-primary w-full"
            name="product-description"
            value={productDescription}
            onChange={handleChangeProductDescription}
          ></textarea>
        </div>

        <div className="divider"></div>

        {/* Add new files */}
        <div className="form-control">
          <label className="label">
            <span className="label-text">Image of your product</span>
            {/* <input type="file" className="file-input file-input-primary" /> */}
            <button
              className="btn btn-primary btn-sm flex flex-row gap-3"
              onClick={handleShowFileUploadDialog}
            >
              <AiOutlinePlus />
              <span>Add</span>
            </button>
          </label>

          {/* Files List */}
          <div className="flex flex-col gap-3">
            {[...cropMap.keys()].map((file) => {
              return (
                <FilePreview
                  key={file.name}
                  file={file}
                  cropMap={cropMap.get(file)}
                />
              );
            })}
          </div>
        </div>
        <div className="divider"></div>
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
            value={productCondition}
            className="range range-primary"
            onChange={handleChangeProductCondition}
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

          <label className="input-group">
            <span>
              <FaMoneyBillAlt />
            </span>
            <input
              type="number"
              min="0"
              value={productPrice}
              className="input input-md input-primary w-full"
              onChange={handleProductChangePrice}
            />
            <span>USD</span>
          </label>
          <label className="label">
            <span className="label-text text-base-300">
              about condition of product
            </span>
          </label>
        </div>

        {/* Sales */}
        <div className="form-control ">
          <label className="label">
            <span className="label-text">Discount</span>
            <input
              type="checkbox"
              className="toggle toggle-primary"
              checked={isProductSale}
              onChange={handleIsProductSaleChange}
            />
          </label>
          <div className="">
            <div
              className={`form-control ${isProductSale ? `block` : `hidden`}`}
            >
              <label className="label">
                <span className="label-text">The cost after sell</span>
              </label>
              <label className="input-group">
                <span>
                  <FaMoneyBillAlt />
                </span>
                <input
                  type="number"
                  className={`input input-sm w-full ${
                    isValidProductSalePrice ? `input-primary` : `input-accent`
                  }`}
                  value={productSalePrice}
                  min={1}
                  disabled={!isProductSale}
                  onChange={handleProductSalePriceChange}
                />
                <span>USD</span>
              </label>

              {!isValidProductSalePrice && (
                <label className="label">
                  <span className="label-text-alt text-accent">
                    The sale cost must be <b>lower than current cost</b> and{" "}
                    <b>greater than 0</b>
                  </span>
                </label>
              )}
            </div>
          </div>
        </div>

        {/* Agreement */}
        <div className="form-control">
          <label className="label">
            <span className="label-text">
              By selling this product, I agree with{" "}
              <Link className="link link-hover" to="/">
                Terms of Services
              </Link>
            </span>
            <input
              type="checkbox"
              className="checkbox"
              checked={isUserAgree}
              onChange={handleAgreementChange}
            />
          </label>
        </div>

        <div className="divider"></div>

        <div className="flex flex-row-reverse">
          <button
            className="btn btn-primary flex flex-row gap-3"
            disabled={!isAvailableToSell}
            onClick={handleClickSaleButton}
          >
            <FaMoneyBillAlt />
            Sell
          </button>
        </div>
      </div>
      <SellImageUpload
        visible={visibleFileUpload}
        onSelect={handleSelectedImage}
        onClose={handleCloseUploadDialog}
      />
    </div>
  );
}
