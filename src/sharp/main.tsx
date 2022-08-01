// @ts-nocheck
import { Fragment, lazy, Suspense } from 'react'
import { Routes as BrowserRoutes, Route } from 'react-router-dom'

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
	ROUTES[route]().then(module => module.middleware).then((middleware)=>routeMap.set(path, middleware ))
})


export function Main() {
	const App = preserved?.['_app'] || Fragment
	const NotFound = preserved?.['404'] || Fragment

	return (
		<App>
			<Suspense fallback={null}>
				<BrowserRoutes>
					{routes.map(({ path, component: Component = Fragment }) => (
						<Route key={path} path={path} element={<Component />} />
					))}
					<Route path='*' element={<NotFound />} />
				</BrowserRoutes>
			</Suspense>
		</App>
	)
}