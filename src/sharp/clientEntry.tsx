import { hydrateRoot } from 'react-dom/client'
import { Main } from './main'
import React from 'react'
import { BrowserRouter } from 'react-router-dom'

hydrateRoot(
	document,
	<React.StrictMode>
		<BrowserRouter>
			<Main />
		</BrowserRouter>
	</React.StrictMode>
)
