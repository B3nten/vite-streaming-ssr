import { Link } from 'react-router-dom'
import useSWR from 'swr'

export default function Home() {
	const fetcher = async () => {
		const comments = await new Promise((resolve, reject) => {
			setTimeout(() => {
				resolve([
					"Wait, it doesn't wait for React to load?",
					'How does this even work?',
					'I like marshmallows',
				])
			}, 2000)
		})
		return { comments }
		// const res = await fetch('https://jsonplaceholder.typicode.com/comments')
		// return res.json()
	}

	const data = useSWR('testfunction', fetcher, { suspense: true })

	return (
		<div>
			home <Link to='/about'>about</Link>
			<div>LOADER PROPS: {JSON.stringify(data)}</div>
		</div>
	)
}
