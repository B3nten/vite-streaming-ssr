import { Link } from "react-router-dom";

export function middleware(){
   return {props: 'hello'}
}

export default function({props}){
   return <div>about {props} <Link to='/'>home</Link></div>
}