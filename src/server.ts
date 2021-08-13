import app from './app';

const port: string | number = process.env.PORT;
const env: string = process.env.NODE_ENV;

app.listen(port, () =>
  process.stdout.write(`Server running in ${env} mode on port: ${port} \n`)
);
