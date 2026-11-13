import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm";

const SUPABASE_URL = "https://jvzsyeotmencofyfuirj.supabase.co";
const SUPABASE_KEY = "sb_publishable_jT4IAvc6SSevUZivTuqbIg_Cr7pj8F7";

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const form = document.getElementById("signup-form");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const confirmPasswordInput = document.getElementById("confirm-password");
const createBtn = document.getElementById("create-btn");
const status = document.getElementById("status");

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const email = emailInput.value.trim();
  const password = passwordInput.value;
  const confirmPassword = confirmPasswordInput.value;

  if (password.length < 6) {
    status.textContent = "Password must be at least 6 characters.";
    return;
  }

  if (password !== confirmPassword) {
    status.textContent = "Passwords do not match.";
    return;
  }

  createBtn.disabled = true;
  status.textContent = "Creating your account...";

  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo:
          "https://placeholder67-sudo.github.io/3x3-eggs-beta/"
      }
    });

    if (error) {
      status.textContent = error.message;
      createBtn.disabled = false;
      return;
    }

    if (data.session) {
      status.textContent = "Account created! Redirecting...";

      window.location.href =
        "https://placeholder67-sudo.github.io/3x3-eggs-beta/";

    } else {
      status.textContent =
        "Account created! Redirecting to login...";

      setTimeout(() => {
        window.location.href =
          "https://placeholder67-sudo.github.io/3x3-eggs-beta/?check_email=1";
      }, 1800);
    }

  } catch (error) {
    status.textContent = "Something went wrong: " + error.message;
    createBtn.disabled = false;
  }
});
