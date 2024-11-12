// 選取所有 <span> 元素
var spans = document.querySelectorAll('span.tts');

// 函數來取得語音列表
function loadVoices() {
    const voices = window.speechSynthesis.getVoices();
  
    if (voices.length > 0) {
      console.log('語音列表已加載:', voices);
    } else {
      console.log('尚未找到語音，稍後重試。');
    }
}

// 檢查語音是否已經加載
if (speechSynthesis.getVoices().length !== 0) {
    // 語音庫已經加載，立即調用函數
    loadVoices();
} else {
// 語音庫尚未加載，監聽 voiceschanged 事件
    window.speechSynthesis.onvoiceschanged = function() {
        loadVoices();
    };
}

// 為每個 <span> 元素添加點擊事件
spans.forEach(function(span) {
    span.addEventListener('click', function() {
        // 需要加入底下判斷，不然手機好像會不講話
        if (window.speechSynthesis.speaking) {
            console.log("正在講話，請稍候...");
            window.speechSynthesis.cancel(); // 停止目前的語音
        }

        // 取得被點擊的 <span> 內的文字
        var text = span.getAttribute('data-tts');
        // console.log(text);
        if (!text)
        {
            text = span.innerText;
        }

        // var text = span.innerText;
        
        // 取得 lang 屬性
        var lang = span.getAttribute('lang');
        // console.log(lang);
        // var voices = null;
        // 建立 SpeechSynthesisUtterance 物件
        var utterance = new SpeechSynthesisUtterance(text);

        // 設定語言
        utterance.lang = lang;

        // 選擇聲音
        // TTS可用的聲音:
        // Haruka
        // Ichiro
        // Sayaka
        // Ayumi

        // 
        var name = span.getAttribute('name');
        var selectedVoice = null;
        
        voices = window.speechSynthesis.getVoices().filter(voice => voice.lang===lang);
        // console.log(voices.length);
        if (voices.length > 0) {
            // console.log(name);
            if (name){
                selectedVoice = voices.filter(voice => voice.name.includes(name));
                if (selectedVoice){
                    utterance.voice = selectedVoice[0];
                }
            }

            // var strOut = "";
            // for (var i=0; i<voices.length; i++) {
            //     strOut += voices[i].name + "\n";
            // }
            // alert(strOut);

            // 使用 TTS 朗讀文字
            window.speechSynthesis.speak(utterance);
        }


    });
});

function convertFurigana() {
    // 選擇所有帶有 class 'jp' 的 span
    const elements = document.querySelectorAll('span.tts, span.hg');

    elements.forEach(element => {
        // 提取內容
        let text = element.innerHTML;

        // 正則表達式查找 [A|B] 格式
        const regex = /\[([^\?]+)\?([^\]]+)\]/g;
        let matches;

        // 替換 [A|B] 格式為 <ruby> 標籤的結構
        while ((matches = regex.exec(text)) !== null) {
            const kanji = matches[1]; // 漢字部分
            const furigana = matches[2]; // 振假名部分
            
            // 構造 ruby 標籤結構
            const ruby = `<ruby>${kanji}<rp>(</rp><rt>${furigana}</rt><rp>)</rp></ruby>`;
            
            // 用 <ruby> 標籤替換 [A|B] 的部分
            text = text.replace(matches[0], ruby);
        }

        // 更新 HTML 內容
        element.innerHTML = text;
    });
}

// 當 DOM 加載完成後執行轉換
document.addEventListener('DOMContentLoaded', convertFurigana);