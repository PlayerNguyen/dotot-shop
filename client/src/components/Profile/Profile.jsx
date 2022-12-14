import React, { useEffect, useState, Suspense } from "react";
import { AiFillSetting, AiOutlineShoppingCart } from "react-icons/ai";
import { GiTwoCoins } from "react-icons/gi";
import { Outlet, useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { ResponseInterceptor } from "../../helpers/ResponseInterceptor";
import { FaLocationArrow } from "react-icons/fa";
import UserRequest from "../../requests/UserRequest";
// import FileUploadModal from ;
const FileUploadModal = React.lazy(() =>
  import("../FileUpload/FileUploadModal")
);
const LazyImageLoader = React.lazy(() =>
  import("../LazyImageLoader/LazyImageLoader")
);

export default function Profile() {
  const navigate = useNavigate();
  const location = useLocation();
  const [visitedSubPage, setVisitedSubPage] = useState(false);
  const [subItems] = useState([
    {
      icon: <AiFillSetting />,
      name: "General",
      to: "/profile/general",
    },
    {
      icon: <AiOutlineShoppingCart />,
      name: "Receipt",
      to: "/profile/receipt",
    },
    {
      icon: <FaLocationArrow />,
      name: "Address",
      to: "/profile/addresses",
    },
  ]);
  const [profile, setProfile] = useState(null);
  const [uploadAvatarVisible, setUploadAvatarVisible] = useState(false);
  const [avatarInformation, setAvatarInformation] = useState(null);

  useEffect(() => {
    const paths = location.pathname.split("/").filter((e) => e !== "");
    setVisitedSubPage(paths.length > 1);
  }, [location]);

  useEffect(() => {
    const abortController = new AbortController();
    UserRequest.getCurrentProfile(abortController).then((response) => {
      const { data } = ResponseInterceptor.filterSuccess(response);
      setProfile(data);

      if (data.avatar !== null) {
        const { blurHash, url, id } = data.avatar;
        // console.log(data.avatar);
        setAvatarInformation({
          avatarBlurHash: blurHash,
          avatarUrl: url,
          avatarId: id,
        });
      }
    });

    return () => {
      // abortController.abort();
    };
  }, []);

  return (
    <div className="profile-wrapper bg-base-300 sm:px-3 sm:py-6">
      <div className="profile-content bg-base-100 sm:mx-4 sm:rounded-xl sm:px-12 py-6 px-6 md:py-14 flex flex-col gap-6">
        {/* Information block */}
        <div className="flex flex-row gap-4 sm:gap-12 items-center sm:mx-12">
          <div
            className="sm:w-1/6 w-2/6"
            onClick={() => setUploadAvatarVisible(true)}
          >
            {profile && (
              <Suspense
                fallback={
                  <div className="h-[140px] w-[140px] bg-base-200 animate-pulse rounded-full">
                    <div></div>
                  </div>
                }
              >
                <LazyImageLoader
                  // src={`${process.env.PRODUCTION_BASE_URL}${
                  //   avatarInformation && avatarInformation.avatarUrl
                  //     ? avatarInformation.avatarUrl
                  //     : "default.png"
                  // }`}
                  // blurHash={
                  //   avatarInformation && avatarInformation.avatarBlurHash
                  // }
                  src={`http://localhost:3000/default.png`}
                  className="rounded-full"
                />
              </Suspense>
            )}
            {/* <img
              src={`${process.env.PRODUCTION_BASE_URL}${
                profile && profile.avatar.url
              }`}
              className={`rounded-full`}
            /> */}
          </div>

          <div className="flex flex-col gap-3">
            <div className="text-3xl text-black font-bold">
              {profile && profile.firstName + " " + profile.lastName}
            </div>
            <div>
              <div>
                <div className="badge badge-success gap-2">
                  <GiTwoCoins />
                  300
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Settings and updates */}
        <div className="flex flex-col sm:flex-row">
          {/* Aside bar */}
          <div
            className={`${
              visitedSubPage ? `hidden md:flex md:flex-col` : ``
            } flex flex-col sm:w-1/4`}
          >
            {subItems &&
              subItems.map((_item, _index) => {
                return (
                  <button
                    key={_index}
                    className={`btn btn-ghost text-right flex flex-row gap-3 ${
                      _item.to === location.pathname
                    }`}
                    onClick={() => navigate(_item.to)}
                  >
                    <i>{_item.icon}</i>
                    <span>{_item.name}</span>
                  </button>
                );
              })}
          </div>
          <div className="flex flex-col gap-6 sm:w-3/4">
            {visitedSubPage && (
              <div className="md:hidden">
                <button
                  className="btn btn-ghost no-animation"
                  onClick={() => navigate("/profile")}
                >
                  Back to Settings
                </button>
              </div>
            )}

            <div>
              <Outlet context={[profile, setProfile]} />
            </div>
          </div>
        </div>
      </div>

      {/* Upload modal */}
      <Suspense fallback={<div>Loading...</div>}>
        <FileUploadModal
          visible={uploadAvatarVisible}
          onCloseClick={() => {
            setUploadAvatarVisible(false);
          }}
          onComplete={(response) => {
            setUploadAvatarVisible(false);

            const { avatarBlurHash, avatarId, avatarUrl } = response;
            setAvatarInformation({ avatarBlurHash, avatarId, avatarUrl });
          }}
          onCancel={() => setUploadAvatarVisible(false)}
          title={"Upload avatar"}
        />
      </Suspense>
    </div>
  );
}
