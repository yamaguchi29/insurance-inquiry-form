// --- 設定項目 ---
const LIFF_ID = "2009133124-AF3hgmtv";
const GAS_URL =
  "https://script.google.com/macros/s/AKfycbzxx1ipIla6dGqXSCoRTdO7Z8eB_jTatZ0MUKQYf66uuGEUNDdBP8NVlzksW_9sg7aXlw/exec";

async function initLiff() {
  try {
    await liff.init({ liffId: LIFF_ID });

    // PCブラウザなどの外部ブラウザでログインしていない場合
    if (!liff.isLoggedIn() && !liff.isInClient()) {
      // 自動でログイン画面へ
      liff.login();
    }
  } catch (error) {
    console.error("LIFF初期化失敗", error);
  }
}

document.getElementById("submit-btn").addEventListener("click", async () => {
  const btn = document.getElementById("submit-btn");
  let userName = "不明なユーザー";
  let userId = "";

  try {
    // LINEアプリ内、またはログイン済みの場合
    if (liff.isLoggedIn()) {
      const profile = await liff.getProfile();
      userName = profile.displayName;
      userId = profile.userId;
    } else {
      // PCなどで未ログイン時にボタンを押した場合のガード
      alert("LINEログインが必要です");
      liff.login();
      return;
    }

    const name = document.getElementById("name").value;
    const phone = document.getElementById("phone").value;
    if (!name || !phone) {
      alert("必須項目を入力してください");
      return;
    }

    btn.disabled = true;
    btn.innerText = "送信中...";

    const data = {
      userId: userId,
      userName: userName,
      policyNumber: document.getElementById("policy-number").value,
      name: name,
      phone: phone,
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
    alert("エラー詳細:\n" + error.name + ": " + error.message);
    btn.disabled = false;
    btn.innerText = "スプレッドシートに保存";
  }
});

initLiff();
