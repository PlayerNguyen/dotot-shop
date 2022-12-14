import React, { useEffect, useState } from "react";
import { CgAdd, CgAddR, CgCheckO, CgTrash } from "react-icons/cg";
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

function AddCategorySection({ visible, onAdd, onCancel, isAdding }) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  return (
    visible && (
      <div className="addCategorySection-wrapper">
        <div className="flex flex-col gap-2">
          <div className="flex flex-row gap-1">
            <div>
              <label className="label">
                <span className="label-text">Name</span>
              </label>
              <input
                type={`text`}
                className={`input input-sm input-primary w-full`}
                value={name}
                name="category-name"
                onChange={(e) => {
                  setName(e.target.value);
                }}
              />
            </div>

            <div className="flex-1">
              <label className="label">
                <span className="label-text">Description</span>
              </label>
              <input
                type={`text`}
                className={`input input-sm input-primary w-full`}
                value={description}
                name="category-description"
                onChange={(e) => {
                  setDescription(e.target.value);
                }}
              />
            </div>
          </div>
          {/* Footer */}
          <div className="flex flex-row-reverse gap-3">
            <button className="btn btn-accent btn-sm" onClick={onCancel}>
              Cancel
            </button>
            <button
              className={`btn btn-primary btn-sm ${
                isAdding && isAdding && `loading`
              }`}
              disabled={name === "" || isAdding}
              onClick={() => {
                onAdd(name, description);
                // Anti-spam by clear text
                setName("");
                setDescription("");
              }}
            >
              Add
            </button>
          </div>
        </div>
      </div>
    )
  );
}

export default function AdminCategory() {
  const [categories, setCategories] = useState([]);
  const selectedCategories = useSetState();
  const [addCategorySectionVisible, setAddCategorySectionVisible] =
    useState(false);

  const [isAdding, setIsAdding] = useState(false);

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

  const handleAddSectionToggle = () => {
    setAddCategorySectionVisible((prev) => !prev);
  };

  const handleAddNewCategory = (name, description) => {
    setIsAdding(true);
    CategoryRequest.createCategory(name, description)
      .then((response) => {
        const { data } = ResponseInterceptor.filterSuccess(response);
        // const {Id, Name, Description, Slug} = data;
        setCategories([{ ...data }, ...categories]);
        setAddCategorySectionVisible(false);
      })
      .catch((response) => {
        const { message } = ResponseInterceptor.filterError(response);
        toast.error(message);
      })
      .finally(() => setIsAdding(false));
  };

  return (
    <div className="adminCategory-wrapper">
      <div className="mx-3 mb-3">
        <div className="flex flex-row items-center">
          <div className="font-bold text-3xl flex-1">Manage categories</div>
          <div>
            <button
              className="btn btn-ghost text-primary text-2xl btn-circle"
              onClick={handleAddSectionToggle}
            >
              <CgAdd />
            </button>
          </div>
        </div>

        {/* Add section */}
        <AddCategorySection
          visible={addCategorySectionVisible}
          onCancel={() => {
            setAddCategorySectionVisible(false);
          }}
          isAdding={isAdding}
          onAdd={handleAddNewCategory}
        />

        <div className="divider"></div>

        {selectedCategories.state.size > 0 && (
          <div>
            <div className="flex flex-row items-center">
              <div className="flex-1">
                <b>
                  {`${selectedCategories.state.size} ${
                    selectedCategories.state.size > 1
                      ? `categories`
                      : `category`
                  }`}
                </b>
              </div>
              <div className="text-2xl">
                <button className="btn btn-ghost text-xl btn-circle hover:text-red-600">
                  <CgTrash />
                </button>
              </div>
            </div>
            <div className="divider"></div>
          </div>
        )}
        {/* List of categories */}
        <div className="my-3">
          {categories &&
            categories.map((category) => {
              return (
                <CategoryItem
                  key={category.Id}
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
