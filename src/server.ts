import app from './app';

const port: string | number = process.env.PORT;

app.listen(port, () =>
  process.stdout.write(`Server listening on port: ${port} \n`)
);
