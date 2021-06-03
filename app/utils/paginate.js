const paginationMapper = require('../mappers/paginationMapper');

async function paginate(model, query, options) {
  const opts = { limit: 25, page: 1, url: process.env.SITE_URL, ...options };
  const sanitizeQuery = paginationMapper(opts);

  const limit = parseInt(sanitizeQuery.limit);
  const page = parseInt(sanitizeQuery.page);

  const results = await model.findAndCountAll({
    limit,
    offset: (page - 1) * limit,
    where: query
  });

  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;

  const pagination = {
    // The total amount of objects in the current page
    count: results.rows.length,
    // The max amount of objects that will be present in the page
    limit,
    // The total amount of objects that the paginator received
    total_count: results.count,
    // The number of the current page that is being shown
    current_page: page,
    // Describes the total amount of pages calculated, based in the total of objects sent to the paginator, and the requested limit
    total_pages: Math.ceil(results.count / limit)
  };

  if (endIndex < results.count) {
    pagination.next_page = page + 1;
    pagination.next_page_link = `${sanitizeQuery.url}?page=${page + 1}&limit=${limit}`;
  }
  if (startIndex > 0) {
    pagination.previous_page = page - 1;
    pagination.previous_page_link = `${sanitizeQuery.url}?page=${page - 1}&limit=${limit}`;
  }

  return {
    results: results.rows,
    pagination
  };
}

module.exports = paginate;
