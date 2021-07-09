import React from 'react';
import Layout from '../components/MyLayout'
import Link from 'next/link'
import fetch from 'isomorphic-unfetch'
//import 'isomorphic-fetch'
import { Component } from 'react'

import {DonationData, IFormProps, IndexState} from "models/donation.interface"

const dev = process.env.NODE_ENV !== 'production';
const server = dev ? 'http://localhost:3000' : 'https://your_deployment.server.com';

const DonationRow = ({ donation, users }) => {
  
  const user = users.find((user) => user.id == donation.userId);
  return (    
    <tr key={donation.id}>
      <td>
      <Link href={`/p/${donation.id}`} >
        <a>{donation.id}</a>
      </Link>
      </td>
      <td>{user.firstName}</td>
      <td>{user.lastName}</td>
      <td>{user.email}</td>
      <td>{user.id}</td>
      <td>{donation.amount}</td>
      <td>{donation.tip}</td>      
    </tr>)
}

export default class Index extends Component<IFormProps, IndexState> {

  constructor(props: IFormProps) {
      super(props);
      const donations:any = [];
      const users:any = [];
      this.state = {
          donations,
          users
      };
  }

  fetchDonations = () => {
    fetch(server+'/donations')
        .then(response => {   
          if (!response.ok) {      
            throw new Error("HTTP error " + response.status); 
          } 
          return response.json();
        })
        .then((data: DonationData) => this.setState(data))
        .catch(error => {                                        
          // Handle/report error.
          console.log(error)
        })
  }

  componentWillMount() {
    this.fetchDonations()
  }

  // Donation form
  AddDonation = () => {
  
    const postDonation = async event => {
      event.preventDefault()
  
      const donationInfo = {
        first_name: event.target.first_name.value,
        last_name:  event.target.last_name.value,
        email:      event.target.email.value,
        amount:     event.target.amount.value,
        tip:        event.target.tip.value,
      };
  
      const res = await fetch(server+'/new_donation',
        {
          body: JSON.stringify(donationInfo),
          headers: {
            'Content-Type': 'application/json'
          },
          method: 'POST'
        }
      )
  
      const result = await res.json()
      this.setState({donations: result.donations})      
    }
  
    return (
      <div>
        <h3>Add a donation</h3>
        <form onSubmit={postDonation}>
          <table style={{border: "solid 1px"}}>
            <tbody>
              <tr>
                <td>First Name:</td>
                <td><input type="text" name="first_name" /></td>
              </tr>
              <tr>
                <td>Last Name:</td>
                <td><input type="text" name="last_name" /></td>
              </tr>
              <tr>
                <td>Email:</td>
                <td><input type="text" name="email" /></td>
              </tr>
              <tr>
                <td>Donation:</td>
                <td><input type="text" name="amount" /></td>
              </tr>
              <tr>
                <td>Tip:</td>
                <td><input type="text" name="tip" /></td>
              </tr>
              <tr>
                <td></td>
                <td><button type="submit">Add donation</button></td>
              </tr>
            </tbody>
          </table>
        
      </form>
      </div>
    )
  }
  
  // Update user info form
  UpdateUser = () => {
  
    const updateUser = async event => {
      event.preventDefault()
  
      const userInfo = {
        id:         event.target.upd_id.value,
        first_name: event.target.upd_first_name.value,
        last_name:  event.target.upd_last_name.value,
        email:      event.target.upd_email.value,
      };
  
      const res = await fetch(server+'/update_user',
        {
          body: JSON.stringify(userInfo),
          headers: {
            'Content-Type': 'application/json'
          },
          method: 'POST'
        }
      )
  
      const result = await res.json()
      this.setState({users: result.users})      
    }
  
    return (
      <div>
        <h3>Update user info</h3>          
        <form onSubmit={updateUser}>
          <table style={{border: "solid 1px"}}>
            <tbody>
              <tr>
                <td>User id to update:</td>
                <td><input type="text" name="upd_id" /></td>
              </tr>
              <tr>
                <td>First Name:</td>
                <td><input type="text" name="upd_first_name" /></td>
              </tr>
              <tr>
                <td>Last Name:</td>
                <td><input type="text" name="upd_last_name" /></td>
              </tr>
              <tr>
                <td>Email:</td>
                <td><input type="text" name="upd_email" /></td>
              </tr>
              <tr>
                <td></td>
                <td><button type="submit">Update user</button> </td>
              </tr>
            </tbody>
          </table>        
        </form>
      </div>
    )
  }
  
  // Delete donation form
  DeleteDonation = () => {
  
    const deleteDonation = async event => {
      event.preventDefault()

      const id: number = parseFloat(event.target.del_id.value)

      const res = await fetch(server+'/del_donation',
        {
          body: JSON.stringify({id}),
          headers: {
            'Content-Type': 'application/json'
          },
          method: 'POST'
        }
      )
    
      const result = await res.json()    
      this.setState({donations: result.donations})      
    }
  
    return (
      <div>    
        <h3>Delete a donation</h3>  
        <form onSubmit={deleteDonation}>
          <table style={{border: "solid 1px"}}>
          <tbody>
            <tr>
              <td>id:</td>
              <td><input type="text" name="del_id" /></td>
            </tr>
            <tr>
              <td></td>
              <td><button type="submit">Delete donation</button></td>
            </tr>
          </tbody>
        </table> 
        </form>
      </div>
    )
  }
  

  render(){
    const {donations=[], users=[]} = this.state

    return(
      <Layout>
        <style jsx>{`
          h1, a {
            font-family: "Arial";
          }

          ul {
            padding: 0;
          }

          li {
            list-style: none;
            margin: 5px 0;
          }

          a {
            text-decoration: none;
            color: blue;
          }

          a:hover {
            opacity: 0.6;
          }
        `}</style>
        
        {donations && <div>
          <h1>{donations.length} Donations</h1>
          <table>
            <tbody>
              <tr>
                <th>ID</th>
                <th>First name</th>
                <th>Last name</th>
                <th>Email</th>
                <th>User Id</th>
                <th>Amount</th>
                <th>Tip</th>
              </tr>
              {donations.map((donation) => (
                <DonationRow key={donation.id} donation={donation} users={users} />
              ))}
            </tbody>
          </table>
        </div>}

        {this.AddDonation()}
        
        {this.DeleteDonation()}

        {this.UpdateUser()}          
        
      </Layout>
    );
  }

}
