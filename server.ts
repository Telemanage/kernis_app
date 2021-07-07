import {Request, Response} from "express";
import {Donation, Donations, User, Users} from "models/donation.interface"

const express = require('express')
const next = require('next')
const bodyParser = require('body-parser');

const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handle = app.getRequestHandler()


// donations table
let donations: Donations =  [
  {id:1, userId: 1, amount: 10, tip: 2},
  {id:2, userId: 2, amount: 20, tip: 1},
  {id:3, userId: 3, amount: 30, tip: 3},
  {id:4, userId: 4, amount: 10, tip: 1},
  {id:5, userId: 5, amount: 12, tip: 0},
  {id:6, userId: 1, amount: 15, tip: 2},      
]


// users table
let users: Users = [
  {id:1, firstName: "John", lastName:"Jones", email: "john@john.com"},
  {id:2, firstName: "Dave", lastName:"Clark", email: "clark@clark.com"},
  {id:3, firstName: "Jim", lastName:"Wilson", email: "jimn@xxx.com"},
  {id:4, firstName: "Jill", lastName:"Baines", email: "jill@yyy.com"},
  {id:5, firstName: "Sally", lastName:"Field", email: "sally@zzz.com"},
]


app.prepare()
.then(() => {
  const server = express()

  //configure body-parser for express
  server.use(bodyParser.urlencoded({extended:false}));
  server.use(bodyParser.json());


  // 'fetch' donations
  server.get('/donations', (req: Request, res: Response) => {
    const response = {donations, users};
    res.end(JSON.stringify(response));
  });

  // get donation
  server.get('/p/:id', (req: Request, res: Response) => {

    // find donation
    const findDonation = donations.find((donation) => parseFloat(req.params.id) == donation.id)

    // prepare response
    const response = {donation: findDonation};

    // return JSON string response
    res.end(JSON.stringify(response));
  })

  


  // create donation 
  server.post('/new_donation', (req: Request, res: Response) => {

    const donationInfo = {
      firstName : req.body.first_name,
      lastName : req.body.last_name,
      email : req.body.email,
      amount : req.body.amount,
      tip : req.body.tip
    };

    // find user by name
    const findUser = users.find((user) => donationInfo.firstName == user.firstName && donationInfo.lastName == user.lastName)

    // if not found, get next user id
    const uid = findUser ? findUser.id : Math.max.apply(Math, users.map((o)=> o.id ))+1 

    // add user if not found
    if(!findUser) {
      const user: User = {
        id:        uid, 
        lastName:  donationInfo.lastName, 
        firstName: donationInfo.firstName, 
        email:     donationInfo.email
      }
      users.push(user)
    }
    
    // get next donation id
    const donationId = Math.max.apply(Math, donations.map((o)=> o.id ))+1

    // append to donations
    const donation: Donation = {
      id:     donationId, 
      userId: uid, 
      amount: donationInfo.amount, 
      tip:    donationInfo.tip
    }
    donations.push(donation)

    // prepare response
    const response = {
      statusText : "OK",
      msg : "Donation added",
      donations
    };
    
    //convert the response in JSON format
    res.end(JSON.stringify(response))
  })

  server.post('/del_donation', (req: Request, res: Response) => {
    const donationInfo = {
      id : parseFloat(req.body.id)
    }

    // remove donation
    const newDonations = donations.filter((donation) => donationInfo.id !== donation.id)   
    donations = newDonations

    // prepare response
    const response = {
      statusText : "OK",
      msg : "Donation removed",
      donations: newDonations
    };
    
    //convert the response in JSON format
    res.end(JSON.stringify(response));
  });

  // Update user info
  server.post('/update_user', (req: Request, res: Response) => {

    const userInfo = {
      id : parseFloat(req.body.id),
      firstName : req.body.first_name,
      lastName : req.body.last_name,
      email : req.body.email,
    };    

    // find user by name
    const findUser = users.find((user) => userInfo.id == user.id)

    if(findUser) {
      const userUpdated: User = {
        id:        userInfo.id, 
        lastName:  userInfo.lastName!==""  ? userInfo.lastName : findUser.lastName, 
        firstName: userInfo.firstName!=="" ? userInfo.firstName : findUser.firstName, 
        email:     userInfo.email!==""     ? userInfo.email : findUser.email, 
      }
      const usersNew = users.map((user) => {
        return user.id == findUser.id ? userUpdated : user
      })
      users = usersNew
    }

    // prepare response
    const response = {
      statusText : "OK",
      msg : "User Updated",
      users
    };

    //convert the response in JSON format
    res.end(JSON.stringify(response));
  })


  // serve pages
  server.get('*', (req, res) => {
    return handle(req, res)
  })

  // listen on port 3000
  server.listen(process.env.PORT || 3000, (err) => {
    if (err) throw err
    console.log(`> Ready on http://localhost:${process.env.PORT || 3000}`)
  })
  
})
.catch((ex:any) => {
  console.error(ex.stack)
  process.exit(1)
})