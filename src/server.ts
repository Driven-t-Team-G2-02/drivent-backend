import dns from 'dns';
import app, { init } from '@/app';

dns.setDefaultResultOrder('ipv4first');

const port = +process.env.PORT || 4000;

init().then(() => {
  app.listen(port, () => {
    /* eslint-disable-next-line no-console */
    console.log(`Server is listening on port ${port}.`);
  });
});
