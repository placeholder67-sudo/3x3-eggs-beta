import { createClient } from
"https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm";

// SUPABASE CONFIGURATION

const SUPABASE_URL =
"https://jvzsyeotmencofyfuirj.supabase.co";

const SUPABASE_KEY =
"sb_publishable_jT4IAvc6SSevUZivTuqbIg_Cr7pj8F7";

const supabase = createClient(
    SUPABASE_URL,
    SUPABASE_KEY
);

// GAME URL

const GAME_URL =
"https://www.timestables.com/gf/3x3-steal-egg/20261112-1036/index.html?timestables=10&lang=da&multiplayer=wss://tsu3.tafeldiploma.nl/eggs/multiplayer&swap=1";

// ELEMENTS

const loginScreen = document.getElementById("login-screen");

const signedOut = document.getElementById("signed-out");
const signedIn = document.getElementById("signed-in");

const loginBtn = document.getElementById("login-btn");
const logoutBtn = document.getElementById("logout-btn");

const continueBtn = document.getElementById("continue-btn");
const loggedInContinue = document.getElementById("logged-in-continue");

const avatar = document.getElementById("avatar");
const username = document.getElementById("username");
const status = document.getElementById("status");

const game = document.getElementById("game");

// SHOW USER

function updateUser(user) {

    if (!user) {

        signedOut.hidden = false;
        signedIn.hidden = true;

        return;
    }

    const metadata = user.user_metadata || {};

    username.textContent =
        metadata.user_name ||
        metadata.preferred_username ||
        metadata.name ||
        user.email ||
        "GitHub User";

    avatar.src =
        metadata.avatar_url ||
        metadata.picture ||
        "";

    signedOut.hidden = true;
    signedIn.hidden = false;
}

// CHECK EXISTING LOGIN

async function checkLogin() {

    const { data, error } =
        await supabase.auth.getSession();

    if (error) {
        status.textContent = error.message;
        return;
    }

    updateUser(data.session?.user || null);
}

checkLogin();

// GITHUB LOGIN

loginBtn.addEventListener("click", async () => {

    loginBtn.disabled = true;
    status.textContent = "Redirecting to GitHub...";

    const redirectURL =
        window.location.origin +
        window.location.pathname;

    const { error } =
        await supabase.auth.signInWithOAuth({

            provider: "github",

            options: {
                redirectTo: redirectURL
            }

        });

    if (error) {

        status.textContent = error.message;
        loginBtn.disabled = false;

    }

});

// SIGN OUT

logoutBtn.addEventListener("click", async () => {

    logoutBtn.disabled = true;
    status.textContent = "Signing out...";

    const { error } =
        await supabase.auth.signOut();

    logoutBtn.disabled = false;

    if (error) {

        status.textContent = error.message;
        return;

    }

    updateUser(null);

    status.textContent = "Successfully signed out!";

});

// LOAD GAME

function loadGame() {

    loginScreen.classList.add("fade");

    setTimeout(() => {

        loginScreen.remove();

        const iframe =
            document.createElement("iframe");

        iframe.src = GAME_URL;

        iframe.allow =
            "fullscreen; autoplay";

        iframe.allowFullscreen = true;

        iframe.title = "3x3 Steal Egg";

        game.appendChild(iframe);

    }, 400);

}

// CONTINUE WITHOUT LOGIN

continueBtn.addEventListener("click", () => {

    loadGame();

});

// CONTINUE WHILE LOGGED IN

loggedInContinue.addEventListener("click", () => {

    loadGame();

});

// AUTOMATIC SESSION UPDATES

supabase.auth.onAuthStateChange(
    (_event, session) => {

        updateUser(session?.user || null);

    }
);
