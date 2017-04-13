import levelup from 'levelup';

export default config => {
    const db = levelup(`./${config.db}`);

    const get = k =>
        new Promise((resolve, reject) => {
            db.get(k, (err, v) => {
                if (err) return reject(err);
                return resolve(JSON.parse(v));
            });
        });

    const put = (k, v) =>
        new Promise((resolve, reject) => {
            db.put(k, JSON.stringify({ ...v, id: k }), err => {
                if (err) return reject(err);
                resolve();
            });
        });

    const del = k =>
        new Promise((resolve, reject) => {
            db.del(k, err => {
                if (err) return reject(err);
                resolve();
            });
        });

    return {
        put,
        get,
        del
    };
};
