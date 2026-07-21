import { useEffect, useState } from "react";
import { fetchCategoriesThunk } from "../../thunkActionsCreator/categoriesThunks";
import { useDispatch, useSelector } from "react-redux";
import { fetchProductsThunk } from "../../thunkActionsCreator/productsThunks";
import { setFilters } from "../../slices/filtersSlice";

export default function Filters() {
  const dispatch = useDispatch();
  const { items: categories, loading: categoriesLoading } = useSelector(
    (state) => state.categories,
  );
  const { list, loading, error } = useSelector((state) => state.products);
  const filters = useSelector((state) => state.filters);

  useEffect(() => {
    dispatch(fetchCategoriesThunk());
  }, [dispatch]);

  useEffect(() => {
    dispatch(fetchProductsThunk({ ...filters, page: 1, per_page: 20 }));
  }, [filters, dispatch]);

  const handleSearchChange = (e) => {
    dispatch(setFilters({ search: e.target.value }));
  };

  const handleCategoryChange = (e) => {
    dispatch(setFilters({ category: e.target.value }));
  };

  const handleSortChange = (e) => {
    const [orderby, order] = e.target.value.split("-");
    dispatch(setFilters({ orderby, order }));
  };

  const handlePriceChange = (e) => {
    const { name, value } = e.target;
    dispatch(setFilters({ [name]: value }));
  };

  return (
    <>
      <input
        type="text"
        value={filters.search}
        onChange={handleSearchChange}
        placeholder="Rechercher..."
      />
      <select value={filters.category} onChange={handleCategoryChange}>
        <option value="">Toutes les catégories</option>
        {categories.map((cat) => (
          <option
            key={cat.id}
            value={cat.id}
            dangerouslySetInnerHTML={{ __html: cat.name }}
          ></option>
        ))}
      </select>
      <input
        type="number"
        name="min_price"
        value={filters.min_price}
        onChange={handlePriceChange}
        placeholder="Prix min (€)"
      />
      <input
        type="number"
        name="max_price"
        value={filters.max_price}
        onChange={handlePriceChange}
        placeholder="Prix max (€)"
      />
      <select
        value={`${filters.orderby}-${filters.order}`}
        onChange={handleSortChange}
      >
        <option value="date-desc">Nouveautés</option>
        <option value="price-asc">Prix : du - cher au + cher</option>
        <option value="price-desc">Prix : du + cher au - cher</option>
        <option value="title-asc">Nom : A à Z</option>
      </select>
    </>
  );
}
