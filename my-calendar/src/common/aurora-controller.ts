import { Client } from 'pg';

export interface testDbModel {
  id: number;
  name: string;
}

const client = new Client({
  user: 'postgres',
  host: 'aurora-test.cluster-ci879ikyf19u.ap-northeast-1.rds.amazonaws.com',
  database: 'test_db',
  password: 'mypassword',
  port: 5432,
});

export const insertProc = async (): Promise<boolean> => {
  console.info('insertProcメソッド開始');
  client.connect();
  console.log('connected');
  const query = {
    text: 'INSERT INTO test(id, name) VALUES($1, $2)',
    values: [1, 'test1'],
  };

  try {
    const res = await client.query(query);
    console.info(res);
  } catch (err) {
    console.log(err);
  } finally {
    client.end();
  }
  return true;
  //   client
  //     .query(query)
  //     .then((res) => {
  //       console.log(res.rows);
  //     })
  //     .catch((err) => console.error('connection error', err.stack))
  //     .then(() => client.end())
  //     .then(() => console.log('disconnected'));
};

export const selectProc = async (): Promise<testDbModel | undefined> => {
  console.info('selectProcメソッド開始');
  client.connect();
  console.log('connected');
  const query = {
    text: 'SELECT * FROM test',
  };

  let data: undefined;

  try {
    const res = await client.query(query);
    console.info(res);
    data = res.rows[0];
  } catch (err) {
    console.log(err);
  } finally {
    client.end();
  }
  return data;
};
