export interface DemistoCaseParams {
  firstName: string;
  lastName: string;
  hireDate: string;
  workLocation: string;
  computer: {
    type: string;
    formFactor: string;
    model: string;
  };
  homeAddress: {
    street1: string;
    street2?: string;
    city: string;
    state: string;
    zip: string; // could be postcode so must be a string
    country: string;
  };
  phone: {
    home?: string;
    mobile?: string;
  };
  adGroups: string[];
}
