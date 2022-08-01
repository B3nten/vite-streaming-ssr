// @ts-nocheck
import { Main } from './main'
import { renderToPipeableStream, renderToReadableStream } from 'react-dom/server'
import { HTML } from './HTML'
import { StaticRouter } from 'react-router-dom/server'

export async function renderInNode({ req, head, res }) {

	const ROUTES = import.meta.glob('/src/routes/**/[a-z[]*.tsx', { eager: true })
	const routeMap = new Map()

	Object.keys(ROUTES).map(route => {
		let path = route
			.replace(/\/src\/routes|index|\.tsx$/g, '')
			.replace(/\[\.{3}.+\]/, '*')
			.replace(/\[(.+)\]/, ':$1')
		if(path.length > 1 && path.lastIndexOf('/') === path.length - 1) {
			path = path.substring(0, path.length - 1)
		}
		routeMap.set(path, ROUTES[route].middleware)
	})

	const middleware = routeMap.get(req.url)
	const edgeProps = await middleware?.()

	const { pipe, abort } = renderToPipeableStream(
		<HTML head={head}>
			<StaticRouter location={req.url}>
				<Main />
			</StaticRouter>
		</HTML>,
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

export async function renderInWorker({ head, req }) {

	const ROUTES = import.meta.glob('/src/routes/**/[a-z[]*.tsx', { eager: true })
	const routeMap = new Map()

	Object.keys(ROUTES).map(route => {
		let path = route
			.replace(/\/src\/routes|index|\.tsx$/g, '')
			.replace(/\[\.{3}.+\]/, '*')
			.replace(/\[(.+)\]/, ':$1')
		if(path.length > 1 && path.lastIndexOf('/') === path.length - 1) {
			path = path.substring(0, path.length - 1)
		}
		routeMap.set(path, ROUTES[route].middleware)
	})

	const middleware = routeMap.get(new URL(req.url).pathname)
	const edgeProps = await middleware?.()
	console.log(edgeProps)

	try {
		const stream = await renderToReadableStream(
			<HTML head={head}>
				<StaticRouter location={req.url}>
					<Main />
				</StaticRouter>
			</HTML>
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
