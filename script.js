// --- 設定項目 ---
const LIFF_ID = "2009133124-tG6paVoL";
const GAS_URL =
  "https://script.google.com/macros/s/AKfycbwNQckWtUJ08ycrH3FCH4eslU_LG9cMKSf49ABAtX8KQ0rVcXb0vFsnLrmxAfESt1pqaA/exec";

async function initLiff() {
  try {
    await liff.init({ liffId: LIFF_ID });

    // PCブラウザなどの外部ブラウザでログインしていない場合
    if (!liff.isLoggedIn() && !liff.isInClient()) {
      // 自動でログイン画面へ（不要ならここを消してボタン側で制御も可）
      liff.login();
    }
  } catch (error) {
    console.error("LIFF初期化失敗", error);
  }
}

document.getElementById("submit-btn").addEventListener("click", async () => {
  const btn = document.getElementById("submit-btn");
  let userName = "不明なユーザー";

  try {
    // LINEアプリ内、またはログイン済みの場合のみプロフィール取得
    if (liff.isLoggedIn()) {
      const profile = await liff.getProfile();
      userName = profile.displayName;
    }

    const amount = document.getElementById("amount").value;
    if (!amount) {
      alert("金額を入力してください");
      return;
    }

    btn.disabled = true;
    btn.innerText = "送信中...";

    const data = {
      userName: userName,
      category: document.getElementById("category").value,
      amount: document.getElementById("amount").value,
      memo: document.getElementById("memo").value,
    };

    await fetch(GAS_URL, {
      method: "POST",
      mode: "no-cors",
      headers: { "Content-Type": "text/plain" },
      body: JSON.stringify(data),
    });

    alert(userName + "さんのデータを送信しました！");

    // LINEアプリ内なら閉じる、PCなら画面リセット
    if (liff.isInClient()) {
      liff.closeWindow();
    } else {
      location.reload();
    }
  } catch (error) {
    console.error(error);
    alert("エラーが発生しました");
    btn.disabled = false;
    btn.innerText = "スプレッドシートに保存";
  }
});

initLiff();
