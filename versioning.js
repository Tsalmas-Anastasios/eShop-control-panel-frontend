
(() => {

    try {

        const fs = require('fs');
        const moment = require('moment');
        const crypto = require('crypto');

        const version = require('./package.json').version;

        const metadata = {
            version: version,
            hash: crypto.createHash('sha256').update(`${version}__${new Date().getTime().toString()}`).digest('hex'),
            build_date: new Date()
        };

        fs.writeFileSync('./src/app-metadata.json', JSON.stringify(metadata, null, '\t'), 'utf-8');

    } catch (error) {
        console.log(error);
    }

    return;

})();