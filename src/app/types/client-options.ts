import { Countries } from './countries';
import { ComputerTypes } from './computer-types';

export interface ClientOptions {
  workLocations: string[];
  countries: Countries;
  defaultCountry: string;
  computerTypes: ComputerTypes;
  activeDirectoryGroups: string[];
}
