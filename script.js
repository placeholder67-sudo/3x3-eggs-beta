import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm";

const SUPABASE_URL = "https://jvzsyeotmencofyfuirj.supabase.co";
const SUPABASE_KEY = "sb_publishable_jT4IAvc6SSevUZivTuqbIg_Cr7pj8F7";

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const GAME_URL =
  "https://www.timestables.com/gf/3x3-steal-egg/20261112-1036/index.html?timestables=10&lang=da&multiplayer=wss://tsu3.tafeldiploma.nl/eggs/multiplayer&swap=1";

const loginScreen = document.getElementById("login-screen");
const signedOut = document.getElementById("signed-out");
const signedIn = document.getElementById("signed-in");

const loginBtn = document.getElementById("login-btn");
const googleBtn = document.getElementById("google-btn");
const discordBtn = document.getElementById("discord-btn");
const twitchBtn = document.getElementById("twitch-btn");
const spotifyBtn = document.getElementById("spotify-btn");
const robloxBtn = document.getElementById("roblox-btn");
const gitlabBtn = document.getElementById("gitlab-btn");

const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const emailLoginBtn = document.getElementById("email-login-btn");
const signupBtn = document.getElementById("signup-btn");

const logoutBtn = document.getElementById("logout-btn");
const continueBtn = document.getElementById("continue-btn");
const loggedInContinue = document.getElementById("logged-in-continue");

const avatar = document.getElementById("avatar");
const username = document.getElementById("username");
const status = document.getElementById("status");

const game = document.getElementById("game");
const gameFrame = document.getElementById("game-frame");

const DEFAULT_AVATAR =
  "data:image/svg+xml," +
  encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
      <rect width="100" height="100" rx="50" fill="#444"/>
      <circle cx="50" cy="38" r="19" fill="#aaa"/>
      <path d="M15 95 Q20 60 50 60 Q80 60 85 95" fill="#aaa"/>
    </svg>
  `);

function updateUser(user) {
  if (!user) {
    signedOut.hidden = false;
    signedIn.hidden = true;
    return;
  }

  signedOut.hidden = true;
  signedIn.hidden = false;

  const metadata = user.user_metadata || {};

  username.textContent =
    metadata.user_name ||
    metadata.preferred_username ||
    metadata.name ||
    metadata.full_name ||
    user.email ||
    "User";

  avatar.src =
    metadata.avatar_url ||
    metadata.picture ||
    metadata.profile_image_url ||
    DEFAULT_AVATAR;

  avatar.onerror = () => {
    avatar.src = DEFAULT_AVATAR;
  };
}

async function checkLogin() {
  const { data, error } = await supabase.auth.getSession();

  if (error) {
    status.textContent = error.message;
    return;
  }

  updateUser(data.session?.user || null);
}

async function signIn(provider, button, providerName) {
  button.disabled = true;
  status.textContent = `Redirecting to ${providerName}...`;

  const { error } = await supabase.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo: window.location.origin + window.location.pathname
    }
  });

  if (error) {
    status.textContent = error.message;
    button.disabled = false;
  }
}

// Social logins
loginBtn.addEventListener("click", () => signIn("github", loginBtn, "GitHub"));
googleBtn.addEventListener("click", () => signIn("google", googleBtn, "Google"));
discordBtn.addEventListener("click", () => signIn("discord", discordBtn, "Discord"));
twitchBtn.addEventListener("click", () => signIn("twitch", twitchBtn, "Twitch"));
spotifyBtn.addEventListener("click", () => signIn("spotify", spotifyBtn, "Spotify"));

// Roblox login
robloxBtn.addEventListener("click", () =>
  signIn("custom:roblox", robloxBtn, "Roblox")
);

// GitLab login
gitlabBtn.addEventListener("click", () =>
  signIn("gitlab", gitlabBtn, "GitLab")
);

// Email login
emailLoginBtn.addEventListener("click", async () => {
  const email = emailInput.value.trim();
  const password = passwordInput.value;

  if (!email || !password) {
    status.textContent = "Enter your email and password.";
    return;
  }

  emailLoginBtn.disabled = true;
  status.textContent = "Logging in...";

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password
  });

  emailLoginBtn.disabled = false;

  if (error) {
    if (
      error.code === "email_not_confirmed" ||
      error.message.toLowerCase().includes("email not confirmed")
    ) {
      status.textContent =
        "You will need to verify your email before logging in. Check your email.";
    } else {
      status.textContent = error.message;
    }
  } else {
    status.textContent = "Login successful!";
  }
});

// Open registration page
signupBtn.addEventListener("click", () => {
  window.location.href = new URL("createaccount/", window.location.href).href;
});

// Sign out
logoutBtn.addEventListener("click", async () => {
  status.textContent = "Signing out...";

  const { error } = await supabase.auth.signOut();

  if (error) {
    status.textContent = error.message;
  } else {
    status.textContent = "Signed out successfully.";
  }
});

// Load game
function loadGame() {
  loginScreen.style.display = "none";
  game.style.display = "block";

  if (!gameFrame.src) {
    gameFrame.src = GAME_URL;
  }
}

continueBtn.addEventListener("click", loadGame);
loggedInContinue.addEventListener("click", loadGame);

supabase.auth.onAuthStateChange((event, session) => {
  updateUser(session?.user || null);
});

// Initial setup
checkLogin();

// Show message after registration redirect
const params = new URLSearchParams(window.location.search);

if (params.get("check_email") === "1") {
  status.textContent =
    "Account created! Please check your email and verify your address before logging in.";

  window.history.replaceState({}, document.title, window.location.pathname);
}
