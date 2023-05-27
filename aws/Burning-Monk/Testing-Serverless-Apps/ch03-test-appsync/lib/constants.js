const DynamoDB = {
  STREAM_EVENT_NAMES: {
    INSERT: 'INSERT',
    UPDATE: 'UPDATE',
    REMOVE: 'REMOVE'
  },
  MAX_BATCH_SIZE: 100
}

module.exports = {
  DynamoDB,
}