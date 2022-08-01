export function HTML({ children, head }: any) {
	return (
		<html>
			<head dangerouslySetInnerHTML={{ __html: head }}></head>
			<body>
				<noscript
					dangerouslySetInnerHTML={{
						__html: `<b>Enable JavaScript to run this app.</b>`,
					}}
				/>
				{children}
				{/*
				 * TODO: Fix Vite upstream to allow this tag to be injected via `bootstrapModules` in `pipeToWritableStream` instead.
				 * Currently, it breaks the JSX Runtime.
				 */}

				{import.meta.env.DEV && <script type='module' src='src/sharp/clientEntry.tsx'></script>}
			</body>
		</html>
	)
}
