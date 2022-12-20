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


const updateUI = async () => {
	const isAuthenticated = await auth0Client.isAuthenticated();

	document.getElementById("sign-in").disabled = isAuthenticated;
	document.getElementById("sign-out").disabled = !isAuthenticated;
};

updateUI()

const login = async () => {
	await auth0Client.loginWithRedirect({
		authorizationParams: {
			redirect_uri: window.location.origin
		}
	});
};
