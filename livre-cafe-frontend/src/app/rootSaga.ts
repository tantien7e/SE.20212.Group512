import { all } from 'redux-saga/effects';

function* helloSaga() {
  console.log('Hello Saga');
}

export default function* rootSaga() {
  console.log('root Saga');
  yield all([helloSaga()]);
}
