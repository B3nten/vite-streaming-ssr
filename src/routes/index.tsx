import { Link } from "react-router-dom";

export function middleware(){

   return {props: 'INDEX PAGE'}
}

export default function(){

   return <div>home <Link to='/about'>about</Link></div>
}