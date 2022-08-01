import { Link } from "react-router-dom";

export function loader(){
   return {props: 'HOME PAGE'} 
}

export const config = {
   cache: true
}
export default function(){

   return <div>home <Link to='/about'>about</Link></div>
}