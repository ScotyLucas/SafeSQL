document.getElementById("installForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const formData = new FormData(e.target);
  const data = Object.fromEntries(formData.entries());

  const res = await fetch("/api/install", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });

  const result = await res.json();
  if (result.success) {
    document.getElementById("result").innerText = "Telepítés sikeres! Újraindítás után be tudsz lépni.";
  } else {
    document.getElementById("result").innerText = "Hiba: " + result.error;
  }
});
