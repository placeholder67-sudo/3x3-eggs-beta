import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm";

// Supabase configuration
const SUPABASE_URL = "https://jvzsyeotmencofyfuirj.supabase.co";

const SUPABASE_KEY = "sb_publishable_jT4IAvc6SSevUZivTuqbIg_Cr7pj8F7";

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// Game URL
const GAME_URL =
  "https://www.timestables.com/gf/3x3-steal-egg/20261112-1036/index.html?timestables=10&lang=da&multiplayer=wss://tsu3.tafeldiploma.nl/eggs/multiplayer&swap=1";

// HTML elements
const loginScreen = document.getElementById("login-screen");
const signedOut = document.getElementById("signed-out");
const signedIn = document.getElementById("signed-in");

const loginBtn = document.getElementById("login-btn");
const googleBtn = document.getElementById("google-btn");
const discordBtn = document.getElementById("discord-btn");
const twitchBtn = document.getElementById("twitch-btn");
const spotifyBtn = document.getElementById("spotify-btn");

const logoutBtn = document.getElementById("logout-btn");
const continueBtn = document.getElementById("continue-btn");
const loggedInContinue = document.getElementById("logged-in-continue");

const avatar = document.getElementById("avatar");
const username = document.getElementById("username");
const status = document.getElementById("status");
const game = document.getElementById("game");

let gameStarted = false;

// Display the user's profile
function updateUser(user) {
  if (user) {
    const metadata = user.user_metadata || {};

    const displayName =
      metadata.user_name ||
      metadata.preferred_username ||
      metadata.name ||
      metadata.full_name ||
      user.email ||
      "User";

    const profilePicture =
      metadata.avatar_url ||
      metadata.picture ||
      metadata.profile_image_url ||
      "";

    username.textContent = displayName;

    avatar.src = profilePicture || "data:image/svg+xml," + encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
        <rect width="100" height="100" rx="50" fill="#34364d"/>
        <text x="50" y="66" font-size="48" text-anchor="middle" fill="white">?</text>
      </svg>
    `);

    signedOut.hidden = true;
    signedIn.hidden = false;
  } else {
    signedOut.hidden = false;
    signedIn.hidden = true;
  }
}

// Check whether the user is already logged in
async function checkLogin() {
  const { data, error } = await supabase.auth.getSession();

  if (error) {
    status.textContent = error.message;
    return;
  }

  updateUser(data.session?.user || null);
}

// Sign in with an OAuth provider
async function signIn(provider, button, providerName) {
  button.disabled = true;
  status.textContent = `Redirecting to ${providerName}...`;

  const { error } = await supabase.auth.signInWithOAuth({
    provider: provider,
    options: {
      redirectTo: window.location.origin + window.location.pathname
    }
  });

  if (error) {
    status.textContent = error.message;
    button.disabled = false;
  }
}

// GitHub login
loginBtn.addEventListener("click", () => {
  signIn("github", loginBtn, "GitHub");
});

// Google login
googleBtn.addEventListener("click", () => {
  signIn("google", googleBtn, "Google");
});

// Discord login
discordBtn.addEventListener("click", () => {
  signIn("discord", discordBtn, "Discord");
});

// Twitch login
twitchBtn.addEventListener("click", () => {
  signIn("twitch", twitchBtn, "Twitch");
});

// Spotify login
spotifyBtn.addEventListener("click", () => {
  signIn("spotify", spotifyBtn, "Spotify");
});

// Sign out
logoutBtn.addEventListener("click", async () => {
  logoutBtn.disabled = true;
  status.textContent = "Signing out...";

  const { error } = await supabase.auth.signOut();

  if (error) {
    status.textContent = error.message;
    logoutBtn.disabled = false;
    return;
  }

  updateUser(null);
  status.textContent = "";
  logoutBtn.disabled = false;
});

// Load the game
function loadGame() {
  if (gameStarted) return;

  gameStarted = true;
  status.textContent = "";

  const iframe = document.createElement("iframe");

  iframe.src = GAME_URL;
  iframe.title = "3x3 Eggs Game";
  iframe.allow = "fullscreen; autoplay";
  iframe.allowFullscreen = true;

  game.appendChild(iframe);

  loginScreen.classList.add("fade-out");

  setTimeout(() => {
    loginScreen.style.display = "none";
  }, 400);
}

// Continue as guest
continueBtn.addEventListener("click", () => {
  loadGame();
});

// Continue while logged in
loggedInContinue.addEventListener("click", () => {
  loadGame();
});

// Listen for login/logout changes
supabase.auth.onAuthStateChange((event, session) => {
  updateUser(session?.user || null);
});

// Initial login check
checkLogin();
