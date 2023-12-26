import { Context, Markup } from 'telegraf';
import { searchForBooks, addBookToUserList, getUserBookList, removeBookFromUserList } from '../services/bookService';
import { IBook } from '../types/book';

type TelegrafContext = Context & { message?: { text: string, from: { id: number } } };

// Use a Map to store search results
const bookSearchResults = new Map<string, IBook[]>();

export const searchBookCommand = async (ctx: TelegrafContext): Promise<void> => {
  if (ctx.message && ctx.message.text) {
    const bookTitle = ctx.message.text.split(' ').slice(1).join(' ');
    const books = await searchForBooks(bookTitle);
    if (books.length > 0) {
      const searchId = Math.random().toString(36).substring(7);
      bookSearchResults.set(searchId, books);

      const keyboard = {
        reply_markup: {
          inline_keyboard: books.map((book, index) => [
            { text: book.title, callback_data: `view_${searchId}_${index}` }
          ])
        }
      };
      await ctx.reply('Please choose a book:', keyboard);
    } else {
      await ctx.reply('No books found.');
    }
  }
};

export const onBookSelect = async (ctx: TelegrafContext, searchId: string, selectedIndex: number): Promise<void> => {
  const books = bookSearchResults.get(searchId); // Retrieve the search results
  const selectedBook = books ? books[selectedIndex] : null;

  if (selectedBook) {
    // Prepare the 'Add to Favorites' button
    const detailsKeyboard = {
      reply_markup: {
        inline_keyboard: [
          [{ text: "Add to Favorites", callback_data: `add_${searchId}_${selectedIndex}` }]
        ]
      }
    };

    // Prepare book details message
    let bookDetails = `Title: ${selectedBook.title}\nAuthor: ${selectedBook.author}`;
    
    // Send the photo of the cover with the book details as caption
    if (selectedBook.cover) {
      await ctx.replyWithPhoto({ url: selectedBook.cover }, { caption: bookDetails, reply_markup: detailsKeyboard.reply_markup });
    } else {
      // If there's no cover image, just send the details with the button
      await ctx.reply(bookDetails, detailsKeyboard);
    }
  } else {
    await ctx.reply('Book not found.');
  }
};
export const handleDeleteBook = async (ctx: TelegrafContext, bookId: string): Promise<void> => {
  if (ctx.from) {
    const userId = ctx.from.id.toString();
    await removeBookFromUserList(userId, bookId);
    await ctx.answerCbQuery('Book removed from your list.');
  await ctx.editMessageReplyMarkup({ inline_keyboard: [] }); // Optional: Remove the keyboard
} else {
  await ctx.reply('Book not found.');
}
}


export const addBookToFavorites = async (ctx: TelegrafContext, searchId: string, selectedIndex: number): Promise<void> => {
  if (ctx.from) {
    const userId = ctx.from.id.toString();
    const books = bookSearchResults.get(searchId); // Retrieve the search results
    const selectedBook = books ? books[selectedIndex] : null;

    if (selectedBook) {
      await addBookToUserList(userId, selectedBook);
      await ctx.reply(`Book '${selectedBook.title}' added to your favorites.`);
      bookSearchResults.delete(searchId); // Clean up the search results
    } else {
      await ctx.reply('Book not found.');
    }
  }
};


export const removeBookCommand = async (ctx: TelegrafContext): Promise<void> => {
  if (ctx.message && ctx.message.text && ctx.from) {
    const parts = ctx.message.text.split(' ');
    const bookId = parts[1];
    const userId = ctx.from.id.toString();
    await removeBookFromUserList(userId, bookId);
    await ctx.reply('Book removed from your list.');
  }
};

export const getMyBooksCommand = async (ctx: TelegrafContext): Promise<void> => {
  if (ctx.from) {
    const userId = ctx.from.id.toString();
    const books = await getUserBookList(userId);
    if (books.length > 0) {
      const keyboard = Markup.inlineKeyboard(
        books.map(book => [
          Markup.button.callback(book.title, 'noop'), // 'noop' - это placeholder, замените на нужный callback_data
          Markup.button.callback('❌', `delete_${book._id}`)
        ])
      );
      await ctx.reply('Here is your book list:', keyboard);
    } else {
      await ctx.reply('Your book list is empty.');
    }
  }
};


