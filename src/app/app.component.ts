import { Component, OnInit } from '@angular/core';
import { FetcherService } from './fetcher-service';
import { DemistoProperties } from './types/demisto-properties';
import { User } from './types/user';
import { ApiStatus } from './types/api-status';
import { ClientOptions } from './types/client-options';
import { SelectItem } from 'primeng/api';
import { NgForm } from '@angular/forms';
import { DemistoCaseParams } from './types/demisto-case-params';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})



export class AppComponent implements OnInit {

  constructor( private fetcherService: FetcherService ) {} // import our URL fetcher

  demistoProperties: DemistoProperties = {
    url: '',
    apiKey: '',
    trustAny: true
  };

  testResult = 'initial';
  testResultClass = '';
  loggedInUser: User;
  serverApiInit = false;
  clientOptions: ClientOptions;
  resultMessage: string;
  resultSuccess: boolean;

  // for p-messages
  messages = [];

  defaultComputerType = 'mac';
  defaultComputerFormFactor = 'laptops';
  defaultComputerModel = 'MacBook Pro 15"';
  adGroups: SelectItem[] = [];

  defaultEmployeeForm: DemistoCaseParams = {
    firstName: null,
    lastName: null,
    hireDate: null,
    workLocation: null,
    computer: {
      type: null,
      formFactor: null,
      model: null
    },
    homeAddress: {
      street1: null,
      street2: null,
      city: null,
      state: null,
      zip: null,
      country: null
    },
    phone: {
      home: null,
      mobile: null
    },
    adGroups: []
  };
  employeeForm: DemistoCaseParams = JSON.parse(JSON.stringify(this.defaultEmployeeForm));

  // Options for p-dropdowns
  countries = [];
  workLocations = [];
  computerTypes: any = {};

  testTimeout: any = null;



  resetForm() {
    this.employeeForm = JSON.parse(JSON.stringify(this.defaultEmployeeForm));
    this.employeeForm.computer.type = this.defaultComputerType;
    this.employeeForm.computer.formFactor = this.defaultComputerFormFactor;
    this.computerTypes[this.defaultComputerType][this.defaultComputerFormFactor].forEach( model => {
      if (model.name === this.defaultComputerModel) {
        this.employeeForm.computer.model = model;
      }
    } );
    this.countries.forEach(
      country => {
        if (country.name === this.clientOptions.defaultCountry) {
          this.employeeForm.homeAddress.country = country;
        }
      });
    (this.employeeForm.homeAddress as any).state = this.clientOptions.countries[this.clientOptions.defaultCountry].states[0];
    this.employeeForm.workLocation = this.workLocations[0];
  }



  async ngOnInit() {
    // Get Logged In User
    try {
      this.loggedInUser = await this.fetcherService.getLoggedInUser();
      console.log('LoggedInUser:', this.loggedInUser);
    }
    catch (err) {
      console.log('Caught error fetching logged in user:', err);
    }

    // API Init
    try {
      let res: ApiStatus = await this.fetcherService.getApiStatus();
      this.serverApiInit = res.initialised;
      if (this.serverApiInit) {
        this.messages = [{ severity: 'success', summary: 'Success', detail: 'Demisto API communication is initialised'}];
      }
      else {
        this.messages = [{ severity: 'error', summary: 'Failure', detail: 'Demisto API communication is not initialised!'}];
      }
      this.testTimeout = setTimeout( () => {
        this.messages = [];
        this.testTimeout = null;
      } , 5000 );
      if (this.serverApiInit) {
        this.demistoProperties.url = res.url;
        this.demistoProperties.trustAny = res.trust;
      }
      console.log('Demisto Server API:', res);
    }
    catch (err) {
      console.log('Caught error fetching Demisto server API status:', err);
    }

    // Client Options
    try {
      this.clientOptions = await this.fetcherService.getClientOptions();
      console.log('Client Options:', this.clientOptions);

      // AD Groups
      this.clientOptions.activeDirectoryGroups.forEach( group => {
        let item: SelectItem = {
          label: group,
          value: group
        };
        this.adGroups.push(item);
      });
      console.log('adGroups:', this.adGroups);

      // Countries
      Object.keys(this.clientOptions.countries).forEach(
         country => {
           this.countries.push({name: country});
         }
      );
      console.log('countries:', this.countries);

      // Work Locations
      this.clientOptions.workLocations.forEach( location => this.workLocations.push( {name: location} ));

      // Computer Models
      Object.keys(this.clientOptions.computerTypes).forEach( type => {
        console.log('type:', type);
        this.computerTypes[type] = {};
        // desktops
        this.computerTypes[type].desktops = [];
        this.clientOptions.computerTypes[type].desktops.forEach( model => this.computerTypes[type].desktops.push( {name: model} ));
        // laptops
        this.computerTypes[type].laptops = [];
        this.clientOptions.computerTypes[type].laptops.forEach( model => this.computerTypes[type].laptops.push( {name: model} ));
      });
      console.log('computerTypes:', this.computerTypes);
    }
    catch (err) {
      console.log('Caught error fetching client options:', err);
    }

    this.resetForm();
  }



