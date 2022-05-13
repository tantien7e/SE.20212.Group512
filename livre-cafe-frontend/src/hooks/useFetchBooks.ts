import { BookInterface } from '@app/types/product.interface';
import React, { useEffect, useState } from 'react';

function useFetchBooks(bookUrl: string) {
  const [data, setData] = useState<BookInterface[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<any>();

  const fetchBooks = async (url: string) => {
    setIsLoading(true);
    try {
      const response = await fetch(url);
      const booksData = await response.json();
      const generatedBooks = booksData.map(
        (book: Exclude<BookInterface, '_id'>, index: number) => ({
          ...book,
          _id: String(index),
          price: ((Math.random() + 0.01) * 100).toPrecision(2),
          stock: Math.round(Math.random() * 100),
        }),
      );
      setData(generatedBooks);
      setIsLoading(false);
    } catch (error) {
      setError(error);
      setIsLoading(false);
    }
  };
  useEffect(() => {
    fetchBooks(bookUrl);
  }, []);

  return { data, isLoading, error };
}

export default useFetchBooks;
