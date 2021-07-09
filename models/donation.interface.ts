export interface Donation {
    id: number;
    userId: number;
    amount: number;
    tip: number
  }
  
export interface Donations extends Array<Donation>{}

export interface User {
    id: number;
    firstName: string;
    lastName: string;
    email: string
  }
  
export interface Users extends Array<User>{}

export interface DonationData {
  donations?: Donations;
  users?: Users;
}

export interface IFormProps {
  /* The http path that the form will be posted to */
  action: string;

  /* A prop which allows content to be injected */
  render: () => React.ReactNode;
}

export interface IValues {
  /* Key value pairs for all the field values with key being the field name */
  [key: string]: any;
}

export interface IErrors {
  /* The validation error messages for each field (key is the field name */
  [key: string]: string;
}

export interface IndexState {
  /* The field values */
  donations?: Donations;

  /* The field validation error messages */
  users?: Users;
}

export interface IFormState {
  /* The field values */
  values: IValues;

  /* The field validation error messages */
  errors: IErrors;

  /* Whether the form has been successfully submitted */
  submitSuccess?: boolean;
}
