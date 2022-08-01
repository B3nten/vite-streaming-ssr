import { useState } from "react";

export default function ({children}){

   const [count, setCount] = useState(0);
   return<div>
      <button onClick={()=>setCount(count + 1)}>the count is {count}</button>
      {children}
   </div>
}