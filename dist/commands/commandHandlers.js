"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMyBooksCommand = exports.removeBookCommand = exports.addBookToFavorites = exports.handleDeleteBook = exports.onBookSelect = exports.searchBookCommand = void 0;
var telegraf_1 = require("telegraf");
var bookService_1 = require("../services/bookService");
// Use a Map to store search results
var bookSearchResults = new Map();
var searchBookCommand = function (ctx) { return __awaiter(void 0, void 0, void 0, function () {
    var bookTitle, books, searchId_1, keyboard;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (!(ctx.message && ctx.message.text)) return [3 /*break*/, 5];
                bookTitle = ctx.message.text.split(' ').slice(1).join(' ');
                return [4 /*yield*/, (0, bookService_1.searchForBooks)(bookTitle)];
            case 1:
                books = _a.sent();
                if (!(books.length > 0)) return [3 /*break*/, 3];
                searchId_1 = Math.random().toString(36).substring(7);
                bookSearchResults.set(searchId_1, books);
                keyboard = {
                    reply_markup: {
                        inline_keyboard: books.map(function (book, index) { return [
                            { text: book.title, callback_data: "view_".concat(searchId_1, "_").concat(index) }
                        ]; })
                    }
                };
                return [4 /*yield*/, ctx.reply('Please choose a book:', keyboard)];
            case 2:
                _a.sent();
                return [3 /*break*/, 5];
            case 3: return [4 /*yield*/, ctx.reply('No books found.')];
            case 4:
                _a.sent();
                _a.label = 5;
            case 5: return [2 /*return*/];
        }
    });
}); };
exports.searchBookCommand = searchBookCommand;
var onBookSelect = function (ctx, searchId, selectedIndex) { return __awaiter(void 0, void 0, void 0, function () {
    var books, selectedBook, detailsKeyboard, bookDetails;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                books = bookSearchResults.get(searchId);
                selectedBook = books ? books[selectedIndex] : null;
                if (!selectedBook) return [3 /*break*/, 5];
                detailsKeyboard = {
                    reply_markup: {
                        inline_keyboard: [
                            [{ text: "Add to Favorites", callback_data: "add_".concat(searchId, "_").concat(selectedIndex) }]
                        ]
                    }
                };
                bookDetails = "Title: ".concat(selectedBook.title, "\nAuthor: ").concat(selectedBook.author);
                if (!selectedBook.cover) return [3 /*break*/, 2];
                return [4 /*yield*/, ctx.replyWithPhoto({ url: selectedBook.cover }, { caption: bookDetails, reply_markup: detailsKeyboard.reply_markup })];
            case 1:
                _a.sent();
                return [3 /*break*/, 4];
            case 2: 
            // If there's no cover image, just send the details with the button
            return [4 /*yield*/, ctx.reply(bookDetails, detailsKeyboard)];
            case 3:
                // If there's no cover image, just send the details with the button
                _a.sent();
                _a.label = 4;
            case 4: return [3 /*break*/, 7];
            case 5: return [4 /*yield*/, ctx.reply('Book not found.')];
            case 6:
                _a.sent();
                _a.label = 7;
            case 7: return [2 /*return*/];
        }
    });
}); };
exports.onBookSelect = onBookSelect;
var handleDeleteBook = function (ctx, bookId) { return __awaiter(void 0, void 0, void 0, function () {
    var userId;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (!ctx.from) return [3 /*break*/, 4];
                userId = ctx.from.id.toString();
                return [4 /*yield*/, (0, bookService_1.removeBookFromUserList)(userId, bookId)];
            case 1:
                _a.sent();
                return [4 /*yield*/, ctx.answerCbQuery('Book removed from your list.')];
            case 2:
                _a.sent();
                return [4 /*yield*/, ctx.editMessageReplyMarkup({ inline_keyboard: [] })];
            case 3:
                _a.sent(); // Optional: Remove the keyboard
                return [3 /*break*/, 6];
            case 4: return [4 /*yield*/, ctx.reply('Book not found.')];
            case 5:
                _a.sent();
                _a.label = 6;
            case 6: return [2 /*return*/];
        }
    });
}); };
exports.handleDeleteBook = handleDeleteBook;
var addBookToFavorites = function (ctx, searchId, selectedIndex) { return __awaiter(void 0, void 0, void 0, function () {
    var userId, books, selectedBook;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (!ctx.from) return [3 /*break*/, 5];
                userId = ctx.from.id.toString();
                books = bookSearchResults.get(searchId);
                selectedBook = books ? books[selectedIndex] : null;
                if (!selectedBook) return [3 /*break*/, 3];
                return [4 /*yield*/, (0, bookService_1.addBookToUserList)(userId, selectedBook)];
            case 1:
                _a.sent();
                return [4 /*yield*/, ctx.reply("Book '".concat(selectedBook.title, "' added to your favorites."))];
            case 2:
                _a.sent();
                bookSearchResults.delete(searchId); // Clean up the search results
                return [3 /*break*/, 5];
            case 3: return [4 /*yield*/, ctx.reply('Book not found.')];
            case 4:
                _a.sent();
                _a.label = 5;
            case 5: return [2 /*return*/];
        }
    });
}); };
exports.addBookToFavorites = addBookToFavorites;
var removeBookCommand = function (ctx) { return __awaiter(void 0, void 0, void 0, function () {
    var parts, bookId, userId;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (!(ctx.message && ctx.message.text && ctx.from)) return [3 /*break*/, 3];
                parts = ctx.message.text.split(' ');
                bookId = parts[1];
                userId = ctx.from.id.toString();
                return [4 /*yield*/, (0, bookService_1.removeBookFromUserList)(userId, bookId)];
            case 1:
                _a.sent();
                return [4 /*yield*/, ctx.reply('Book removed from your list.')];
            case 2:
                _a.sent();
                _a.label = 3;
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.removeBookCommand = removeBookCommand;
var getMyBooksCommand = function (ctx) { return __awaiter(void 0, void 0, void 0, function () {
    var userId, books, keyboard;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (!ctx.from) return [3 /*break*/, 5];
                userId = ctx.from.id.toString();
                return [4 /*yield*/, (0, bookService_1.getUserBookList)(userId)];
            case 1:
                books = _a.sent();
                if (!(books.length > 0)) return [3 /*break*/, 3];
                keyboard = telegraf_1.Markup.inlineKeyboard(books.map(function (book) { return [
                    telegraf_1.Markup.button.callback(book.title, 'noop'),
                    telegraf_1.Markup.button.callback('❌', "delete_".concat(book._id))
                ]; }));
                return [4 /*yield*/, ctx.reply('Here is your book list:', keyboard)];
            case 2:
                _a.sent();
                return [3 /*break*/, 5];
            case 3: return [4 /*yield*/, ctx.reply('Your book list is empty.')];
            case 4:
                _a.sent();
                _a.label = 5;
            case 5: return [2 /*return*/];
        }
    });
}); };
exports.getMyBooksCommand = getMyBooksCommand;
