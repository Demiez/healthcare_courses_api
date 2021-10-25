export const handleAsyncError = <T>(promiseFunction: Promise<T>) => {
  return promiseFunction
    .then((data: T) => [data, undefined])
    .catch((error) => Promise.resolve([undefined, error]));
};
