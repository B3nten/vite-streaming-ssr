import { Suspense } from 'react'
import { Link } from 'react-router-dom'
import useSWR from 'swr'

export default function Home () {
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
	}

	const data = useSWR('testfunction', fetcher, { suspense: true })

	return (
		<Suspense>
			<div>
				home <Link to='/about'>about</Link>
				<div>LOADER PROPS: {JSON.stringify(data)}</div>
			</div>
		</Suspense>
	)
}
