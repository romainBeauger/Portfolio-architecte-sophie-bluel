const API_URL = "http://localhost:5678";

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("loginForm");

  console.log(form);
  

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("motDePasse").value.trim();
    const errorLogin = document.getElementById("errorLogin");

    try {
      const response = await fetch(`${API_URL}/api/users/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });

      if (!response.ok) throw new Error("Email ou mot de passe incorrect");

      const data = await response.json();
      localStorage.setItem("token", data.token);
      window.location.href = "/index.html";
    } catch (error) {
      errorLogin.textContent = error.message;
    }
  });
});
