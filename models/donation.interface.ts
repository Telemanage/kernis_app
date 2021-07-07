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
