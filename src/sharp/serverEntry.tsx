// @ts-nocheck
import {Main} from './main'
import { renderToPipeableStream, renderToReadableStream } from 'react-dom/server'
import { HTML } from './HTML'
import { StaticRouter } from 'react-router-dom/server'

export function renderInNode({ res, head }) {
	const { pipe, abort } = renderToPipeableStream(
		<HTML head={head}>
			<StaticRouter location={res.url}>
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

export async function renderInWorker({ head, res }) {

	try {
	  const stream = await renderToReadableStream(
		<HTML head={head}>
			<StaticRouter location={res.url}>
				<Main />
			</StaticRouter>
		</HTML>,
	  );
 
	  return new Response(stream, {
		 headers: {
			"content-type": "text/html",
		 },
	  });
	} catch (error) {
	  return new Response(
		 `<!doctype html><p>An error ocurred:</p><pre>${error.message}</pre>`,
		 {
			status: 500,
			headers: { "Content-Type": "text/html" },
		 }
	  );
	}
 }