import { CustomerInterface } from '@app/models/customer.interface';
import { OrderInterface } from '@app/models/order.interface';
import { useState, useEffect } from 'react';

interface OptionInterface {
  method: string;
  headers: {
    'Content-Type': string;
  };
  body: string;
}

export const useFetch = (url: string, method = 'GET') => {
  const [data, setData] = useState<(CustomerInterface | OrderInterface)[]>();
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string>('');
  const [option, setOptions] = useState<OptionInterface>({
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    body: '',
  });

  const postData = (
    newData: Omit<CustomerInterface | OrderInterface, '_id'>,
  ) => {
    setOptions({
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newData),
    });
  };

  useEffect(() => {
    const controller = new AbortController();

    const fetchData = async (fetchOption?: OptionInterface) => {
      setIsPending(true);

      try {
        const res = await fetch(url, {
          ...fetchOption,
          signal: controller.signal,
        });
        if (!res.ok) {
          throw new Error(res.statusText);
        }
        const fetchDataRes = await res.json();

        setIsPending(false);
        setData(fetchDataRes);
        setError('');
      } catch (err: any) {
        if (err.name === 'AbortError') {
          console.log('the fetch was aborted');
        } else {
          setIsPending(false);
          setError('Could not fetch the data');
        }
      }
    };

    if (method == 'GET') fetchData();

    if (method == 'POST' && option) fetchData(option);

    return () => {
      controller.abort();
    };
  }, [url, option, method]);

  return { data, isPending, error, postData };
};
