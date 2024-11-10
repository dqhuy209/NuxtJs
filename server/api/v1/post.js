// import { faker } from "@faker-js/faker";

// export default defineEventHandler(async (event) => {
//   //return for me a list of product data with 10 items using faker
//   return Array.from({ length: 10 }, () => {
//     return {
//       id: faker.string.uuid(),
//       name: faker.commerce.productName(),
//       price: faker.commerce.price(),
//       description: faker.commerce.productDescription(),
//       image: faker.image.urlPlaceholder(),
//     };
//   });
// });
const apiKey = "66ed419e928445eda192a63a4fa4deac";
export default defineEventHandler(async (event) => {
  const { q = "tesla", page = 1, pageSize = 10 } = getQuery(event);
  try {
    const data = await $fetch(`https://newsapi.org/v2/everything`, {
      params: {
        q,
        apiKey,
        page,
        pageSize,
      },
    });
    return data;
  } catch (error) {
    return { error: "Failed to fetch news data" };
  }
});
