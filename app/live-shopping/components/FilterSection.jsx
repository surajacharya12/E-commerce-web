"use client";
import React from "react";

const FilterSection = ({ sectionTitle, items, selectedItems, toggleFilter, setList, labelKey = "name" }) => {
  return (
    <div className="mb-6 border-b pb-4">
      <h3 className="text-lg font-semibold mb-3">{sectionTitle}</h3>
      <div className="max-h-40 overflow-y-auto space-y-2 pr-2 custom-scrollbar">
        {items.map((item) => (
          <label
            key={item._id}
            className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 cursor-pointer"
          >
            <input
              type="checkbox"
              className="form-checkbox text-blue-600 rounded"
              checked={selectedItems.includes(item._id)}
              onChange={() => toggleFilter(selectedItems, setList, item._id)}
            />
            {sectionTitle === "Colors" && item.hexCode ? (
              <div
                className="w-4 h-4 rounded-full border border-gray-300"
                style={{ backgroundColor: item.hexCode }}
                title={item[labelKey]}
              ></div>
            ) : null}
            <span>{item[labelKey]}</span>
          </label>
        ))}
      </div>
    </div>
  );
};

export default FilterSection;