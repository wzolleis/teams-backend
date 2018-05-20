// ssl wenn wir auf Heroku gestartet werden, kein ssl wenn die db lokal angebunden ist
import { Pool, PoolClient } from 'pg'

export const dbUseSsl: boolean = !process.env.DATABASE_LOCAL;

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: dbUseSsl
});


class DatabaseIO {
    connect = async (): Promise<PoolClient> => {
       return pool.connect()
    }

    query = async (query: string): Promise<any> => {
        const client = await this.connect();
        const result: object = await client.query(query);
        await this.release(client);
        return result;
    }

    release = async (client: PoolClient) => {
        client.release();
    }
}

export const databaseIo = new DatabaseIO();