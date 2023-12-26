import { fetchBooksFromAPI } from '../integrations/bookDatabaseAPI';
import BookModel from '../models/bookModel';
import { IBook } from '../types/book';

export const searchForBooks = async (title: string): Promise<IBook[]> => {
  try {
    const booksData = await fetchBooksFromAPI(title);
    console.log(booksData);
    
    return booksData.map((book: any) => ({
      title: book.title,
      author: book.author_name?.join(', ') || 'Unknown Author',
      cover: book.cover_i ? `https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg` : null,
    }));
  } catch (error) {
    console.error('searchForBooks error:', error);
    return [];
  }
};
export const addBookToUserList = async (userId: string, book: IBook): Promise<IBook | undefined> => {
  try {
    let bookRecord = await BookModel.findOne({ title: book.title, author: book.author });
    if (!bookRecord) {
      bookRecord = new BookModel({ ...book, users: [userId] });
    } else if (!bookRecord.users.includes(userId)) {
      bookRecord.users.push(userId);
    }
    await bookRecord.save();
    return bookRecord;
  } catch (error) {
    console.error('addBookToUserList error:', error);
  }
};



export const removeBookFromUserList = async (userId: string, bookId: string): Promise<void> => {
  const book = await BookModel.findById(bookId);
  if (book) {
    book.users = book.users.filter(user => user !== userId);
    await book.save();
  }
};

export const getUserBookList = async (userId: string) => {
  const books = await BookModel.find({ users: userId });
  return books;
};
