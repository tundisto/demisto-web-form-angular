import { Injectable } from '@angular/core';
import { Subject, BehaviorSubject, Subscription } from 'rxjs';
import { HttpHeaders, HttpClient, HttpErrorResponse } from '@angular/common/http';
import { DemistoProperties } from './types/demisto-properties';
import { User } from './types/user';
import { ApiStatus } from './types/api-status';
import { ClientOptions } from './types/client-options';
import { DemistoCaseParams } from './types/demisto-case-params';

declare var JSEncrypt: any;

@Injectable()

export class FetcherService {

  constructor( private http: HttpClient ) {}



  demistoProperties: DemistoProperties; // gets set during test
  apiPath = '/api';
  currentUser: User;
  private publicKey: string;
  encryptor: any;



  getPublicKey(): Promise<string> {
    let headers = this.buildHeaders();
    return this.http.get(this.apiPath + '/publicKey', { headers } )
                    .toPromise()
                    .then( (value: any) => this.publicKey = value.publicKey );
  }



  async initEncryption(): Promise<any> {
    await this.getPublicKey();
    this.encryptor = new JSEncrypt();
    this.encryptor.setPublicKey(this.publicKey);
  }



  encrypt(str): string {
    return this.encryptor.encrypt(str);
  }



  getLoggedInUser(): Promise<User> {
    let headers = new HttpHeaders( {
      Accept: 'application/json'
    } );
    return this.http.get(this.apiPath + '/whoami', { headers } )
                    .toPromise()
                    .then( (user: User) => {
                      this.currentUser = user;
                      return user;
                     } );
  }



  getApiStatus(): Promise<ApiStatus> {
    let headers = new HttpHeaders( {
      Accept: 'application/json'
    } );
    return this.http.get(this.apiPath + '/apiStatus', { headers } )
                    .toPromise()
                    .then( (status: ApiStatus) => status );
  }



  getClientOptions(): Promise<ClientOptions> {
    let headers = new HttpHeaders( {
      Accept: 'application/json'
    } );
    return this.http.get(this.apiPath + '/clientOptions', { headers } )
                    .toPromise()
                    .then( (clientOptions: ClientOptions) => {
                      return clientOptions;
                     } );
  }



  buildHeaders(authUser = null): HttpHeaders {
    let headers = new HttpHeaders(
      {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      }
    );
    if (authUser) {
      headers = headers.set('Authorization', authUser);
    }
    return headers;
  }



  testDemisto( demistoProperties: DemistoProperties ): Promise<any> {
    if ('apiKey' in demistoProperties) {
      demistoProperties.apiKey = this.encrypt(demistoProperties.apiKey);
    }
    this.demistoProperties = demistoProperties;
    let headers = this.buildHeaders();
    // headers = headers.append('Authorization', this.demistoProperties.apiKey);
    return this.http.post(this.apiPath + '/testConnect', demistoProperties, { headers } )
                    .toPromise();
  }



  createDemistoIncident( params: DemistoCaseParams ): Promise<any> {
    let headers = this.buildHeaders(this.currentUser.username);
    console.log('Current User: ', this.currentUser.username);
    return this.http.post(this.apiPath + '/createDemistoIncident', params, { headers } )
                    .toPromise();
  }

}
