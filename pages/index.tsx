import Layout from '../components/MyLayout'
import Link from 'next/link'
import fetch from 'isomorphic-unfetch'
import Axios from 'axios'
import qs from 'qs'

const PostAsyncHelper = async (url, object, onDownloadProgressConfig, ) => {

  try {
      const options = {
          arrayFormat: 'indices',
          format: 'RFC3986',
          charset: 'utf-8',
          // encode: false,
          // strictNullHandling: true,
          // allowDots: true,
          // addQueryPrefix: true
      }
      const response = await Axios({
          method: 'post',
          url: url,
          headers: {
              'content-type': 'application/x-www-form-urlencoded'
          },
          data: qs.stringify(object, options),
          onDownloadProgress: onDownloadProgressConfig,
      }, )
      if (response.statusText !== "OK") {
          console.log ("PostAsyncHelper errors status not OK: ")
          console.log (response.statusText)  
          throw Error(response.statusText)
      }
      return response
  } catch (error) {
      console.log ("PostAsyncHelper error handler")  
      console.log (error)
      console.error(error.message)
  }
}

const dev = process.env.NODE_ENV !== 'production';
const server = dev ? 'http://localhost:3000' : 'https://your_deployment.server.com';


async function postObj (api_url, obj) {
  PostAsyncHelper(api_url, obj, null)
    .then(response => {
        //console.log(response);
        if (response !== undefined && response.statusText === "OK") {
            // successful Post to api_url
              console.log("success");
        
        } else {
            // error Posting to api_url
              console.log("error");
            
        }
    })
 
}

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
      <td>{user.id}</td>
      <td>{donation.amount}</td>
      <td>{donation.tip}</td>      
    </tr>)
}

const handleDelete = () => {
  const id: number = parseFloat((document.getElementById("del_id") as HTMLInputElement).value)

  const response = postObj("/del_donation", { id } );
  console.log(response);

  window.location.reload(true)
}

const handleAddDonation = () => {
  const first_name: string = (document.getElementById("first_name") as HTMLInputElement).value
  const last_name: string = (document.getElementById("last_name") as HTMLInputElement).value
  const email: string = (document.getElementById("email") as HTMLInputElement).value
  const amount: number = parseFloat((document.getElementById("amount") as HTMLInputElement).value)
  const tip: number = parseFloat((document.getElementById("tip") as HTMLInputElement).value)

  const donationInfo = {
    first_name,
    last_name,
    email,
    amount,
    tip
  };
  
  const response = postObj("/new_donation", donationInfo );
  console.log(response);

  window.location.reload(true)
  
  
}

const handleUpdateUser = () => {
  const id: number = parseFloat((document.getElementById("upd_id") as HTMLInputElement).value)
  const first_name: string = (document.getElementById("upd_first_name") as HTMLInputElement).value
  const last_name: string = (document.getElementById("upd_last_name") as HTMLInputElement).value
  const email: string = (document.getElementById("upd_email") as HTMLInputElement).value

  const userInfo = {
    id,
    first_name,
    last_name,
    email,
  };

  console.log(userInfo);
  
  
  const response = postObj("/update_user", userInfo );
  console.log(response);

  window.location.reload(true)
  
  
}

const Index = (props) => (
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
    
    <h1>{props.donationData.donations.length} Donations</h1>
    <table>
      <tbody>
        <tr>
          <th>ID</th>
          <th>First name</th>
          <th>Last name</th>
          <th>User Id</th>
          <th>Amount</th>
          <th>Tip</th>
        </tr>
        {props.donationData.donations.map((donation) => (
          <DonationRow key={donation.id} donation={donation} users={props.donationData.users} />
        ))}
      </tbody>
    </table>

    <div>

      <h3>Add a donation</h3>

      <table style={{border: "solid 1px"}}>
        <tbody>
          <tr>
            <td>First Name:</td>
            <td><input type="text" id="first_name" name="first_name" /></td>
          </tr>
          <tr>
            <td>Last Name:</td>
            <td><input type="text" id="last_name" name="last_name" /></td>
          </tr>
          <tr>
            <td>Email:</td>
            <td><input type="text" id="email" name="email" /></td>
          </tr>
          <tr>
            <td>Donation:</td>
            <td><input type="text" id="amount" name="amount" /></td>
          </tr>
          <tr>
            <td>Tip:</td>
            <td><input type="text" id="tip" name="tip" /></td>
          </tr>
          <tr>
            <td></td>
            <td><button onClick={(e) => handleAddDonation()} >Add donation</button></td>
          </tr>
        </tbody>
      </table>
    </div>
    

<div>    
  <h3>Delete a donation</h3>
  <table style={{border: "solid 1px"}}>
    <tbody>
      <tr>
        <td>id:</td>
        <td><input type="text" id="del_id" name="del_id" /></td>
      </tr>
      <tr>
        <td></td>
        <td><button onClick={(e) => handleDelete()} >Delete donation</button></td>
      </tr>
    </tbody>
  </table>               
</div>

<div>      

  <h3>Update user info</h3>
  <table style={{border: "solid 1px"}}>
    <tbody>
      <tr>
        <td>User id to update:</td>
        <td><input type="text" id="upd_id" name="upd_id" /></td>
      </tr>
      <tr>
        <td>First Name:</td>
        <td><input type="text" id="upd_first_name" name="upd_first_name" /></td>
      </tr>
      <tr>
        <td>Last Name:</td>
        <td><input type="text" id="upd_last_name" name="upd_last_name" /></td>
      </tr>
      <tr>
        <td>Email:</td>
        <td><input type="text" id="upd_email" name="upd_email" /></td>
      </tr>
      <tr>
        <td></td>
        <td><button onClick={(e) => handleUpdateUser()} >Update user</button> </td>
      </tr>
    </tbody>
  </table>
               
</div>
    
  </Layout>
)

// fetch donations as props
Index.getInitialProps = async function() {
  
  const res = await fetch(server+'/donations')
  const data = await res.json()

  return {
    donationData: data
  }
}

export default Index