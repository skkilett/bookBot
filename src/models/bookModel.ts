import mongoose from 'mongoose';
import { IBook } from '../types/book';

const bookSchema = new mongoose.Schema<IBook>({
  title: { type: String, required: true },
  author: { type: String, required: true },
  cover: { type: String },
  users: [{ type: String }]
});

const BookModel = mongoose.model<IBook>('Book', bookSchema);

export default BookModel;
