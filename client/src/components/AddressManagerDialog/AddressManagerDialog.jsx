import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { ResponseInterceptor } from "../../helpers/ResponseInterceptor";
import UserRequest from "../../requests/UserRequest";
import { AiFillCloseCircle, AiOutlineDelete } from "react-icons/ai";
import ProvinceRequest from "../../requests/ProvinceRequest";

export default function AddressManagerDialog({ visible, onUpdate, onClose }) {
  const [loading, setLoading] = useState(false);
  const [addresses, setAddresses] = useState([]);
  const [expand, setExpand] = useState(false);

  const [contactPhone, setContactPhone] = useState("");
  const [streetName, setStreetName] = useState("");

  const [provinceLoading, setProvinceLoading] = useState(false);
  const [provinceList, setProvinceList] = useState(new Map());
  const [provinceValue, setProvinceValue] = useState();

  const [districtLoading, setDistrictLoading] = useState(false);
  const [districtMap, setDistrictMap] = useState(new Map());
  const [districtValue, setDistrictValue] = useState();

  const [wardLoading, setWardLoading] = useState(false);
  const [wardMap, setWardMap] = useState(new Map());
  const [wardValue, setWardValue] = useState();

  /**
   * Get user address list and print out
   */
  useEffect(() => {
    const userAbortController = new AbortController();
    setLoading(true);
    UserRequest.getUserAddressList(userAbortController.signal)
      .then((response) => {
        const { data } = ResponseInterceptor.filterSuccess(response);
        // console.log(data);
        setAddresses(data);
      })
      .finally(() => {
        setLoading(false);
      });

    return () => {
      userAbortController.abort();
    };
  }, []);

  /**
   * Load the province when the editor expand
   */
  useEffect(() => {
    if (expand) {
      // Load the province
      setProvinceLoading(true);
      ProvinceRequest.fetchProvince()
        .then((response) => {
          const { data } = ResponseInterceptor.filterSuccess(response);
          // Construct a map and put into province list
          const m = new Map();
          data.forEach((province) => {
            const { Id, Name } = province;
            m.set(Id, Name);
          });
          // console.log(m);
          setProvinceList(m);
        })
        .finally(() => setProvinceLoading(false));
    }
  }, [expand]);

  /**
   * Fetch district after select province
   *
   */
  useEffect(() => {
    if (provinceValue) {
      setDistrictLoading(true);
      ProvinceRequest.fetchDistrictFromProvince(provinceValue)
        .then((response) => {
          const { data } = ResponseInterceptor.filterSuccess(response);
          const _districtMap = new Map();

          data.forEach((district) => {
            const { Id, Name } = district;

            _districtMap.set(Id, Name);
          });

          setDistrictMap(_districtMap);
        })
        .finally(() => setDistrictLoading(false));
    }
  }, [provinceValue]);

  useEffect(() => {
    if (districtValue) {
      setWardLoading(true);
      ProvinceRequest.fetchWardFromDistrict(districtValue)
        .then((response) => {
          const { data } = ResponseInterceptor.filterSuccess(response);
          // console.log(data);
          const map = new Map();
          data.forEach((district) => {
            const { Id, Name } = district;

            map.set(Id, Name);
          });

          setWardMap(map);
        })
        .finally(() => setWardLoading(false));
    }
  }, [districtValue]);

  const handleAddAddress = () => {
    console.log({
      streetName,
      provinceValue,
      districtValue,
      wardValue,
      contactPhone,
    });
    if (
      streetName === "" ||
      !provinceValue ||
      !districtValue ||
      !wardValue ||
      !contactPhone
    ) {
      return toast.error(`Please fill all data to add address`);
    }

    // Send post request to add new user address
    // console.log(provinceList.get(Number.parseInt(provinceValue)));
    const postData = {
      contactPhone,
      streetName,
      provinceName: provinceList.get(Number.parseInt(provinceValue)),
      districtName: districtMap.get(Number.parseInt(districtValue)),
      wardName: wardMap.get(Number.parseInt(wardValue)),
    };
    UserRequest.postCreateUserAddress(postData)
      .then((response) => {
        const { data } = ResponseInterceptor.filterSuccess(response);
        // console.log(data);
        // Put data into addresses list
        setAddresses([...addresses, data]);
      })
      .finally(() => {
        setExpand(false);
      });
  };

  useEffect(() => {
    onUpdate(addresses);
  }, [addresses]);

  const handleAddClick = () => {
    if (!expand) {
      setExpand(true);
    } else {
      // add new address for user
      handleAddAddress();
    }
  };

  const handleProvinceSelect = (e) => {
    const selectedProvinceId = e.target.value;

    setProvinceValue(selectedProvinceId);

    // setDistrictValue(undefined);
    // setWardValue(undefined);
  };

  const handleDistrictSelect = (e) => {
    const selectedDistrictId = e.target.value;
    setDistrictValue(selectedDistrictId);
    // setWardValue(0);
  };

  const handleStreetNameChange = (e) => {
    setStreetName(e.target.value);
  };

  const handleWardSelect = (e) => {
    setWardValue(e.target.value);
  };

  const handleContactPhoneChange = (e) => {
    setContactPhone(e.target.value);
  };

  const handleRemoveAddress = (Id) => {
    // Post first
    UserRequest.deleteRemoveAddress(Id).then((response) => {
      setAddresses([...addresses].filter((address) => address.Id !== Id));
    });
  };

  return (
    visible && (
      <div className="addressManagerDialog-wrapper bg-black bg-opacity-70 fixed top-0 left-0 w-[100vw] h-[100vh]">
        {/*  Content  */}
        <div className="bg-white mx-auto w-full sm:w-4/5 lg:w-1/4 md:w-2/4 sm:mt-12 sm:rounded-xl px-6 py-4">
          {/* Header */}
          <div className="flex flex-row items-center">
            <div className="font-bold text-2xl flex-1">Address</div>
            <button
              className="text-3xl sm:text-xl btn btn-ghost"
              onClick={onClose}
            >
              <AiFillCloseCircle />
            </button>
          </div>

          {/* Body */}
          <div className="my-4">
            {/* Addresses */}
            <div className="flex flex-col h-[40vh] max-h-[40vh] overflow-y-auto">
              {loading ? (
                <div>Loading...</div>
              ) : addresses && addresses.length != 0 ? (
                addresses.map((item) => {
                  const {
                    Id,
                    ContactPhone,
                    StreetName,
                    ProvinceName,
                    WardName,
                    DistrictName,
                  } = item;
                  return (
                    <div
                      className="flex flex-row px-4 items-center border-b"
                      key={Id}
                    >
                      <div className="flex-1">
                        <div className="text-sm">{StreetName}</div>
                        <div className="text-base-300 text-sm">
                          <div>
                            {WardName}, {ProvinceName}, {DistrictName}
                          </div>
                        </div>
                        <div className="font-bold">{ContactPhone}</div>
                      </div>
                      {/* Action */}
                      <div>
                        <button
                          onClick={() => {
                            handleRemoveAddress(Id);
                          }}
                          className="btn text-xl rounded-full text-accent btn-ghost"
                        >
                          <AiOutlineDelete />
                        </button>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="w-full mx-auto">
                  <div className="font-bold text-2xl text-center">
                    There is no address has been added
                  </div>
                </div>
              )}
            </div>
          </div>
          <hr />

          {/* Editor */}
          <div className="addressEditor flex flex-col gap-4 mt-4">
            {expand && (
              <div className="flex flex-col gap-4">
                <div>
                  <div className="flex flex-row gap-2">
                    {/* Street name */}
                    <div className="form-control flex-1">
                      <input
                        className="input input-sm w-full input-bordered input-primary"
                        placeholder="Street name"
                        value={streetName}
                        onChange={handleStreetNameChange}
                      />
                    </div>

                    <div className="form-control flex-1">
                      <input
                        className="input input-sm w-full input-bordered input-primary"
                        placeholder="Contact phone number"
                        value={contactPhone}
                        onChange={handleContactPhoneChange}
                      />
                    </div>
                  </div>
                </div>

                {/* Multi */}
                <div>
                  <div className="form-control flex flex-row w-full gap-2">
                    {/* City */}
                    <select
                      className={`select select-sm select-bordered flex-1 ${
                        provinceLoading && `animate-pulse`
                      }`}
                      disabled={provinceLoading}
                      onChange={handleProvinceSelect}
                      value={provinceValue}
                    >
                      {/* <option disabled selected>
                        City / Province
                      </option> */}
                      <optgroup label="City / Province">
                        {provinceList &&
                          [...provinceList.keys()].map((provinceId, _index) => {
                            {
                              /* const { Id, Name } = province; */
                            }
                            return (
                              <option value={provinceId} key={provinceId}>
                                {provinceList.get(provinceId)}
                              </option>
                            );
                          })}
                      </optgroup>
                    </select>
                    {/* District */}
                    <select
                      className="select select-sm select-bordered flex-1"
                      disabled={provinceValue === undefined}
                      onChange={handleDistrictSelect}
                      value={districtValue}
                    >
                      {/* <option disabled selected>
                        {provinceValue === undefined
                          ? `Select city first`
                          : `District`}
                      </option> */}
                      <optgroup label="Districts">
                        {districtMap &&
                          [...districtMap.keys()].map((districtId) => {
                            return (
                              <option value={districtId} key={districtId}>
                                {districtMap.get(districtId)}
                              </option>
                            );
                          })}
                      </optgroup>
                    </select>
                  </div>
                  <div className="form-control flex flex-row w-full gap-2 mt-2">
                    {/* Wards */}
                    <select
                      className="select select-sm select-bordered flex-1"
                      disabled={districtValue === undefined || wardLoading}
                      value={wardValue}
                      onChange={handleWardSelect}
                    >
                      {/* <option disabled selected>
                        {districtValue === undefined
                          ? `Select district first`
                          : `Wards`}
                      </option> */}
                      <optgroup label="Wards">
                        {wardMap &&
                          [...wardMap.keys()].map((wardId) => {
                            return (
                              <option value={wardId} key={wardId}>
                                {wardMap.get(wardId)}
                              </option>
                            );
                          })}
                      </optgroup>
                    </select>
                  </div>
                </div>
              </div>
            )}
            <div
              className="btn btn-primary w-full btn-sm"
              onClick={handleAddClick}
            >
              Add
            </div>
          </div>
        </div>
      </div>
    )
  );
}
