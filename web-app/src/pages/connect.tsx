import Head from 'next/head'
import "../flow/config";
import { useState, useEffect } from "react";
import * as fcl from "@onflow/fcl";

export default function Connect() {

  const [user, setUser] = useState({loggedIn: null, addr: ''})
  const [name, setName] = useState('') // NEW

  useEffect(() => fcl.currentUser.subscribe(setUser), [])

	// NEW
  const sendQuery = async () => {
    const profile = await fcl.query({
      cadence: `
        import Dojo from 0x74225957ee4b7824

        pub fun main(): UInt64 {
            return Dojo.totalSupply
        }
      `,
      args: (arg: (arg0: any, arg1: any) => any, t: { Address: any; }) => [arg(user.addr, t.Address)]
    })
    console.log('profile ', profile);
    // setName(profile?.name ?? 'No Profile')
  }

  const AuthedState = () => {
    return (
      <div>
        <div>Address: {user?.addr ?? "No Address"}</div>
        <div>Profile Name: {name ?? "--"}</div> {/* NEW */}
        <button onClick={sendQuery}>Send Query</button> {/* NEW */}
        <button onClick={fcl.unauthenticate}>Log Out</button>
      </div>
    )
  }

  const UnauthenticatedState = () => {
    return (
      <div>
        <button onClick={fcl.logIn}>Log In</button>
        <button onClick={fcl.signUp}>Sign Up</button>
      </div>
    )
  }

  return (
    <div>
      <Head>
        <title>FCL Quickstart with NextJS</title>
        <meta name="description" content="My first web3 app on Flow!" />
        <link rel="icon" href="/favicon.png" />
      </Head>
      <h1>Flow App</h1>
      {user.loggedIn
        ? <AuthedState />
        : <UnauthenticatedState />
      }
    </div>
  );
}