import { HttpService, HttpStatus, Injectable } from '@nestjs/common';
import { AuthResponseInterface } from '../interfaces/AuthResponse.interface';
import { base_url, api_key, max_number_of_retries } from '../config.json';

@Injectable()
export class MainHttpService {
  private headers = {
    Authorization: '',
  };

  constructor(private httpService: HttpService) {}

  async post<T>(path, body): Promise<T> {
    const response = await this.httpService
      .post(`${base_url}/${path}`, body)
      .toPromise();
    return response.data;
  }

  async get<T>(path, params?, retryNumber = 0): Promise<T> {
    try {
      return await this.pureGet(path, params);
    } catch (error) {
      if (retryNumber === max_number_of_retries) {
        throw error;
      }

      const isAuthenticationError =
        error?.response?.status === HttpStatus.UNAUTHORIZED;

      if (isAuthenticationError) {
        await this.authenticate();
      } else {
        console.log(`Some unknown error happened: ${error.toString()}`);
        console.log('Trying one more time');
      }

      return this.get<T>(path, params, retryNumber + 1);
    }
  }

  async pureGet<T>(path, params?): Promise<T> {
    const response = await this.httpService
      .get(`${base_url}/${path}`, { params, headers: this.headers })
      .toPromise();
    return response.data;
  }

  async authenticate(): Promise<void> {
    // This method is part of this service instead of some `AuthService`,
    // because we need to use this method to renew token for every failed `get` action.
    // Injecting `AuthService` in `MainHttpService` is not an option too, because it'll create circular dependency
    // (as we need `MainHttpService` in `AuthService`)

    let response;
    try {
      response = await this.post<AuthResponseInterface>('auth', {
        apiKey: api_key,
      });
    } catch (error) {
      if (!error?.data?.auth) {
        // No requirements how to handle it, so in this particular case I decided just to stop the server.
        console.error('Api key is wrong');
        process.exit(1);
      }
      console.log('Some unknown error happened');
    }

    this.token = response.token;
    console.log('authentication successful');
  }

  set token(token) {
    this.headers.Authorization = `Bearer ${token}`;
  }
}