  async testAPI(): Promise<any> {
    try {
      let result = await this.fetcherService.testDemisto(this.demistoProperties);
      if (this.testTimeout) {
        clearTimeout(this.testTimeout);
        this.testTimeout = null;
      }
      console.log('testCredentials() result:', result);
      if ( 'success' in result && result.success ) {
        // successful
        this.testResultClass = 'success';
        this.testResult = 'Test successful';
        this.serverApiInit = true;
        this.messages = [{ severity: 'success', summary: 'Success', detail: 'Demisto API communication is initialised'}];
        this.testTimeout = setTimeout( () => {
          this.messages = [];
          this.testTimeout = null;
        } , 5000 );
      }
      else if ( 'success' in result && !result.success ) {
        // unsuccessful
        let err = 'statusMessage' in result ? result.statusMessage : result.error;
        if ('statusCode' in result) {
          this.testResult = `Test failed with code ${result.statusCode}: "${err}"`;
          this.messages = [{
            severity: 'error',
            summary: 'Failure',
            detail: `Demisto API communication is not initialised. ${this.testResult}`
          }];
        }
        else {
          this.testResult = `Test failed with error: "${err}"`;
          this.messages = [{
            severity: 'error',
            summary: 'Failure',
            detail: `Demisto API communication is not initialised. ${this.testResult}`
          }];
        }
        this.testResultClass = 'failure';
        this.serverApiInit = false;
      }
    }
    catch (error) {
      this.testResult = `Test failed with error: ${error.message || error}`;
      this.messages = [{
        severity: 'error',
        summary: 'Failure',
        detail: `Demisto API communication is not initialised. ${this.testResult}`
      }];
      this.testResultClass = 'failure';
      this.serverApiInit = false;
    }
  }


  async onNewEmployeeFormSubmit(form: NgForm) {
    // console.log('onNewEmployeeFormSubmit() form:', form);
    console.log('onNewEmployeeFormSubmit() form.value:', form.value);
    // console.log('employeeForm:', this.employeeForm);

    let formCopy = JSON.parse(JSON.stringify(form.value)); // make copy of form, to be modified

    // convert PrimeNG values to native values
    formCopy.hireDate = (this.employeeForm as any).hireDate.toISOString(); // convert date
    formCopy.homeAddressCountry = formCopy.homeAddressCountry.name; // convert country
    formCopy.homeAddressState = formCopy.homeAddressState.name; // convert state
    formCopy.workLocation = formCopy.workLocation.name; // convert work location
    formCopy.computerModel = formCopy.computerModel.name; // convert computer model
    console.log('formCopy:', formCopy);

    let res = await this.fetcherService.createDemistoIncident(formCopy);
    // console.log('res:', res);
    this.resultSuccess = res.success;
    if (!res.success) {
      this.resultMessage = `Incident creation failed with Demisto status code ${res.statusCode}: "${res.statusMessage}"`;
      this.messages = [{ severity: 'error', summary: 'Failure', detail: this.resultMessage}];
    }
    else {
      this.resultMessage = `Demisto incident created with id ${res.id}`;
      this.messages = [{ severity: 'success', summary: 'Success', detail: this.resultMessage}];
      this.resetForm();
    }
  }

}
