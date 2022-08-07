const sheath = (cache: Cache) => {
	//@ts-ignore
	let __sheath
	if (typeof self === 'undefined') {
		__sheath = new Map()
	} else {
		__sheath = self.__sheath
		console.log(__sheath)
	}
	if (__sheath instanceof Array) return new Map(__sheath)
	if (cache instanceof Map) return cache
	return new Map()
}

export default sheath
