import knex from "knex";
const knexQ = knex({
    client: 'mysql',
    debug: false,
    connection: {
        host: 'us-east.connect.psdb.cloud',
        port: 3306,
        user: 'xnlyfyd2viu56yf330ic',
        password: 'pscale_pw_8azao4CqGkMRYw9WPW2mNF7xWI3sA0qcysZmBbqm1D9',
        database: 'ultrasearch',
        ssl: true
    }
});

export default knexQ