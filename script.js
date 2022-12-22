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

updateUI()

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
	await auth0Client.logout();
	updateUI()
}

signInButton.addEventListener('click', login)
signOutButton.addEventListener('click', logout)
