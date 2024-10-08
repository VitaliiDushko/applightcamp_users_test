import {
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { mock } from 'jest-mock-extended';
import { Response, Request } from 'express';
import { DatabaseExceptionFilter } from './database-exception-filter';

describe('DatabaseExceptionFilter', () => {
  let filter: DatabaseExceptionFilter;
  let mockLogger: Logger;

  // Mocking the necessary objects
  const mockResponse = mock<Response>();
  const mockRequest = mock<Request>();
  const mockHost = mock<ArgumentsHost>();

  beforeEach(() => {
    // Mock the logger and override the error method
    mockLogger = new Logger();
    jest.spyOn(mockLogger, 'error').mockImplementation();

    // Create the filter instance
    filter = new DatabaseExceptionFilter();

    // Mock the request and response
    mockHost.switchToHttp.mockReturnValue({
      getRequest: () => mockRequest,
      getResponse: () => mockResponse,
    } as any);

    mockRequest.url = '/test';
    mockResponse.status.mockReturnThis();
    mockResponse.json.mockReturnThis();

    // Override the logger in the filter with the mocked logger
    (filter as any).logger = mockLogger;
  });

  it('should log the error and return 500 status for non-HttpException', () => {
    const error = new Error('Test database error');

    filter.catch(error, mockHost);

    // Verify the logger error method was called
    expect(mockLogger.error).toHaveBeenCalledWith(error.message, error);

    // Verify that the response status and json were called correctly
    expect(mockResponse.status).toHaveBeenCalledWith(
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
    expect(mockResponse.json).toHaveBeenCalledWith({
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      timestamp: expect.any(String),
      path: '/test',
      message: 'Database is temporarily unavailable. Please try again later.',
    });
  });

  it('should return the status and message for HttpException', () => {
    const errorMessage = 'Forbidden access';
    const httpException = new HttpException(errorMessage, HttpStatus.FORBIDDEN);

    filter.catch(httpException, mockHost);

    // Verify the logger error method was called
    expect(mockLogger.error).toHaveBeenCalledWith(
      httpException.message,
      httpException,
    );

    // Verify that the response status and json were called correctly
    expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.FORBIDDEN);
    expect(mockResponse.json).toHaveBeenCalledWith({
      statusCode: HttpStatus.FORBIDDEN,
      timestamp: expect.any(String),
      path: '/test',
      message: 'Database is temporarily unavailable. Please try again later.',
    });
  });
});
