let auth0Client = null;

// Hämta konfigurationen (domain, clientId)
const fetchAuthConfig = () => fetch("./auth_config.json");

const configureClient = async () => {
	const response = await fetchAuthConfig();
	const config = await response.json();

	auth0Client = await auth0.createAuth0Client({
		domain: config.domain,
		clientId: config.clientId
	});
};

// Ingen onload eftersom vi använder "defer"
await configureClient();


// DOM elements
const signInButton = document.querySelector('#sign-in')
const signOutButton = document.querySelector('#sign-out')
const results = document.querySelector('#results')

// Kör denna för att uppdatera DOM, så fort autentiseringsstatus ändras
const updateUI = async () => {
	const isAuthenticated = await auth0Client.isAuthenticated();

	signInButton.disabled = isAuthenticated;
	signOutButton.disabled = !isAuthenticated;

	if( isAuthenticated ) {
		const profile = await auth0Client.getUser()
		console.log('User profile:', profile)
		// email, name, picture
		// Extra övning: skriv kod som garanterar att name/email/picture inte innehåller någon HTML
		results.innerHTML = `Welcome ${profile.name}! <br/> <br/> Email: ${profile.email} <br/> Image URL: ${profile.picture} `
	} else {
		results.innerHTML = `Welcome guest! <br/> <br/> Please login. `
	}
};


// Görs när sidan laddas
updateUI()

const query = window.location.search
// String.includes(x)
if (query.includes('code=') && query.includes('state=') ) {
	// Processa login state
	await auth0Client.handleRedirectCallback()
	updateUI()

	// Ta bort koderna från adressfältet
	window.history.replaceState({}, document.title, '/')
}



// Funktioner för att logga in och ut
const login = async () => {
	await auth0Client.loginWithRedirect({
		authorizationParams: {
			redirect_uri: window.location.origin
		}
	});
	updateUI()
};

const logout = async () => {
	await auth0Client.logout({
		logoutParams: {
			returnTo: window.location.origin
		}
	});
	updateUI()
}

signInButton.addEventListener('click', login)
signOutButton.addEventListener('click', logout)

// Strängar i JavaScript:
// ' '  <- det normala, apostrofer (enkelfnutt / apostrophe)
// " "  <- vanligare i HTML och JSON, citattecken (dubbelfnutt / quote)
// ` `  <- template string, grav accent (backtick)
// ` Variabler inuti sträng: ${x} `
