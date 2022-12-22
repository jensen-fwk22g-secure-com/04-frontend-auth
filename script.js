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


const updateUI = async () => {
	const isAuthenticated = await auth0Client.isAuthenticated();

	signInButton.disabled = isAuthenticated;
	signOutButton.disabled = !isAuthenticated;
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

