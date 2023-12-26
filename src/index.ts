import { Telegraf } from 'telegraf';
import connectToDatabase from './config/database';
import { searchBookCommand, onBookSelect, getMyBooksCommand, removeBookCommand, addBookToFavorites, handleDeleteBook} from './commands/commandHandlers';
import { botConfig } from './config/botConfig';

const bot = new Telegraf(botConfig.token);

// Подключаемся к базе данных
connectToDatabase().then(() => {
  console.log('Connected to database');
}).catch((error) => {
  console.error('Database connection failed:', error);
});

// Определяем команды и обработчики
bot.start((ctx) => ctx.reply('Welcome to the Book Bot! Use /search to find books.'));
bot.help((ctx) => ctx.reply("Commands: /start, /search, /mybooks"));
bot.command('search', searchBookCommand);
bot.command('mybooks', getMyBooksCommand);
bot.command('removebook', removeBookCommand);

// Обработка событий callback_query
bot.on('callback_query', async (ctx) => {
    if (ctx.callbackQuery && 'data' in ctx.callbackQuery) {
      const action = ctx.callbackQuery.data;
      const viewMatch = action.match(/^view_(\w+)_(\d+)$/);
      const addMatch = action.match(/^add_(\w+)_(\d+)$/);
      const deleteMatch = action.match(/^delete_(.+)$/);
      if (deleteMatch) {
        const bookId = deleteMatch[1];
        await handleDeleteBook(ctx, bookId);
      }
      if (viewMatch) {
        const searchId = viewMatch[1];
        const selectedIndex = parseInt(viewMatch[2], 10);
        await onBookSelect(ctx, searchId, selectedIndex);
      } else if (addMatch) {
        const searchId = addMatch[1];
        const selectedIndex = parseInt(addMatch[2], 10);
        await addBookToFavorites(ctx, searchId, selectedIndex);
      }
    }
  });
  

// Запуск бота
bot.launch().then(() => {
  console.log('Bot started successfully');
}).catch((error) => {
  console.error('Failed to start the bot:', error);
});
