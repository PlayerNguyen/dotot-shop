import React, { useEffect, useState } from "react";

export default function useSetState<T>() {
  const [collection, setCollection] = useState<Set<T>>(new Set<T>());

  // useEffect(() => {
  //   console.log(collection);
  // }, [collection]);

  const add = (e: T): void => {
    setCollection((prev) => new Set(prev).add(e));
  };

  const remove = (e: T): void => {
    setCollection((prev) => {
      let next = new Set(prev);
      next.delete(e);
      return next;
    });
  };

  const has = (e: T): boolean => {
    return collection.has(e);
  };

  const forEach = (
    iter: (v1: T, v2: T, set: Set<T>) => void,
    thisArg?: () => any
  ): void => {
    collection.forEach(iter, thisArg);
  };

  const size = (): number => {
    return collection.size;
  };

  const clear = () => {
    setCollection(new Set())
  }

  return {
    state: collection,
    stateSetter: setCollection,
    add,
    remove,
    has,
    forEach,
    size,
    length: size,
    clear,
  };
}
