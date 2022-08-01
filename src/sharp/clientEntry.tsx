import { hydrateRoot } from 'react-dom/client'
import { Main } from './main'
import React from 'react'
import { HTML } from './HTML'
import { BrowserRouter } from 'react-router-dom'

hydrateRoot(
	document,
	<HTML>
		<React.StrictMode>
			<BrowserRouter>
				<Main />
			</BrowserRouter>
		</React.StrictMode>
	</HTML>
)
