import apiConfig from "@api/routes";
import { QueryFunctionContext } from "@tanstack/react-query";

export const getAllProductsByFilter = async ({
  queryKey,
}: QueryFunctionContext) => {
  const [, token, filters] = queryKey as [
    string,
    string,
    { priceRange: [priceMin: number, priceMax: number]; condition: string, searchQuery: string }
  ];


  const response = await fetch(
    `${apiConfig.products.getByFilter}?sortBy=${filters.condition}&minPrice=${filters.priceRange[0]}&maxPrice=${filters.priceRange[1]}&q=${filters.searchQuery}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        authorization: `${token}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error("Произошла ошибка получения товаров");
  }

  return response.json();
};
