import serverlessExpress from '@vendia/serverless-express';
import app from '../http/swagger/app';

const serverlessHandler = serverlessExpress({ app });

export const serve = (event, context, callback) => {
  console.log('Evento Lambda recibido:', event.path);
  return serverlessHandler(event, context, callback);
};
