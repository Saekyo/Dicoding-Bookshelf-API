const {
  nanoid,
} = require('nanoid');
const books = require('./books');

const addBookHandler = (request, handler) => {
  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
  } = request.payload;
  const id = nanoid(16);
  const insertedAt = new Date().toISOString();
  const updatedAt = insertedAt;
  const finished = pageCount === readPage;

  if (!name) {
    const response = handler.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. Mohon isi nama buku',
    });
    response.code(400);
    return response;
  }

  if (readPage > pageCount) {
    const response = handler.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
    });
    response.code(400);
    return response;
  }

  const newBook = {
    id,
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    finished,
    reading,
    insertedAt,
    updatedAt,
  };

  books.push(newBook);

  const success = books.filter((book) => book.id === id).length > 0;

  if (success) {
    const response = handler.response({
      status: 'success',
      message: 'Buku berhasil ditambahkan',
      data: {
        bookId: id,
      },
    });
    response.code(201);
    return response;
  }

  const response = handler.response({
    status: 'fail',
    message: 'Buku gagal ditambahkan',
  });
  response.code(500);
  return response;
};

const getAllBooksHandler = (request, handler) => {
  let booksArray = books;
  const filterResult = [];
  const booksResult = [];
  const {
    reading,
    finished,
    name: bookName,
  } = request.query;

  if (bookName) {
    const stringRegex = new RegExp(`\\b${bookName}\\b`, 'gi');
    books.forEach((book) => {
      if (book.name.match(stringRegex)) {
        filterResult.push(book);
      }
    });
    booksArray = filterResult;
  }

  if (reading !== undefined) {
    if (reading === '1') {
      books.forEach((book) => {
        if (book.reading) {
          filterResult.push(book);
        }
      });
      booksArray = filterResult;
    } else if (reading === '0') {
      books.forEach((book) => {
        if (!book.reading) {
          filterResult.push(book);
        }
      });
      booksArray = filterResult;
    }
  }
  if (finished !== undefined) {
    if (finished === '1') {
      books.forEach((book) => {
        if (book.finished) {
          filterResult.push(book);
        }
      });
      booksArray = filterResult;
    } else if (finished === '0') {
      books.forEach((book) => {
        if (!book.finished) {
          filterResult.push(book);
        }
      });
      booksArray = filterResult;
    }
  }

  if (booksArray) {
    booksArray.forEach((book) => {
      const {
        id,
        name,
        publisher,
      } = book;

      booksResult.push({
        id,
        name,
        publisher,
      });
    });
  }

  const response = handler.response({
    status: 'success',
    data: {
      books: booksResult,
    },
  });

  response.code(200);
  return response;
};

const getDetailBookByIdHandler = (request, handler) => {
  const {
    id,
  } = request.params;
  const book = books.filter((item) => item.id === id)[0];

  if (book) {
    return {
      status: 'success',
      data: {
        book,
      },
    };
  }

  const response = handler.response({
    status: 'fail',
    message: 'Buku tidak ditemukan',
  });
  response.code(404);
  return response;
};

const editBookByIdHandler = (request, handler) => {
  const {
    id,
  } = request.params;
  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
  } = request.payload;

  if (!name) {
    const response = handler.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. Mohon isi nama buku',
    });
    response.code(400);
    return response;
  }

  if (readPage > pageCount) {
    const response = handler.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
    });
    response.code(400);
    return response;
  }

  const index = books.findIndex((book) => book.id === id);
  const updatedAt = new Date().toISOString();

  if (index !== -1) {
    books[index] = {
      ...books[index],
      name,
      year,
      author,
      summary,
      publisher,
      pageCount,
      readPage,
      reading,
      updatedAt,
    };
    const response = handler.response({
      status: 'success',
      message: 'Buku berhasil diperbarui',
    });
    response.code(200);
    return response;
  }

  const response = handler.response({
    status: 'fail',
    message: 'Gagal memperbarui buku. Id tidak ditemukan',
  });

  response.code(404);
  return response;
};

const deleteBookByIdHandler = (request, handler) => {
  const {
    id,
  } = request.params;

  const index = books.findIndex((book) => book.id === id);

  if (index !== -1) {
    books.splice(index, 1);
    const response = handler.response({
      status: 'success',
      message: 'Buku berhasil dihapus',
    });
    response.code(200);
    return response;
  }

  const response = handler.response({
    status: 'fail',
    message: 'Buku gagal dihapus. Id tidak ditemukan',
  });
  response.code(404);
  return response;
};

module.exports = {
  addBookHandler,
  getAllBooksHandler,
  getDetailBookByIdHandler,
  editBookByIdHandler,
  deleteBookByIdHandler,
};
