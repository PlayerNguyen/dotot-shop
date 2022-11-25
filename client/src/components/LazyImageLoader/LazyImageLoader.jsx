import React, { useEffect, useState } from "react";
import AxiosInstance from "../../requests/AxiosInstance";
import { Blurhash } from "react-blurhash";

export default function LazyImageLoader({ src, blurHash }) {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  useEffect(() => {
    setLoading(true);
    // console.log(src);
    AxiosInstance.get(src, { responseType: "arraybuffer" })
      .then((response) => {
        // console.log(response.data);

        setData(Buffer.from(response.data, "binary").toString("base64"));
      })
      .finally(() => setLoading(false));
  }, []);
  return loading ? (
    <Blurhash hash={blurHash} width={"100%"} height={"100%"} />
  ) : (
    <img src={`data:image/png;base64, ${data && data}`} />
  );
}
