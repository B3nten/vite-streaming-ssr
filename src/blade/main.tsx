// @ts-nocheck
import { Fragment, lazy, Suspense } from 'react'
import { Routes as BrowserRoutes, Route } from 'react-router-dom'
import { SWRConfig } from 'swr'
import sheath from './sheath'

const PRESERVED = import.meta.glob('/src/routes/(_app|404).tsx', { eager: true })
const ROUTES = import.meta.glob('/src/routes/**/[a-z[]*.tsx')

const preserved = Object.keys(PRESERVED).reduce((preserved, file) => {
	const key = file.replace(/\/src\/routes\/|\.tsx$/g, '')
	return { ...preserved, [key]: PRESERVED[file].default }
}, {})

const routes = Object.keys(ROUTES).map(route => {
	const path = route
		.replace(/\/src\/routes|index|\.tsx$/g, '')
		.replace(/\[\.{3}.+\]/, '*')
		.replace(/\[(.+)\]/, ':$1')

	return { path, component: lazy(ROUTES[route]) }
})

const routeMap = new Map()

Object.keys(ROUTES).map(route => {
	const path = route
		.replace(/\/src\/routes|index|\.tsx$/g, '')
		.replace(/\[\.{3}.+\]/, '*')
		.replace(/\[(.+)\]/, ':$1')
	ROUTES[route]()
		.then(module => module.middleware)
		.then(middleware => routeMap.set(path, middleware))
})

const options = cache => ({
	provider: () => sheath(cache),
	suspense: true,
})

export function Main({ cache }: { cache?: Cache }) {
	const App = preserved?.['_app'] || Fragment
	const NotFound = preserved?.['404'] || Fragment

	return (
		<App>
			<SWRConfig value={{ provider: () => sheath(cache) }}>
				<Suspense fallback={null}>
					<BrowserRoutes>
						{routes.map(({ path, component: Component = Fragment }) => (
							<Route
								key={path}
								path={path}
								element={
									<Suspense>
										<Component />
									</Suspense>
								}
							/>
						))}
						<Route path='*' element={<NotFound />} />
					</BrowserRoutes>
				</Suspense>
			</SWRConfig>
		</App>
	)
}
