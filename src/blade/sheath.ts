 const sheath = (cache: Cache) => {
   //@ts-ignore
   const __sheath = self?.__sheath || new Map();
   if (__sheath instanceof Array) return new Map(__sheath);
   if (cache instanceof Map) return cache;
   return new Map();
 };
 
 export default sheath;