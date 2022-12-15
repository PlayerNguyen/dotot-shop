import React, { useEffect, useState } from "react";
import AxiosInstance from "../../requests/AxiosInstance";
import { Blurhash } from "react-blurhash";

export default function LazyImageLoader({ src, blurHash, className }) {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);

  useEffect(() => {
    setLoading(true);
    const abortController = new AbortController();
    // console.log(src);
    AxiosInstance.get(src, {
      responseType: "arraybuffer",
      signal: abortController.signal,
    })
      .then((response) => {
        // console.log(response.data);

        setData(Buffer.from(response.data, "binary").toString("base64"));
      })
      .finally(() => setLoading(false));

    // return () => {
    //   abortController.abort();
    // };
  }, [src]);

  return loading ? (
    // <Blurhash
    //   hash={blurHash ? blurHash : "00NAr3"}
    //   className={`${className} rounded-full`}
    // />
    <img
      className="animate-pulse"
      src={`${process.env.PRODUCTION_BASE_URL}/default.png`}
    />
  ) : (
    <img src={`data:image/png;base64, ${data && data}`} className={className} />
  );
}
