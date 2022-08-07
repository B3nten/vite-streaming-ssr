// @ts-nocheck
import { Main } from './main'
import { renderToPipeableStream, renderToReadableStream } from 'react-dom/server'
import { StaticRouter } from 'react-router-dom/server'
import { Writable } from 'node:stream'

// const ROUTES = import.meta.glob('/src/routes/**/[a-z[]*.tsx', { eager: true })
// const routeMap = new Map()
// Object.keys(ROUTES).map(route => {
// 	let path = route
// 		.replace(/\/src\/routes|index|\.tsx$/g, '')
// 		.replace(/\[\.{3}.+\]/, '*')
// 		.replace(/\[(.+)\]/, ':$1')
// 	if (path.length > 1 && path.lastIndexOf('/') === path.length - 1) {
// 		path = path.substring(0, path.length - 1)
// 	}
// 	routeMap.set(path, { loader: ROUTES[route].loader, config: ROUTES[route].config })
// })

export async function renderInNode({ req, res, head }) {
	const cache = new Map()

	const stream = new Writable({
		write(chunk, _encoding, cb) {
			res.write(chunk, cb)
		},
		final() {
			res.write(
				`</div>
				</body>
				<script>self.__sheath = ${JSON.stringify(Array.from(cache.entries()))}</script>
			 <script type='module' src='src/blade/clientEntry.tsx'></script>`
			)
			res.end('</html>')
		},
	})

	const { pipe } = renderToPipeableStream(
		<StaticRouter location={req.url}>
			<Main cache={cache} />
		</StaticRouter>,
		{
			onShellReady() {
				res.write(`
				<!DOCTYPE html>
				<html>
				<head>
				${head}
				`)
				res.write(`</head>
				<body>
				<div id='blade'>`)
				pipe(stream)
			},
		}
	)
}

// export async function renderInWorker({ req, head }) {
// 	try {
// 		const stream = await renderToReadableStream(
// 			<StaticRouter location={req.url}>
// 				<Main />
// 			</StaticRouter>
// 		)

// 		return new Response(stream, {
// 			headers: {
// 				'content-type': 'text/html',
// 			},
// 		})
// 	} catch (error) {
// 		return new Response(`<!doctype html><p>An error ocurred:</p><pre>${error.message}</pre>`, {
// 			status: 500,
// 			headers: { 'Content-Type': 'text/html' },
// 		})
// 	}
// }
