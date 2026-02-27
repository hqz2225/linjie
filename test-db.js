const { getNovels } = require('./src/lib/db');

getNovels().then(console.log).catch(console.error);
