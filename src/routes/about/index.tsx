import { Link } from "react-router-dom";

export function loader(){
   return {props: 'about me! hehe hehe'} 
}

export const config = {
   cache: true
}

export default function({props}){
   return <div>about {props} <Link to='/'>home</Link></div>
}