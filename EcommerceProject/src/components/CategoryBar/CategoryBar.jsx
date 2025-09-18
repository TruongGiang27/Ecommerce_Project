import React from "react";
import "./CategoryBar.css";

const CategoryBar = ({ onCategoryClick }) => {
  return (
    <div className="category-bar">
      <button onClick={() => onCategoryClick("Thiết kế")}>Thiết kế</button>
      <button onClick={() => onCategoryClick("Văn phòng")}>Văn phòng</button>
      <button onClick={() => onCategoryClick("Lập trình")}>Lập trình</button>
    </div>
  );
};

export default CategoryBar;
