// @ts-nocheck
import { Main } from './main'
import { renderToPipeableStream, renderToReadableStream } from 'react-dom/server'
import { HTML } from './HTML'
import { StaticRouter } from 'react-router-dom/server'

const ROUTES = import.meta.glob('/src/routes/**/[a-z[]*.tsx', { eager: true })
const routeMap = new Map()
Object.keys(ROUTES).map(route => {
	let path = route
		.replace(/\/src\/routes|index|\.tsx$/g, '')
		.replace(/\[\.{3}.+\]/, '*')
		.replace(/\[(.+)\]/, ':$1')
	if (path.length > 1 && path.lastIndexOf('/') === path.length - 1) {
		path = path.substring(0, path.length - 1)
	}
	routeMap.set(path, { loader: ROUTES[route].loader, config: ROUTES[route].config })
})

export async function renderInNode({ req, res, head }) {
	const cache = new Map()

	const { pipe, abort } = renderToPipeableStream(
		<StaticRouter location={req.url}>
			<Main cache={cache} />
		</StaticRouter>,
		{
			onShellReady() {
				res.statusCode = 200
				res.setHeader('Content-type', 'text/html')
				pipe(res)
			},
		}
	)
	setTimeout(abort, 10000)
}

export async function renderInWorker({ req, head }) {

	try {
		const stream = await renderToReadableStream(
			<StaticRouter location={req.url}>
				<Main />
			</StaticRouter>
		)

		return new Response(stream, {
			headers: {
				'content-type': 'text/html',
			},
		})
	} catch (error) {
		return new Response(`<!doctype html><p>An error ocurred:</p><pre>${error.message}</pre>`, {
			status: 500,
			headers: { 'Content-Type': 'text/html' },
		})
	}
}
