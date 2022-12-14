import React, { useEffect, useState } from "react";
import { CgCheckO, CgTrash } from "react-icons/cg";
import { toast } from "react-toastify";
import { ResponseInterceptor } from "../../helpers/ResponseInterceptor";
import useSetState from "../../hooks/useSetState";
import CategoryRequest from "../../requests/CategoryRequest";

function CategoryItem({ category, isSelected, onSelect, onDelete }) {
  return (
    <div
      className="flex flex-row px-3 py-2 rounded-xl hover:bg-zinc-100"
      key={category.Id}
    >
      <div
        className="flex flex-row items-center gap-3 flex-1 cursor-pointer"
        onClick={() => {
          onSelect(category.Id);
        }}
      >
        <div className={`rounded-full ${isSelected && `bg-primary`} `}>
          <CgCheckO
            className={`text-xl ${
              !isSelected ? `text-base-300` : `text-black`
            }`}
          />
        </div>
        <div className="font-bold text-xl">{category.Name}</div>
      </div>

      {/* Actions */}
      <div className="flex flex-row items-center gap-3 ">
        <button
          className="btn btn-ghost btn-circle btn-accent text-xl text-base-300 hover:text-red-500"
          onClick={() => onDelete(category.Id)}
        >
          <CgTrash />
        </button>
      </div>
    </div>
  );
}

export default function AdminCategory() {
  const [categories, setCategories] = useState([]);
  const selectedCategories = useSetState();
  const fetchCategory = () => {
    CategoryRequest.getAllCategory()
      .then((response) => {
        const { data } = ResponseInterceptor.filterSuccess(response);
        setCategories(data);
      })
      .catch((response) => {
        const { message } = ResponseInterceptor.filterError(response);
        toast.error(message);
      });
  };

  useEffect(() => {
    fetchCategory();
  }, []);

  const handleToggleItem = (id) => {
    !selectedCategories.has(id)
      ? selectedCategories.add(id)
      : selectedCategories.remove(id);
  };

  const handleRemoveItem = (id) => {
    // Call remove
    CategoryRequest.deleteCategory(id)
      .then(() => {
        // Remove out of list and set
        setCategories(categories.filter((category) => category.Id !== id));
        selectedCategories.remove(id);
      })
      .catch((response) => {
        const { message } = ResponseInterceptor.filterError(response);
        toast.error(message);
      });
  };

  return (
    <div className="adminCategory-wrapper">
      <div className="mx-3 mb-3">
        <div className="font-bold text-3xl">Manage categories</div>

        {/* List of categories */}
        <div className="my-3">
          {categories &&
            categories.map((category) => {
              return (
                <CategoryItem
                  category={category}
                  isSelected={selectedCategories.state.has(category.Id)}
                  onSelect={handleToggleItem}
                  onDelete={handleRemoveItem}
                />
              );
            })}
        </div>
      </div>
    </div>
  );
}
