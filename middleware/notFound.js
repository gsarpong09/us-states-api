export const notFoundHandler = (req, res) => {
    if (req.accepts('html')) {
      res.status(404).send('<h1>404 Not Found</h1>');
    } else if (req.accepts('json')) {
      res.status(404).json({ error: '404 Not Found' });
    } else {
      res.status(404).type('txt').send('404 Not Found');
    }
  };