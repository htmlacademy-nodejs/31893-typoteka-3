'use strict';

const DEFAULT_COMMAND = `--help`;
const USER_ARGV_INDEX = 2;

const FILE_NAME = `mocks.json`;

const MAX_ID_LENGTH = 6;
const API_PREFIX = `/api`;

const ExitCode = {
  success: 0,
  error: 1
};

const HttpCode = {
  OK: 200,
  CREATED: 201,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
  FORBIDDEN: 403,
  UNAUTHORIZED: 401,
  BAD_REQUEST: 400
};

module.exports = {
  FILE_NAME,
  MAX_ID_LENGTH,
  API_PREFIX,
  HttpCode,
  DEFAULT_COMMAND,
  USER_ARGV_INDEX,
  ExitCode
};
